import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/dashboard',
});

export default API;

export const generateRoadmap = (userProfile) =>
  API.post('/learning/generate-roadmap', { userProfile });

export const getStats = () => API.get('/stats');
export const getApplications = () => API.get('/applications');
