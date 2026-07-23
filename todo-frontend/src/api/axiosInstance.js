import axios from 'axios';

// URL Backend NestJS (port 3090)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3090';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Logging)
api.interceptors.request.use(
  (config) => {
    console.log(`[HTTP ${config.method?.toUpperCase()}] -> ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('[HTTP Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (Logging & Format Error)
api.interceptors.response.use(
  (response) => {
    console.log(`[HTTP ${response.status} Success] <- ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      (Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : 'Terjadi kesalahan pada server');

    console.error(`[HTTP ${error.response?.status || 'ERR'} Error]: ${error.config?.url}`, errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
