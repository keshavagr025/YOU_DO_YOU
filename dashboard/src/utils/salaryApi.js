import axios from 'axios';

// Create an Axios instance with base config
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/salary', // adjust if needed
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Set true if using cookies for auth
});

// Estimate Salary
export const getSalaryEstimate = async (job_title, location, years_of_experience = 'ALL', location_type = 'ANY') => {
  try {
    const res = await apiClient.get('/estimate', {
      params: { job_title, location, years_of_experience, location_type },
    });
    return res.data;
  } catch (error) {
    console.error('Error in getSalaryEstimate:', error);
    throw error.response?.data || { error: 'Salary estimate fetch failed' };
  }
};

// Search Jobs
export const searchJobs = async (query, options = {}) => {
  try {
    const res = await apiClient.get('/search', {
      params: { query, ...options },
    });
    return res.data;
  } catch (error) {
    console.error('Error in searchJobs:', error);
    throw error.response?.data || { error: 'Job search failed' };
  }
};

// Get Estimate History
export const getEstimateHistory = async () => {
  try {
    const res = await apiClient.get('/history/estimates');
    return res.data;
  } catch (error) {
    console.error('Error in getEstimateHistory:', error);
    throw error.response?.data || { error: 'Estimate history fetch failed' };
  }
};

// Get Job Search History
export const getSearchHistory = async () => {
  try {
    const res = await apiClient.get('/history/searches');
    return res.data;
  } catch (error) {
    console.error('Error in getSearchHistory:', error);
    throw error.response?.data || { error: 'Search history fetch failed' };
  }
};

// Health Check
export const checkSalaryApiHealth = async () => {
  try {
    const res = await apiClient.get('/health');
    return res.data;
  } catch (error) {
    console.error('Error in checkSalaryApiHealth:', error);
    throw error.response?.data || { error: 'API health check failed' };
  }
};
