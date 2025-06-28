import axios from 'axios';
const API_BASE = '/api/learning';

export const createLearningRoadmap = async (payload) => {
  const response = await axios.post(`${API_BASE}/create`, payload);
  return response.data;
};
