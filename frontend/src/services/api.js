import axios from 'axios';

const tokenKey = import.meta.env.VITE_JWT_TOKEN_KEY || 'crm_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(tokenKey);
      window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
