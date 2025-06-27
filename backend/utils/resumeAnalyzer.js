// utils/resumeAnalyzer.js
import { CohereClient } from "cohere-ai";
import dotenv from 'dotenv';

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
});

console.log("Cohere API Key in resumeAnalyzer.js:", process.env.COHERE_API_KEY ? "✅ Loaded" : "❌ Missing");

// Rate limiting queue for Cohere API
class APIQueue {
  constructor(requestsPerMinute = 100) { // Cohere has higher rate limits
    this.queue = [];
    this.processing = false;
    this.interval = Math.ceil(60000 / requestsPerMinute); // Convert to milliseconds
    this.lastRequestTime = 0;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    
    while (this.queue.length > 0) {
      const { request, resolve, reject } = this.queue.shift();
      
      try {
        // Ensure minimum interval between requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.interval) {
          await new Promise(res => setTimeout(res, this.interval - timeSinceLastRequest));
        }

        const result = await this.retryWithBackoff(request);
        this.lastRequestTime = Date.now();
        resolve(result);
        
      } catch (error) {
        reject(error);
      }
    }
    
    this.processing = false;
  }

  async retryWithBackoff(request, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await request();
      } catch (error) {
        // Check if it's a rate limit error
        if (error.statusCode === 429 && attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000; // 1s, 2s, 4s + jitter
          console.log(`⏳ Rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Check if it's a quota exceeded error
        if (error.statusCode === 429 && error.message?.includes('quota')) {
          throw new Error('Cohere quota exceeded. Please check your billing and usage limits.');
        }
        
        throw error;
      }
    }
  }
}

// Create a global queue instance
const apiQueue = new APIQueue(80); // 80 requests per minute to be safe

// Enhanced error handling wrapper
async function safeCohereCall(requestFn, fallbackValue = null) {
  try {
    return await apiQueue.add(requestFn);
  } catch (error) {
    console.error('Cohere API Error:', {
      statusCode: error.statusCode,
      message: error.message,
      body: error.body || 'unknown'
    });

    // Return fallback value instead of throwing
    if (fallbackValue !== null) {
      return fallbackValue;
    }
    
    throw error;
  }
}

// Calculate ATS Score based on job requirements
export async function calculateAtsScore(resume, jobRole) {
  try {
    const resumeText = resume.extractedText.toLowerCase();
    const skills = resume.extractedSkills.map(skill => skill.toLowerCase());

    const keywordMatches = [];
    const missedKeywords = [];
    let keywordScore = 0;

    for (const keyword of jobRole.keywords) {
      const term = keyword.term.toLowerCase();
      const synonyms = keyword.synonyms.map(s => s.toLowerCase());

      const isMatched = resumeText.includes(term) ||
        synonyms.some(synonym => resumeText.includes(synonym));

      if (isMatched) {
        keywordMatches.push(keyword.term);
        keywordScore += keyword.weight;
      } else {
        missedKeywords.push(keyword.term);
      }
    }

    const skillMatches = [];
    const missedSkills = [];
    let skillScore = 0;

    for (const requiredSkill of jobRole.requiredSkills) {
      const skillName = requiredSkill.name.toLowerCase();

      const isMatched = skills.some(skill =>
        skill.includes(skillName) || skillName.includes(skill)
      );

      if (isMatched) {
        skillMatches.push(requiredSkill.name);
        skillScore += requiredSkill.weight;
      } else {
        missedSkills.push(requiredSkill.name);
      }
    }

    const experienceScore = calculateExperienceScore(resume.experience, jobRole);

    const maxKeywordScore = jobRole.keywords.reduce((sum, kw) => sum + kw.weight, 0);
    const maxSkillScore = jobRole.requiredSkills.reduce((sum, skill) => sum + skill.weight, 0);

    const normalizedKeywordScore = maxKeywordScore > 0 ? (keywordScore / maxKeywordScore) * 30 : 0;
    const normalizedSkillScore = maxSkillScore > 0 ? (skillScore / maxSkillScore) * 50 : 0;
    const normalizedExperienceScore = experienceScore * 20;

    const totalScore = Math.min(100, Math.round(
      normalizedKeywordScore + normalizedSkillScore + normalizedExperienceScore
    ));

    // Try to generate AI suggestions using Cohere
    const suggestions = await generateSuggestions(resume, jobRole, {
      missedKeywords,
      missedSkills,
      currentScore: totalScore
    });

    return {
      atsScore: totalScore,
      matchedKeywords: keywordMatches,
      matchedSkills: skillMatches,
      missingKeywords: missedKeywords.slice(0, 5),
      missingSkills: missedSkills.slice(0, 5),
      suggestions: suggestions,
      breakdown: {
        keywordScore: Math.round(normalizedKeywordScore),
        skillScore: Math.round(normalizedSkillScore),
        experienceScore: Math.round(normalizedExperienceScore)
      }
    };
  } catch (error) {
    console.error('ATS calculation error:', error);
    throw new Error('Failed to calculate ATS score');
  }
}

// Calculate experience relevance score
function calculateExperienceScore(experiences, jobRole) {
  if (!experiences || experiences.length === 0) return 0;

  const relevantTerms = [
    ...jobRole.keywords.map(kw => kw.term.toLowerCase()),
    ...jobRole.requiredSkills.map(skill => skill.name.toLowerCase())
  ];

  let relevanceScore = 0;
  let totalExperiences = experiences.length;

  experiences.forEach(exp => {
    const expText = `${exp.title} ${exp.description}`.toLowerCase();
    const matchedTerms = relevantTerms.filter(term => expText.includes(term));

    if (matchedTerms.length > 0) {
      relevanceScore += Math.min(1, matchedTerms.length / 5);
    }
  });

  return Math.min(1, relevanceScore / totalExperiences);
}

// Generate AI-powered suggestions using Cohere with fallback
export async function generateSuggestions(resume, jobRole, analysisData) {
  const fallbackSuggestions = [
    `Add missing keywords: ${analysisData.missedKeywords.slice(0, 3).join(', ')}`,
    `Include these relevant skills: ${analysisData.missedSkills.slice(0, 3).join(', ')}`,
    'Quantify your achievements with specific numbers and metrics',
    'Use action verbs at the beginning of bullet points',
    'Ensure your resume format is ATS-friendly with clear sections'
  ];

  const prompt = `As an ATS optimization expert, provide 5 specific, actionable suggestions to improve this resume for a ${jobRole.title} position.

Current ATS Score: ${analysisData.currentScore}/100
Job Role: ${jobRole.title}
Job Level: ${jobRole.level}
Industry: ${jobRole.industry}

Missing Keywords: ${analysisData.missedKeywords.slice(0, 5).join(', ')}
Missing Skills: ${analysisData.missedSkills.slice(0, 5).join(', ')}

Current Skills: ${resume.extractedSkills.slice(0, 10).join(', ')}

Provide exactly 5 suggestions, each numbered 1-5, with specific actionable advice:`;

  const requestFn = async () => {
    return await cohere.chat({
      model: "command-light", // Using lighter model for cost efficiency
      message: prompt,
      temperature: 0.7,
      maxTokens: 400,
      preamble: "You are an expert ATS (Applicant Tracking System) optimization consultant. Provide clear, specific, and actionable advice to help job seekers improve their resume's ATS compatibility."
    });
  };

  try {
    const response = await safeCohereCall(requestFn, null);
    
    if (!response) {
      console.log('🔄 Using fallback suggestions due to API unavailability');
      return fallbackSuggestions;
    }

    const suggestions = response.text
      .split('\n')
      .filter(line => line.match(/^\d+[\.\)]/))
      .map(line => line.replace(/^\d+[\.\)\s]*/, '').trim())
      .filter(suggestion => suggestion.length > 0);

    return suggestions.length > 0 ? suggestions.slice(0, 5) : fallbackSuggestions;

  } catch (error) {
    console.error('AI suggestions error:', error.message);
    return fallbackSuggestions;
  }
}

// Extract skills using Cohere AI with fallback to basic keyword extraction
export async function extractSkillsWithAI(resumeText) {
  // Basic fallback skill extraction
  const fallbackSkillExtraction = (text) => {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 
      'SQL', 'MongoDB', 'Express', 'Git', 'Docker', 'AWS', 'TypeScript',
      'Angular', 'Vue.js', 'PHP', 'C++', 'C#', 'Swift', 'Kotlin',
      'Project Management', 'Leadership', 'Communication', 'Problem Solving',
      'Agile', 'Scrum', 'Data Analysis', 'Machine Learning', 'DevOps',
      'Kubernetes', 'Linux', 'Windows', 'Azure', 'GCP', 'REST API',
      'GraphQL', 'Firebase', 'Redis', 'PostgreSQL', 'MySQL'
    ];
    
    const textLower = text.toLowerCase();
    return commonSkills.filter(skill => 
      textLower.includes(skill.toLowerCase())
    ).slice(0, 15); // Limit to 15 skills
  };

  const prompt = `Extract all technical and professional skills from this resume text. Return only a JSON array of skills.

Examples of skills to look for:
- Programming languages (JavaScript, Python, Java, etc.)
- Frameworks and libraries (React, Angular, Express, etc.)
- Databases (SQL, MongoDB, PostgreSQL, etc.)
- Tools and platforms (Git, Docker, AWS, etc.)
- Soft skills (Leadership, Communication, Project Management, etc.)

Resume text:
${resumeText.substring(0, 2000)}

Return exactly in this format: ["skill1", "skill2", "skill3"]
Limit to 15 most relevant skills.`;

  const requestFn = async () => {
    return await cohere.chat({
      model: "command-light",
      message: prompt,
      temperature: 0.1,
      maxTokens: 200,
      preamble: "You are a resume parser that extracts skills. Always respond with valid JSON array format."
    });
  };

  try {
    const response = await safeCohereCall(requestFn, null);
    
    if (!response) {
      console.log('🔄 Using fallback skill extraction');
      return fallbackSkillExtraction(resumeText);
    }

    const responseText = response.text.trim();
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      try {
        const skills = JSON.parse(jsonMatch[0]);
        return Array.isArray(skills) ? skills.slice(0, 15) : fallbackSkillExtraction(resumeText);
      } catch (parseError) {
        console.warn('JSON parsing failed, using fallback');
        return fallbackSkillExtraction(resumeText);
      }
    }

    return fallbackSkillExtraction(resumeText);
    
  } catch (error) {
    console.error('AI skill extraction error:', error.message);
    return fallbackSkillExtraction(resumeText);
  }
}

// Enhanced resume content analysis using Cohere
export async function analyzeResumeContent(resumeText) {
  const fallbackAnalysis = {
    strengths: ['Professional experience listed', 'Skills section present'],
    weaknesses: ['Could benefit from more quantified achievements', 'Consider adding more keywords'],
    suggestions: ['Add metrics to demonstrate impact', 'Include relevant certifications']
  };

  const prompt = `Analyze this resume and provide feedback in JSON format:

{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"], 
  "suggestions": ["suggestion1", "suggestion2"]
}

Resume text:
${resumeText.substring(0, 1500)}

Focus on ATS optimization, keyword usage, formatting, and content quality.`;

  const requestFn = async () => {
    return await cohere.chat({
      model: "command-light",
      message: prompt,
      temperature: 0.3,
      maxTokens: 300,
      preamble: "You are a professional resume reviewer. Provide constructive feedback in the exact JSON format requested."
    });
  };

  try {
    const response = await safeCohereCall(requestFn, null);
    
    if (!response) {
      return fallbackAnalysis;
    }

    const responseText = response.text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          strengths: analysis.strengths || fallbackAnalysis.strengths,
          weaknesses: analysis.weaknesses || fallbackAnalysis.weaknesses,
          suggestions: analysis.suggestions || fallbackAnalysis.suggestions
        };
      } catch (parseError) {
        console.warn('Analysis JSON parsing failed, using fallback');
        return fallbackAnalysis;
      }
    }

    return fallbackAnalysis;
    
  } catch (error) {
    console.error('Resume content analysis error:', error.message);
    return fallbackAnalysis;
  }
}

// Resume completeness validation
export function validateResumeCompleteness(resume) {
  const issues = [];

  if (!resume.contactInfo?.email) issues.push('Missing email address');
  if (!resume.contactInfo?.phone) issues.push('Missing phone number');
  if (!resume.experience || resume.experience.length === 0) issues.push('No work experience listed');
  if (!resume.education || resume.education.length === 0) issues.push('No education information');
  if (!resume.extractedSkills || resume.extractedSkills.length < 5) issues.push('Insufficient skills listed (less than 5)');

  return {
    isComplete: issues.length === 0,
    issues,
    completenessScore: Math.max(0, 100 - (issues.length * 20))
  };
}

// Health check function to test Cohere API connectivity
export async function checkCohereHealth() {
  try {
    const response = await safeCohereCall(async () => {
      return await cohere.chat({
        model: "command-light",
        message: "Hello, are you working?",
        maxTokens: 10
      });
    });
    
    return { 
      status: 'healthy', 
      message: 'Cohere API is accessible',
      model: 'command-light'
    };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: error.message,
      suggestion: 'Check your Cohere API key and account status'
    };
  }
}

// Utility function to generate job-specific keywords using Cohere
export async function generateJobKeywords(jobTitle, jobDescription) {
  const fallbackKeywords = [
    'experience', 'skills', 'team', 'project', 'management', 
    'development', 'analysis', 'communication', 'leadership', 'results'
  ];

  const prompt = `Generate 10 important keywords for a ${jobTitle} position based on this job description:

${jobDescription.substring(0, 1000)}

Return only a JSON array of keywords: ["keyword1", "keyword2", ...]`;

  const requestFn = async () => {
    return await cohere.chat({
      model: "command-light",
      message: prompt,
      temperature: 0.2,
      maxTokens: 150
    });
  };

  try {
    const response = await safeCohereCall(requestFn, null);
    
    if (!response) {
      return fallbackKeywords;
    }

    const jsonMatch = response.text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const keywords = JSON.parse(jsonMatch[0]);
        return Array.isArray(keywords) ? keywords.slice(0, 10) : fallbackKeywords;
      } catch (parseError) {
        return fallbackKeywords;
      }
    }

    return fallbackKeywords;
    
  } catch (error) {
    console.error('Keyword generation error:', error.message);
    return fallbackKeywords;
  }
}