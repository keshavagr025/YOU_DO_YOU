import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  const {
    query = 'developer jobs',
    location = 'chicago',
    page = '1',
    country = 'us',
    date_posted = 'all'
  } = req.query;

  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query: `${query} in ${location}`,
      page,
      num_pages: '1',
      country,
      date_posted
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const jobs = response.data.data;

    const formatted = jobs.map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country || 'N/A',
      type: job.job_employment_type || 'N/A',
      salary: job.job_salary || 'Not specified',
      postedAt: new Date(job.job_posted_at_datetime_utc),
      description: job.job_description,
      requirements: [
        job.job_required_experience?.required_experience_in_months,
        job.job_required_education?.education_level
      ].filter(Boolean),
      applyUrl: job.job_apply_link || '#',
      isNew: true
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('❌ Error fetching jobs:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to fetch jobs',
      details: err.response?.data || err.message
    });
  }
});

export default router;
