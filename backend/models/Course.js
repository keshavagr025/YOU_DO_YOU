import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['YouTube', 'Udemy', 'Coursera', 'edX', 'Pluralsight', 'FreeCodeCamp', 'Khan Academy', 'Other']
  },
  instructor: {
    name: String,
    profileUrl: String
  },
  price: {
    current: {
      type: String,
      default: 'Free'
    },
    original: String,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  students: {
    type: Number,
    default: 0
  },
  duration: {
    type: String
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'Beginner'
  },
  skills: [{
    type: String
  }],
  categories: [{
    type: String
  }],
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  videoId: {
    type: String // For YouTube videos
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search performance
CourseSchema.index({ skills: 1, level: 1, platform: 1 });
CourseSchema.index({ 'rating.average': -1 });
CourseSchema.index({ students: -1 });
CourseSchema.index({ categories: 1 });

export default mongoose.model('Course', CourseSchema);