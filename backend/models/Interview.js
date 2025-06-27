import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  strengths: {
    type: String,
    required: true
  },
  improvements: {
    type: String,
    required: true
  },
  suggestions: {
    type: String,
    required: true
  }
});

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  feedback: {
    type: feedbackSchema,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  audioUrl: {
    type: String,
    default: null
  }
});

const interviewSchema = new mongoose.Schema({
role: {
  type: String,
  enum: [
    'frontend',
    'backend',
    'fullstack',
    'devops',
    'dataScientist',
    'mobile',
    'uiux',
    'cybersecurity'
  ],
  required: true
},
  candidateName: {
    type: String,
    required: true,
    trim: true
  },
  candidateEmail: {
    type: String,
    default: null,
    trim: true,
    lowercase: true
  },
  questions: [{
    type: String,
    required: true
  }],
  answers: [answerSchema],
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  overallScore: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Calculate duration before saving
interviewSchema.pre('save', function(next) {
  if (this.status === 'completed' && this.completedAt && !this.duration) {
    this.duration = Math.round((this.completedAt - this.createdAt) / 1000);
  }
  next();
});

// Index for better query performance
interviewSchema.index({ createdAt: -1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ role: 1 });

export default mongoose.model('Interview', interviewSchema);