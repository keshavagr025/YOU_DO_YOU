import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';
import SalaryEstimate from '../models/SalaryEstimate.js';
import JobSearchResult from '../models/JobSearchResult.js';

// Enhanced rate limiting
const salaryApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Increased limit
  message: {
    success: false,
    error: 'Too many salary requests, please try again later',
    retryAfter: '15 minutes'
  }
});

const router = express.Router();
router.use(salaryApiLimiter);

// RapidAPI config
const RAPIDAPI_CONFIG = {
  key: process.env.RAPIDAPI_KEY,
  host: 'jsearch.p.rapidapi.com',
  baseUrl: 'https://jsearch.p.rapidapi.com'
};

// Experience level mapping
const EXPERIENCE_MAPPING = {
  'entry': 'under_3_years_experience',
  'junior': 'under_3_years_experience', 
  'mid': '3_6_years_experience',
  'senior': 'more_than_6_years_experience',
  'lead': 'more_than_6_years_experience',
  'principal': 'more_than_6_years_experience'
};

// Location type mapping
const LOCATION_TYPE_MAPPING = {
  'remote': 'remote',
  'onsite': 'onsite',
  'hybrid': 'hybrid',
  'any': 'any'
};

// Enhanced fetch function
async function fetchFromJSearch(endpoint, params = {}) {
  const url = new URL(`${RAPIDAPI_CONFIG.baseUrl}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  console.log("📡 API Request:", url.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPIDAPI_CONFIG.host,
      'x-rapidapi-key': RAPIDAPI_CONFIG.key,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`JSearch API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Enhanced salary estimate with real-time updates
router.get('/estimate', async (req, res) => {
  try {
    const { 
      job_title, 
      location, 
      experience = 'mid',
      location_type = 'any',
      real_time = false 
    } = req.query;

    // Input validation
    if (!job_title || !location) {
      return res.status(400).json({
        success: false,
        error: 'job_title and location parameters are required',
        required_params: ['job_title', 'location'],
        optional_params: ['experience', 'location_type', 'real_time']
      });
    }

    const io = req.app.get('io');
    const room = `${job_title}-${location}`.toLowerCase().replace(/\s+/g, '-');

    // Real-time status update
    if (real_time === 'true' && io) {
      io.to(room).emit('salary-update-status', { 
        status: 'processing', 
        message: 'Fetching salary data...',
        timestamp: new Date().toISOString()
      });
    }

    // Map experience level
    const mappedExperience = EXPERIENCE_MAPPING[experience.toLowerCase()] || 'ALL';
    const mappedLocationType = LOCATION_TYPE_MAPPING[location_type.toLowerCase()] || 'ANY';

    // Check cache first (within last 24 hours)
    const recentEstimate = await SalaryEstimate.findOne({
      job_title: { $regex: new RegExp(job_title, 'i') },
      location: { $regex: new RegExp(location, 'i') },
      experience_level: experience,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ timestamp: -1 });

    if (recentEstimate && real_time !== 'true') {
      console.log('📋 Using cached salary data');
      return res.json({
        success: true,
        data: recentEstimate,
        cached: true,
        cache_age: Date.now() - recentEstimate.timestamp.getTime()
      });
    }

    // Fetch fresh data
    const salaryData = await fetchFromJSearch('/estimated-salary', {
      job_title: job_title.trim(),
      location: location.trim(),
      job_requirements: mappedExperience,
      employment_types: 'FULLTIME'
    });

    if (salaryData.status === 'OK' && salaryData.data?.length > 0) {
      const estimate = salaryData.data[0];
      
      // Enhanced salary calculation
      const salaryStats = calculateSalaryStats(salaryData.data, experience);
      
      const result = {
        job_title: estimate.job_title || job_title,
        location: estimate.location || location,
        experience_level: experience,
        location_type: location_type,
        min_salary: salaryStats.min,
        max_salary: salaryStats.max,
        average_salary: salaryStats.average,
        median_salary: salaryStats.median,
        percentile_25: salaryStats.p25,
        percentile_75: salaryStats.p75,
        salary_currency: estimate.salary_currency || 'USD',
        salary_period: estimate.salary_period || 'yearly',
        publisher_name: estimate.publisher_name,
        publisher_link: estimate.publisher_link,
        confidence_score: calculateConfidenceScore(salaryData.data),
        market_demand: await getMarketDemand(job_title, location),
        timestamp: new Date(),
        source: 'JSearch API Enhanced'
      };

      // Save to database
      await SalaryEstimate.create(result);

      // Real-time update
      if (real_time === 'true' && io) {
        io.to(room).emit('salary-data-updated', {
          status: 'success',
          data: result,
          timestamp: new Date().toISOString()
        });
      }

      return res.json({
        success: true,
        data: result,
        metadata: {
          query: { job_title, location, experience, location_type },
          total_data_points: salaryData.data.length,
          api_status: salaryData.status,
          processing_time: Date.now() - Date.now(),
          real_time_enabled: real_time === 'true'
        }
      });
    }

    // No data found
    if (real_time === 'true' && io) {
      io.to(room).emit('salary-update-status', {
        status: 'no_data',
        message: 'No salary data found for this combination',
        timestamp: new Date().toISOString()
      });
    }

    res.status(404).json({
      success: false,
      error: 'No salary data found',
      suggestions: [
        'Try a more general job title',
        'Check the location spelling',
        'Try different experience level'
      ]
    });

  } catch (error) {
    console.error('❌ Estimate Error:', error.message);
    
    const io = req.app.get('io');
    if (req.query.real_time === 'true' && io) {
      const room = `${req.query.job_title}-${req.query.location}`.toLowerCase().replace(/\s+/g, '-');
      io.to(room).emit('salary-update-status', {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

// Enhanced job search with experience filtering
router.get('/search', async (req, res) => {
  try {
    const {
      query,
      experience = 'mid',
      location_type = 'any',
      page = 1,
      num_pages = 1,
      date_posted = 'all',
      employment_types = 'FULLTIME',
      real_time = false
    } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'query parameter is required',
        example: '/search?query=software engineer&experience=mid&location_type=remote'
      });
    }

    const io = req.app.get('io');
    const room = `search-${query}`.toLowerCase().replace(/\s+/g, '-');

    if (real_time === 'true' && io) {
      io.to(room).emit('job-search-status', {
        status: 'processing',
        message: 'Searching for jobs...',
        timestamp: new Date().toISOString()
      });
    }

    // Map experience to job requirements
    const mappedExperience = EXPERIENCE_MAPPING[experience.toLowerCase()] || 'ALL';
    const mappedLocationType = LOCATION_TYPE_MAPPING[location_type.toLowerCase()];

    const searchParams = {
      query: query.trim(),
      page,
      num_pages,
      date_posted,
      employment_types,
      job_requirements: mappedExperience
    };

    // Add location type filter if specified
    if (mappedLocationType && mappedLocationType !== 'any') {
      if (mappedLocationType === 'remote') {
        searchParams.remote_jobs_only = true;
      }
    }

    const jobData = await fetchFromJSearch('/search', searchParams);

    if (jobData.status === 'OK' && jobData.data) {
      // Enhanced job processing
      const processedData = await processJobSearchResults(jobData.data, experience);
      
      const responseData = {
        jobs: processedData.jobs,
        salary_insights: processedData.salaryInsights,
        market_analysis: processedData.marketAnalysis,
        experience_filter: experience,
        location_type_filter: location_type,
        timestamp: new Date().toISOString(),
        source: 'JSearch API Enhanced'
      };

      // Save to database
      await JobSearchResult.create({
        query,
        experience_level: experience,
        location_type,
        jobs: responseData.jobs,
        salary_insights: responseData.salary_insights,
        market_analysis: responseData.market_analysis,
        source: responseData.source,
        timestamp: new Date()
      });

      // Real-time update
      if (real_time === 'true' && io) {
        io.to(room).emit('job-search-completed', {
          status: 'success',
          data: responseData,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: responseData,
        metadata: {
          query: req.query,
          total_results: jobData.data.length,
          filtered_results: processedData.jobs.length,
          api_status: jobData.status,
          real_time_enabled: real_time === 'true'
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'No job data found',
        suggestions: [
          'Try broader search terms',
          'Adjust experience level filter',
          'Try different location type'
        ]
      });
    }
  } catch (error) {
    console.error('❌ Search Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error', 
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

// Utility functions
function calculateSalaryStats(salaryData, experience) {
  const salaries = salaryData
    .filter(item => item.min_salary && item.max_salary)
    .map(item => (item.min_salary + item.max_salary) / 2)
    .sort((a, b) => a - b);

  if (salaries.length === 0) return null;

  const average = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  const median = salaries.length % 2 === 0 
    ? Math.round((salaries[salaries.length / 2 - 1] + salaries[salaries.length / 2]) / 2)
    : salaries[Math.floor(salaries.length / 2)];

  return {
    min: Math.min(...salaries),
    max: Math.max(...salaries),
    average,
    median,
    p25: salaries[Math.floor(salaries.length * 0.25)],
    p75: salaries[Math.floor(salaries.length * 0.75)]
  };
}

function calculateConfidenceScore(data) {
  let score = 0;
  if (data.length >= 5) score += 30;
  if (data.some(item => item.publisher_name)) score += 20;
  if (data.some(item => item.min_salary && item.max_salary)) score += 50;
  return Math.min(score, 100);
}

async function getMarketDemand(jobTitle, location) {
  try {
    // Quick search to assess market demand
    const searchData = await fetchFromJSearch('/search', {
      query: jobTitle,
      num_pages: 1,
      employment_types: 'FULLTIME'
    });
    
    return {
      total_openings: searchData.data?.length || 0,
      demand_level: searchData.data?.length > 50 ? 'High' : 
                   searchData.data?.length > 20 ? 'Medium' : 'Low'
    };
  } catch (error) {
    return { total_openings: 0, demand_level: 'Unknown' };
  }
}

async function processJobSearchResults(jobs, experienceLevel) {
  const jobsWithSalary = jobs.filter(job => 
    job.job_min_salary || job.job_max_salary || job.job_salary
  );

  // Enhanced salary insights
  const minSalaries = jobsWithSalary.map(j => j.job_min_salary).filter(s => s > 0);
  const maxSalaries = jobsWithSalary.map(j => j.job_max_salary).filter(s => s > 0);

  const salaryInsights = {
    total_jobs: jobs.length,
    jobs_with_salary: jobsWithSalary.length,
    average_min_salary: minSalaries.length > 0 ? Math.round(minSalaries.reduce((a, b) => a + b, 0) / minSalaries.length) : null,
    average_max_salary: maxSalaries.length > 0 ? Math.round(maxSalaries.reduce((a, b) => a + b, 0) / maxSalaries.length) : null,
    salary_range: {
      min: minSalaries.length > 0 ? Math.min(...minSalaries) : null,
      max: maxSalaries.length > 0 ? Math.max(...maxSalaries) : null
    },
    top_companies: [],
    top_locations: [],
    experience_level: experienceLevel
  };

  // Company and location analysis
  const companyCount = {}, locationCount = {};
  jobsWithSalary.forEach(job => {
    if (job.employer_name) {
      companyCount[job.employer_name] = (companyCount[job.employer_name] || 0) + 1;
    }
    if (job.job_city && job.job_state) {
      const loc = `${job.job_city}, ${job.job_state}`;
      locationCount[loc] = (locationCount[loc] || 0) + 1;
    }
  });

  salaryInsights.top_companies = Object.entries(companyCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      job_count: count,
      avg_salary: calculateAvgSalaryByCompany(jobsWithSalary, name)
    }));

  salaryInsights.top_locations = Object.entries(locationCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([loc, count]) => ({
      location: loc,
      job_count: count,
      avg_salary: calculateAvgSalaryByLocation(jobsWithSalary, loc)
    }));

  // Market analysis
  const marketAnalysis = {
    remote_percentage: (jobs.filter(j => j.job_is_remote).length / jobs.length * 100).toFixed(1),
    top_skills: extractTopSkills(jobs),
    hiring_urgency: analyzeHiringUrgency(jobs),
    company_sizes: analyzeCompanySizes(jobs)
  };

  return {
    jobs: jobs.slice(0, 20).map(job => ({
      ...job,
      job_posted_at: parseRelativeDate(job.job_posted_at),
      relevance_score: calculateRelevanceScore(job, experienceLevel)
    })),
    salaryInsights,
    marketAnalysis
  };
}

// Additional utility functions for enhanced analysis
function calculateAvgSalaryByCompany(jobs, companyName) {
  const companyJobs = jobs.filter(j => j.employer_name === companyName && j.job_min_salary && j.job_max_salary);
  if (companyJobs.length === 0) return null;
  
  const avgSalaries = companyJobs.map(j => (j.job_min_salary + j.job_max_salary) / 2);
  return Math.round(avgSalaries.reduce((a, b) => a + b, 0) / avgSalaries.length);
}

function calculateAvgSalaryByLocation(jobs, location) {
  const locationJobs = jobs.filter(j => 
    `${j.job_city}, ${j.job_state}` === location && j.job_min_salary && j.job_max_salary
  );
  if (locationJobs.length === 0) return null;
  
  const avgSalaries = locationJobs.map(j => (j.job_min_salary + j.job_max_salary) / 2);
  return Math.round(avgSalaries.reduce((a, b) => a + b, 0) / avgSalaries.length);
}

function extractTopSkills(jobs) {
  const skillKeywords = ['javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes', 'sql', 'java', 'c++'];
  const skillCounts = {};
  
  jobs.forEach(job => {
    const description = (job.job_description || '').toLowerCase();
    skillKeywords.forEach(skill => {
      if (description.includes(skill)) {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      }
    });
  });
  
  return Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, mentions: count }));
}

function analyzeHiringUrgency(jobs) {
  const urgentKeywords = ['urgent', 'immediate', 'asap', 'quickly'];
  const urgentJobs = jobs.filter(job => {
    const description = (job.job_description || '').toLowerCase();
    return urgentKeywords.some(keyword => description.includes(keyword));
  });
  
  return {
    urgent_jobs: urgentJobs.length,
    percentage: (urgentJobs.length / jobs.length * 100).toFixed(1)
  };
}

function analyzeCompanySizes(jobs) {
  const sizes = { startup: 0, small: 0, medium: 0, large: 0, enterprise: 0 };
  // This would require additional data or API calls to determine company size
  // For now, return placeholder data
  return sizes;
}

function calculateRelevanceScore(job, experienceLevel) {
  let score = 50; // Base score
  
  const description = (job.job_description || '').toLowerCase();
  const title = (job.job_title || '').toLowerCase();
  
  // Experience level matching
  const expKeywords = {
    entry: ['entry', 'junior', 'associate', 'graduate'],
    mid: ['mid', 'intermediate', '3-5 years', 'experienced'],
    senior: ['senior', 'lead', '5+ years', 'expert'],
    lead: ['lead', 'principal', 'architect', 'manager']
  };
  
  const relevantKeywords = expKeywords[experienceLevel] || [];
  relevantKeywords.forEach(keyword => {
    if (title.includes(keyword) || description.includes(keyword)) {
      score += 10;
    }
  });
  
  // Salary information bonus
  if (job.job_min_salary && job.job_max_salary) score += 15;
  
  // Recent posting bonus
  const postedDate = parseRelativeDate(job.job_posted_at);
  const daysSincePosted = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePosted <= 7) score += 10;
  
  return Math.min(score, 100);
}

function parseRelativeDate(relativeString) {
  if (typeof relativeString !== 'string') return new Date();

  const now = new Date();
  const match = relativeString.match(/(\d+)\s+(second|minute|hour|day|month|year)s?\s+ago/i);

  if (!match) return now;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'second': now.setSeconds(now.getSeconds() - value); break;
    case 'minute': now.setMinutes(now.getMinutes() - value); break;
    case 'hour': now.setHours(now.getHours() - value); break;
    case 'day': now.setDate(now.getDate() - value); break;
    case 'month': now.setMonth(now.getMonth() - value); break;
    case 'year': now.setFullYear(now.getFullYear() - value); break;
  }

  return now;
}

// Real-time salary comparison endpoint
router.get('/compare', async (req, res) => {
  try {
    const { job_titles, location, experience = 'mid' } = req.query;
    
    if (!job_titles || !location) {
      return res.status(400).json({
        success: false,
        error: 'job_titles (comma-separated) and location are required'
      });
    }

    const titles = job_titles.split(',').map(t => t.trim());
    const comparisons = [];

    for (const title of titles) {
      try {
        const salaryData = await fetchFromJSearch('/estimated-salary', {
          job_title: title,
          location: location.trim(),
          job_requirements: EXPERIENCE_MAPPING[experience.toLowerCase()] || 'ALL'
        });

        if (salaryData.status === 'OK' && salaryData.data?.length > 0) {
          const stats = calculateSalaryStats(salaryData.data, experience);
          comparisons.push({
            job_title: title,
            salary_stats: stats,
            data_points: salaryData.data.length
          });
        }
      } catch (error) {
        console.error(`Error fetching ${title}:`, error.message);
      }
    }

    res.json({
      success: true,
      data: {
        comparisons,
        location,
        experience_level: experience,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Compare Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Enhanced history endpoints
router.get('/history/estimates', async (req, res) => {
  try {
    const { experience, location, limit = 10 } = req.query;
    
    const filter = {};
    if (experience) filter.experience_level = experience;
    if (location) filter.location = { $regex: new RegExp(location, 'i') };

    const estimates = await SalaryEstimate.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
      
    res.json({ 
      success: true, 
      data: estimates,
      filter_applied: filter 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch estimate history' 
    });
  }
});

router.get('/history/searches', async (req, res) => {
  try {
    const { experience, limit = 10 } = req.query;
    
    const filter = {};
    if (experience) filter.experience_level = experience;

    const searches = await JobSearchResult.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
      
    res.json({ 
      success: true, 
      data: searches,
      filter_applied: filter 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch job search history' 
    });
  }
});

// Enhanced health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Enhanced Salary API is running',
    timestamp: new Date().toISOString(),
    features: [
      'Real-time updates via WebSocket',
      'Experience-based filtering',
      'Enhanced salary statistics',
      'Market analysis',
      'Salary comparison'
    ],
    endpoints: {
      estimate: '/api/salary/estimate?job_title=SOFTWARE_ENGINEER&location=NEW_YORK&experience=mid&real_time=true',
      search: '/api/salary/search?query=software+engineer&experience=senior&location_type=remote&real_time=true',
      compare: '/api/salary/compare?job_titles=software engineer,data scientist&location=San Francisco&experience=mid',
      history_estimates: '/api/salary/history/estimates?experience=mid&limit=20',
      history_searches: '/api/salary/history/searches?experience=senior&limit=15'
    }
  });
});

export default router;