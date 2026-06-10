import axios from 'axios';

// Normalize the base URL - remove trailing /api if already present to avoid double /api/api/
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const normalizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '');

const API = axios.create({
  baseURL: `${normalizedBaseUrl}/api`
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;