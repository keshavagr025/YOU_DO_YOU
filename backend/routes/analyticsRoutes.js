// backend/routes/analyticsRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import JobRole from '../models/JobRole.js';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalResumes,
      totalJobRoles,
      avgAtsScore,
      topSkills,
      popularJobRoles,
      recentAnalyses
    ] = await Promise.all([
      Resume.countDocuments(),
      JobRole.countDocuments({ isActive: true }),
      calculateAverageAtsScore(),
      getTopSkills(10),
      getPopularJobRoles(5),
      getRecentAnalyses(10)
    ]);

    res.json({
      overview: {
        totalResumes,
        totalJobRoles,
        averageAtsScore: avgAtsScore,
        totalAnalyses: await getTotalAnalyses()
      },
      topSkills,
      popularJobRoles,
      recentAnalyses,
      trends: await getAnalyticsTrends()
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard analytics',
      error: error.message
    });
  }
});

// GET /api/analytics/skill-trends
router.get('/skill-trends', async (req, res) => {
  try {
    const { timeframe = '30d', jobRole } = req.query;
    const dateFilter = getDateFilter(timeframe);
    const matchFilter = { createdAt: { $gte: dateFilter } };

    if (jobRole) {
      matchFilter['analysisResults.jobRole'] = jobRole;
    }

    const skillTrends = await Resume.aggregate([
      { $match: matchFilter },
      { $unwind: '$extractedSkills' },
      {
        $group: {
          _id: '$extractedSkills',
          count: { $sum: 1 },
          avgScore: {
            $avg: {
              $arrayElemAt: ['$analysisResults.atsScore', 0]
            }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $project: {
          skill: '$_id',
          count: 1,
          avgScore: { $round: ['$avgScore', 1] },
          _id: 0
        }
      }
    ]);

    res.json(skillTrends);
  } catch (error) {
    console.error('Skill trends error:', error);
    res.status(500).json({
      message: 'Failed to fetch skill trends',
      error: error.message
    });
  }
});

// GET /api/analytics/score-distribution
router.get('/score-distribution', async (req, res) => {
  try {
    const { jobRole } = req.query;
    let matchFilter = { 'analysisResults.0': { $exists: true } };

    if (jobRole) {
      matchFilter['analysisResults.jobRole'] = jobRole;
    }

    const scoreDistribution = await Resume.aggregate([
      { $match: matchFilter },
      { $unwind: '$analysisResults' },
      {
        $bucket: {
          groupBy: '$analysisResults.atsScore',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgScore: { $avg: '$analysisResults.atsScore' }
          }
        }
      }
    ]);

    res.json(scoreDistribution);
  } catch (error) {
    console.error('Score distribution error:', error);
    res.status(500).json({
      message: 'Failed to fetch score distribution',
      error: error.message
    });
  }
});

// GET /api/analytics/keyword-analysis
router.get('/keyword-analysis', async (req, res) => {
  try {
    const { jobRoleId } = req.query;
    if (!jobRoleId) {
      return res.status(400).json({ message: 'Job role ID is required' });
    }

    const keywordAnalysis = await Resume.aggregate([
      {
        $match: {
          'analysisResults.jobRole': new mongoose.Types.ObjectId(jobRoleId)
        }
      },
      { $unwind: '$analysisResults' },
      {
        $match: {
          'analysisResults.jobRole': new mongoose.Types.ObjectId(jobRoleId)
        }
      },
      { $unwind: '$analysisResults.matchedKeywords' },
      {
        $group: {
          _id: '$analysisResults.matchedKeywords',
          matchCount: { $sum: 1 },
          avgScoreWhenMatched: { $avg: '$analysisResults.atsScore' }
        }
      },
      { $sort: { matchCount: -1 } },
      {
        $project: {
          keyword: '$_id',
          matchCount: 1,
          avgScoreWhenMatched: { $round: ['$avgScoreWhenMatched', 1] },
          _id: 0
        }
      }
    ]);

    res.json(keywordAnalysis);
  } catch (error) {
    console.error('Keyword analysis error:', error);
    res.status(500).json({
      message: 'Failed to fetch keyword analysis',
      error: error.message
    });
  }
});

// ========== Helper Functions ==========

const calculateAverageAtsScore = async () => {
  const result = await Resume.aggregate([
    { $match: { 'analysisResults.0': { $exists: true } } },
    { $unwind: '$analysisResults' },
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$analysisResults.atsScore' }
      }
    }
  ]);
  return result.length > 0 ? Math.round(result[0].avgScore) : 0;
};

const getTopSkills = async (limit = 10) => {
  return await Resume.aggregate([
    { $unwind: '$extractedSkills' },
    {
      $group: {
        _id: '$extractedSkills',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $project: {
        skill: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);
};

const getPopularJobRoles = async (limit = 5) => {
  return await Resume.aggregate([
    { $unwind: '$analysisResults' },
    {
      $group: {
        _id: '$analysisResults.jobRole',
        count: { $sum: 1 },
        avgScore: { $avg: '$analysisResults.atsScore' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'jobroles',
        localField: '_id',
        foreignField: '_id',
        as: 'jobRoleInfo'
      }
    },
    {
      $project: {
        jobRole: { $arrayElemAt: ['$jobRoleInfo.title', 0] },
        count: 1,
        avgScore: { $round: ['$avgScore', 1] },
        _id: 0
      }
    }
  ]);
};

const getRecentAnalyses = async (limit = 10) => {
  return await Resume.aggregate([
    { $unwind: '$analysisResults' },
    { $sort: { 'analysisResults.analyzedAt': -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'jobroles',
        localField: 'analysisResults.jobRole',
        foreignField: '_id',
        as: 'jobRoleInfo'
      }
    },
    {
      $project: {
        fileName: '$originalName',
        jobRole: { $arrayElemAt: ['$jobRoleInfo.title', 0] },
        atsScore: '$analysisResults.atsScore',
        analyzedAt: '$analysisResults.analyzedAt',
        _id: 0
      }
    }
  ]);
};

const getTotalAnalyses = async () => {
  const result = await Resume.aggregate([
    {
      $project: {
        analysisCount: { $size: '$analysisResults' }
      }
    },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: '$analysisCount' }
      }
    }
  ]);
  return result.length > 0 ? result[0].totalAnalyses : 0;
};

const getAnalyticsTrends = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return await Resume.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } },
    {
      $project: {
        date: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);
};

const getDateFilter = (timeframe) => {
  const now = new Date();
  switch (timeframe) {
    case '7d':
      return new Date(now.setDate(now.getDate() - 7));
    case '30d':
      return new Date(now.setDate(now.getDate() - 30));
    case '90d':
      return new Date(now.setDate(now.getDate() - 90));
    default:
      return new Date(now.setDate(now.getDate() - 30));
  }
};

export default router;
