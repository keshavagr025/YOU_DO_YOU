import express from 'express';
import JobRole from '../models/JobRole.js';

const router = express.Router();

// GET /api/job-roles - Get all job roles
router.get('/', async (req, res) => {
  try {
    const { industry, level, isActive = true, page = 1, limit = 10, search } = req.query;
    
    const query = { isActive };

    if (industry) query.industry = industry;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobRoles = await JobRole.find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobRole.countDocuments(query);

    res.json({
      jobRoles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Fetch job roles error:', error);
    res.status(500).json({
      message: 'Failed to fetch job roles',
      error: error.message
    });
  }
});

// GET /api/job-roles/:id
router.get('/:id', async (req, res) => {
  try {
    const jobRole = await JobRole.findById(req.params.id);

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json(jobRole);
  } catch (error) {
    console.error('Fetch job role error:', error);
    res.status(500).json({
      message: 'Failed to fetch job role',
      error: error.message
    });
  }
});

// POST /api/job-roles
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      keywords,
      minimumScore,
      industry,
      level
    } = req.body;

    if (!title || !description || !industry) {
      return res.status(400).json({ message: 'Title, description, and industry are required' });
    }

    const existingJobRole = await JobRole.findOne({ title });
    if (existingJobRole) {
      return res.status(409).json({ message: 'Job role with this title already exists' });
    }

    const jobRole = new JobRole({
      title,
      description,
      requiredSkills: requiredSkills || [],
      keywords: keywords || [],
      minimumScore: minimumScore || 60,
      industry,
      level: level || 'mid'
    });

    await jobRole.save();

    res.status(201).json({
      message: 'Job role created successfully',
      jobRole
    });
  } catch (error) {
    console.error('Create job role error:', error);
    res.status(500).json({
      message: 'Failed to create job role',
      error: error.message
    });
  }
});

// PUT /api/job-roles/:id
router.put('/:id', async (req, res) => {
  try {
    const jobRole = await JobRole.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({
      message: 'Job role updated successfully',
      jobRole
    });
  } catch (error) {
    console.error('Update job role error:', error);
    res.status(500).json({
      message: 'Failed to update job role',
      error: error.message
    });
  }
});

// DELETE /api/job-roles/:id
router.delete('/:id', async (req, res) => {
  try {
    const jobRole = await JobRole.findByIdAndDelete(req.params.id);

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({ message: 'Job role deleted successfully' });
  } catch (error) {
    console.error('Delete job role error:', error);
    res.status(500).json({
      message: 'Failed to delete job role',
      error: error.message
    });
  }
});

// GET /api/job-roles/industries/list
router.get('/industries/list', async (req, res) => {
  try {
    const industries = await JobRole.distinct('industry');
    res.json(industries);
  } catch (error) {
    console.error('Fetch industries error:', error);
    res.status(500).json({
      message: 'Failed to fetch industries',
      error: error.message
    });
  }
});

export default router;
