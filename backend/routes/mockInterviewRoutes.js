// routes/learningRoutes.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import LearningRoadmap from '../models/LearningRoadmap.js';
import Course from '../models/Course.js';

dotenv.config();

const router = express.Router();

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Udemy API configuration (if you have access)
const UDEMY_CLIENT_ID = process.env.UDEMY_CLIENT_ID;
const UDEMY_CLIENT_SECRET = process.env.UDEMY_CLIENT_SECRET;

// Generate personalized roadmap
router.post('/generate-roadmap', async (req, res) => {
  try {
    const { userProfile } = req.body;
    const { name, currentLevel, targetRole, timeCommitment, learningStyle, budget } = userProfile;

    // Generate roadmap based on user profile
    const roadmap = await generateRoadmapData(userProfile);
    
    // Fetch real-time courses and videos for each phase
    const enhancedRoadmap = await enhanceRoadmapWithRealData(roadmap, userProfile);

    // Save to database
    const savedRoadmap = await LearningRoadmap.create({
      userId: req.user?.id || 'anonymous',
      userProfile,
      roadmap: enhancedRoadmap,
      createdAt: new Date()
    });

    res.json({
      success: true,
      roadmap: enhancedRoadmap,
      roadmapId: savedRoadmap._id
    });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: error.message
    });
  }
});

// Get YouTube videos for specific skill
router.get('/youtube-videos/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    const { level = 'beginner', maxResults = 10 } = req.query;

    const searchQuery = `${skill} tutorial ${level} programming`;
    
    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        q: searchQuery,
        part: 'snippet',
        type: 'video',
        maxResults: maxResults,
        order: 'relevance',
        videoDuration: 'medium', // 4-20 minutes
        videoDefinition: 'high'
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.json({
      success: true,
      videos,
      skill
    });

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch YouTube videos',
      error: error.message
    });
  }
});

// Get courses from multiple platforms
router.get('/courses/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    const { budget = 'all', level = 'beginner' } = req.query;

    const courses = await fetchCoursesFromPlatforms(skill, budget, level);

    res.json({
      success: true,
      courses,
      skill
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
});

// Get trending skills and technologies
router.get('/trending-skills', async (req, res) => {
  try {
    const trendingSkills = await fetchTrendingSkills();
    
    res.json({
      success: true,
      trendingSkills
    });

  } catch (error) {
    console.error('Error fetching trending skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending skills',
      error: error.message
    });
  }
});

// Helper function to generate roadmap data
async function generateRoadmapData(userProfile) {
  const { targetRole, currentLevel, timeCommitment } = userProfile;
  
  const roadmapTemplates = {
    'fullstack': {
      title: 'Full Stack Developer Roadmap',
      duration: calculateDuration(currentLevel, timeCommitment),
      phases: [
        {
          name: 'Frontend Fundamentals',
          duration: '4-6 weeks',
          skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design'],
          description: 'Build a solid foundation in web development basics'
        },
        {
          name: 'React Mastery',
          duration: '3-4 weeks',
          skills: ['React Hooks', 'State Management', 'Component Design', 'React Router'],
          description: 'Master modern React development'
        },
        {
          name: 'Backend Development',
          duration: '4-5 weeks',
          skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
          description: 'Learn server-side development and databases'
        },
        {
          name: 'DevOps & Deployment',
          duration: '2-3 weeks',
          skills: ['Git', 'Docker', 'AWS/Heroku', 'CI/CD'],
          description: 'Deploy and maintain applications'
        }
      ]
    },
    'ai-engineer': {
      title: 'AI Engineer Roadmap',
      duration: calculateDuration(currentLevel, timeCommitment),
      phases: [
        {
          name: 'Python & Math Foundations',
          duration: '3-4 weeks',
          skills: ['Python Programming', 'Linear Algebra', 'Statistics', 'NumPy/Pandas'],
          description: 'Build mathematical and programming foundations'
        },
        {
          name: 'Machine Learning',
          duration: '6-8 weeks',
          skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
          description: 'Learn core machine learning concepts'
        },
        {
          name: 'Deep Learning',
          duration: '8-10 weeks',
          skills: ['TensorFlow', 'PyTorch', 'Neural Networks', 'CNN', 'RNN'],
          description: 'Master deep learning and neural networks'
        },
        {
          name: 'AI Applications',
          duration: '4-6 weeks',
          skills: ['Computer Vision', 'NLP', 'MLOps', 'Model Deployment'],
          description: 'Build real-world AI applications'
        }
      ]
    },
    'data-scientist': {
      title: 'Data Scientist Roadmap',
      duration: calculateDuration(currentLevel, timeCommitment),
      phases: [
        {
          name: 'Data Analysis Fundamentals',
          duration: '3-4 weeks',
          skills: ['Python/R', 'SQL', 'Excel', 'Statistics'],
          description: 'Master data manipulation and analysis'
        },
        {
          name: 'Data Visualization',
          duration: '2-3 weeks',
          skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau'],
          description: 'Learn to visualize and present data'
        },
        {
          name: 'Machine Learning for Data Science',
          duration: '6-8 weeks',
          skills: ['Scikit-learn', 'Feature Engineering', 'Model Selection', 'Cross-validation'],
          description: 'Apply ML techniques to data problems'
        },
        {
          name: 'Big Data & Cloud',
          duration: '4-5 weeks',
          skills: ['Apache Spark', 'Hadoop', 'AWS/Azure', 'Data Pipelines'],
          description: 'Handle large-scale data processing'
        }
      ]
    }
  };

  return roadmapTemplates[targetRole] || roadmapTemplates['fullstack'];
}

