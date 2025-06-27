import mongoose from "mongoose";

const jobRoleSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    name: String,
    weight: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 2
    },
    category: {
      type: String,
      enum: ['technical', 'soft', 'certification', 'tool'],
      default: 'technical'
    }
  }],
  keywords: [{
    term: String,
    weight: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 2
    },
    synonyms: [String]
  }],
  minimumScore: {
    type: Number,
    default: 60,
    min: 0,
    max: 100
  },
  industry: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
    default: 'mid'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const JobRole = mongoose.model("JobRole", jobRoleSchema);

export default JobRole;