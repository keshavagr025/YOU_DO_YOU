import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer_name: String,
  job_title: String,
  job_city: String,
  job_state: String,
  job_country: String,
  job_description: String,
  job_min_salary: Number,
  job_max_salary: Number,
  job_salary_currency: String,
  job_posted_at: Date
});

const jobSearchResultSchema = new mongoose.Schema({
  query: String,
  jobs: [jobSchema],
  salary_insights: {
    total_jobs: Number,
    jobs_with_salary: Number,
    average_min_salary: Number,
    average_max_salary: Number,
    salary_range: {
      min: Number,
      max: Number
    },
    top_companies: [Object],
    top_locations: [Object]
  },
  source: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('JobSearchResult', jobSearchResultSchema);
