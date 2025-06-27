import mongoose from 'mongoose';

const salaryEstimateSchema = new mongoose.Schema({
  job_title: String,
  location: String,
  min_salary: Number,
  max_salary: Number,
  average_salary: Number,
  salary_currency: String,
  salary_period: String,
  publisher_name: String,
  publisher_link: String,
  source: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('SalaryEstimate', salaryEstimateSchema);
