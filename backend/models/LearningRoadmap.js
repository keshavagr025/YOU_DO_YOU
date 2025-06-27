import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  videos: [{
    id: String,
    title: String,
    description: String,
    thumbnail: String,
    channelTitle: String,
    publishedAt: Date,
    url: String,
    type: {
      type: String,
      default: 'youtube'
    }
  }],
  courses: [{
    title: String,
    platform: String,
    price: String,
    originalPrice: String,
    rating: Number,
    students: Number,
    url: String,
    type: String,
    duration: String,
    level: String
  }]
});

const PhaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  resources: [ResourceSchema]
});

const UserProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  currentLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  timeCommitment: {
    type: String,
    enum: ['1-2 hours/day', '3-4 hours/day', '5+ hours/day'],
    required: true
  },
  learningStyle: {
    type: String,
    enum: ['Visual (Videos)', 'Reading (Documentation)', 'Hands-on (Projects)', 'Mixed'],
    required: true
  },
  budget: {
    type: String,
    enum: ['Free only', 'Under $50/month', 'Under $100/month', 'No budget limit'],
    required: true
  }
});

const RoadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  phases: [PhaseSchema]
});

const LearningRoadmapSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'anonymous'
  },
  userProfile: {
    type: UserProfileSchema,
    required: true
  },
  roadmap: {
    type: RoadmapSchema,
    required: true
  },
  progress: {
    completedPhases: [{
      phaseIndex: Number,
      completedAt: Date
    }],
    currentPhase: {
      type: Number,
      default: 0
    },
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
LearningRoadmapSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
LearningRoadmapSchema.index({ userId: 1, isActive: 1 });
LearningRoadmapSchema.index({ 'userProfile.targetRole': 1 });
LearningRoadmapSchema.index({ createdAt: -1 });

export default mongoose.model('LearningRoadmap', LearningRoadmapSchema);