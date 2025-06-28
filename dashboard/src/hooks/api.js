const BASE_URL = "http://localhost:5000/api/dashboard";

export const fetchStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`);
  return await res.json();
};

export const fetchApplications = async () => {
  const res = await fetch(`${BASE_URL}/applications`);
  return await res.json();
};
