import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  id: String,
  text: String,
  completed: Boolean,
});

const GoalSchema = new mongoose.Schema({
  id: String,
  title: String,
  milestones: [MilestoneSchema],
  progress: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Roadmap = mongoose.model('Roadmap', GoalSchema);
export default Roadmap;
