import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  extractedSkills: [{
    type: String
  }],
  contactInfo: {
    email: String,
    phone: String,
    linkedin: String,
    github: String
  },
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
    gpa: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String
  }],
  analysisResults: [{
    jobRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRole'
    },
    atsScore: Number,
    matchedKeywords: [String],
    missingKeywords: [String],
    suggestions: [String],
    analyzedAt: {
      type: Date,
      default: Date.now
    }
  }],
  uploadedBy: {
    type: String,
    default: 'anonymous'
  }
}, {
  timestamps: true
});

// Index for better search performance
resumeSchema.index({ extractedSkills: 1 });
resumeSchema.index({ 'analysisResults.jobRole': 1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
