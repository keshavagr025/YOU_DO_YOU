import mongoose from 'mongoose';

const SkillProgressSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  resources: [{
    resourceId: String,
    resourceType: {
      type: String,
      enum: ['youtube', 'course', 'documentation', 'project']
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    timeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    completedAt: Date
  }]
});

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningRoadmap',
    required: true
  },
  currentPhase: {
    type: Number,
    default: 0
  },
  phases: [{
    phaseIndex: Number,
    skills: [SkillProgressSchema],
    startedAt: Date,
    completedAt: Date,
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    }
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalTimeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
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
UserProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
UserProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, lastActiveDate: -1 });

export default mongoose.model('UserProgress', UserProgressSchema);