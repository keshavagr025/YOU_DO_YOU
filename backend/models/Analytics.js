import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  totalResumes: {
    type: Number,
    default: 0
  },
  averageAtsScore: {
    type: Number,
    default: 0
  },
  topSkills: [{
    skill: String,
    count: Number
  }],
  popularJobRoles: [{
    jobRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRole'
    },
    count: Number
  }],
  dailyStats: [{
    date: {
      type: Date,
      default: Date.now
    },
    resumesAnalyzed: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;