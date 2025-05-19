import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getTokenFromCookies, isTokenExpired } from './../Page/Auth/tokenUtils';

const logEnvironmentVariables = () => {
  console.log('===== Environment Variables =====');
  console.log('VITE_AUTH_API_KEY:', import.meta.env.VITE_AUTH_API_KEY);
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('VITE_API_TIMEOUT:', import.meta.env.VITE_API_TIMEOUT);
  console.log('VITE_ENV:', import.meta.env.VITE_ENV);
  console.log('==============================');
};

if (import.meta.env.DEV) logEnvironmentVariables();

// Load env values
const API_KEY = import.meta.env.VITE_AUTH_API_KEY;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname.includes('mypenm0iesvr02')
    ? 'http://mypenm0iesvr02/ieportal-api'
    : '/api');

console.log('API Configuration:');
console.log('- Base URL:', API_BASE_URL);
console.log('- Timeout:', API_TIMEOUT);
console.log('- API Key Available:', !!API_KEY);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(api, {
  retries: 2,
  retryDelay: (retryCount) => {
    console.log(`Retrying request... attempt #${retryCount}`);
    return retryCount * 1000; 
  },
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === 'ECONNABORTED'
    );
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);

    if (config.url.includes('/api/auth/')) {
      config.headers['X-App-Key'] = API_KEY;
      console.log('Auth endpoint detected - adding X-App-Key');
    } else {
      let token = localStorage.getItem('authToken');
      if (!token) {
        token = getTokenFromCookies();
        console.log('Using token from cookies:', !!token);
      } else {
        console.log('Using token from localStorage:', !!token);
      }

      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added Authorization header');
      }
    }

    if (import.meta.env.DEV) {
      console.log('Request Headers:', config.headers);
      if (config.data) console.log('Request Payload:', config.data);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
    });

    if (import.meta.env.DEV && response.data) {
      console.log('Response Data:', response.data);
    }

    return response;
  },
  (error) => {
    console.error(`Error in response from ${error.config?.url || 'unknown endpoint'}:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    if (import.meta.env.DEV) {
      console.error('Error Response Data:', error.response?.data);
      console.error('Error Config:', error.config);
    }

    if (error.response && error.response.status === 401) {
      console.warn('401 Unauthorized response - clearing auth data');
      localStorage.removeItem('authToken');
    }

    return Promise.reject(error);
  }
);

export default api;