// Helper function to enhance roadmap with real data
async function enhanceRoadmapWithRealData(roadmap, userProfile) {
  const enhancedPhases = await Promise.all(
    roadmap.phases.map(async (phase) => {
      const enhancedResources = await Promise.all(
        phase.skills.map(async (skill) => {
          try {
            // Fetch YouTube videos
            const videos = await fetchYouTubeVideos(skill, userProfile.currentLevel);
            
            // Fetch courses
            const courses = await fetchCoursesFromPlatforms(skill, userProfile.budget, userProfile.currentLevel);
            
            return {
              skill,
              videos: videos.slice(0, 3), // Top 3 videos
              courses: courses.slice(0, 2) // Top 2 courses
            };
          } catch (error) {
            console.error(`Error fetching resources for ${skill}:`, error);
            return {
              skill,
              videos: [],
              courses: []
            };
          }
        })
      );

      return {
        ...phase,
        resources: enhancedResources
      };
    })
  );

  return {
    ...roadmap,
    phases: enhancedPhases
  };
}

// Helper function to fetch YouTube videos
async function fetchYouTubeVideos(skill, level = 'beginner', maxResults = 5) {
  try {
    const searchQuery = `${skill} tutorial ${level} programming`;
    
    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        q: searchQuery,
        part: 'snippet',
        type: 'video',
        maxResults: maxResults,
        order: 'relevance',
        videoDuration: 'medium'
      }
    });

    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 150) + '...',
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: 'youtube'
    }));

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

// Helper function to fetch courses from multiple platforms
async function fetchCoursesFromPlatforms(skill, budget, level) {
  const courses = [];

  try {
    // Free resources
    const freeResources = getFreeResources(skill, level);
    courses.push(...freeResources);

    // If budget allows, fetch paid courses
    if (budget !== 'Free only') {
      // You can integrate with course APIs here
      const paidCourses = await fetchPaidCourses(skill, level, budget);
      courses.push(...paidCourses);
    }

    return courses;

  } catch (error) {
    console.error('Error fetching courses:', error);
    return courses;
  }
}

// Helper function to get free resources
function getFreeResources(skill, level) {
  const freeResourcesMap = {
    'HTML5': [
      {
        title: 'FreeCodeCamp HTML Tutorial',
        platform: 'FreeCodeCamp',
        price: 'Free',
        rating: 4.9,
        url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
        type: 'course',
        duration: '10 hours'
      }
    ],
    'JavaScript ES6+': [
      {
        title: 'JavaScript Info - Modern Tutorial',
        platform: 'JavaScript.info',
        price: 'Free',
        rating: 4.8,
        url: 'https://javascript.info/',
        type: 'documentation',
        duration: 'Self-paced'
      }
    ],
    'React Hooks': [
      {
        title: 'React Official Documentation',
        platform: 'React.dev',
        price: 'Free',
        rating: 4.9,
        url: 'https://react.dev/learn',
        type: 'documentation',
        duration: 'Self-paced'
      }
    ],
    'Python Programming': [
      {
        title: 'Python for Everybody',
        platform: 'Coursera',
        price: 'Free (Audit)',
        rating: 4.8,
        url: 'https://www.coursera.org/specializations/python',
        type: 'course',
        duration: '8 weeks'
      }
    ]
  };

  return freeResourcesMap[skill] || [];
}

// Helper function to fetch paid courses (mock implementation)
async function fetchPaidCourses(skill, level, budget) {
  // This would integrate with actual course APIs
  // For now, returning mock data
  const mockCourses = [
    {
      title: `Advanced ${skill} Masterclass`,
      platform: 'Udemy',
      price: '$49.99',
      originalPrice: '$199.99',
      rating: 4.7,
      students: 25000,
      url: '#',
      type: 'course',
      duration: '12 hours',
      level: level
    }
  ];

  return mockCourses;
}

// Helper function to calculate duration based on level and commitment
function calculateDuration(currentLevel, timeCommitment) {
  const baseWeeks = {
    'Beginner': 16,
    'Intermediate': 12,
    'Advanced': 8
  };

  const timeMultiplier = {
    '1-2 hours/day': 1.5,
    '3-4 hours/day': 1.0,
    '5+ hours/day': 0.7
  };

  const weeks = Math.ceil(baseWeeks[currentLevel] * timeMultiplier[timeCommitment]);
  return `${weeks-2}-${weeks} weeks`;
}

// Helper function to fetch trending skills
async function fetchTrendingSkills() {
  // This could integrate with job market APIs, GitHub trending, etc.
  return [
    { skill: 'React', trend: '+15%', demandLevel: 'High' },
    { skill: 'Python', trend: '+22%', demandLevel: 'Very High' },
    { skill: 'TypeScript', trend: '+18%', demandLevel: 'High' },
    { skill: 'AWS', trend: '+25%', demandLevel: 'Very High' },
    { skill: 'Docker', trend: '+20%', demandLevel: 'High' }
  ];
}

export default router;