import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  position: String,
  company: String,
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  score: Number,
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Under Review', 'Rejected'],
    default: 'Applied',
  },
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
