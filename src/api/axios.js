import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dr-backend-app.onrender.com/api', // Spring Boot Backend URL
});

// Interceptor: Har protected API call me Automatic Token lagane ke liye
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;