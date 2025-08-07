import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import axiosRetry from 'axios-retry';
import { getTokenFromCookies, isTokenExpired } from './../Page/Auth/tokenUtils';

const logEnvironmentVariables = (): void => {
  console.log('===== Environment Variables =====');
  console.log('VITE_AUTH_API_KEY:', import.meta.env.VITE_AUTH_API_KEY);
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('VITE_API_TIMEOUT:', import.meta.env.VITE_API_TIMEOUT);
  console.log('VITE_ENV:', import.meta.env.VITE_ENV);
  console.log('==============================');
};

if (import.meta.env.DEV) logEnvironmentVariables();

const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const API_KEY: string = import.meta.env.VITE_AUTH_API_KEY;
const API_TIMEOUT: number = parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000;
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname.includes('mypenm0iesvr02')
    ? 'http://mypenm0iesvr02/ieportal-api'
    : '/api');

console.log('API Configuration:');
console.log('- Base URL:', API_BASE_URL);
console.log('- Timeout:', API_TIMEOUT);
console.log('- API Key Available:', !!API_KEY);

const api: AxiosInstance = axios.create({
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
  retryCondition: (error: AxiosError) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === 'ECONNABORTED'
    );
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!config.url) return config;

    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);

    // FIXED: Add X-App-Key to ALL requests, not just auth endpoints
    config.headers['X-App-Key'] = API_KEY;
    console.log('Added X-App-Key to request');

    // Add timezone header for Hafizie's datetime conversion
    const timezone = getUserTimezone();
    config.headers['Time-Zone'] = timezone;
    console.log('Added timezone header:', timezone);

    // Add Authorization header for non-auth endpoints
    if (!config.url.includes('/api/auth/')) {
      let token: string | null = localStorage.getItem('authToken');
      if (!token) {
        token = getTokenFromCookies();
        console.log('Using token from cookies:', !!token);
      } else {
        console.log('Using token from localStorage:', !!token);
      }

      if (token && !isTokenExpired(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Added Authorization header');
      } else if (token && isTokenExpired(token)) {
        console.log('Token is expired, removing from storage');
        localStorage.removeItem('authToken');
      }
    }

    if (import.meta.env.DEV) {
      console.log('Request Headers:', config.headers);
      if (config.data) console.log('Request Payload:', config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
    });

    if (import.meta.env.DEV && response.data) {
      console.log('Response Data:', response.data);
    }

    return response;
  },
  (error: AxiosError) => {
    const url = error.config?.url || 'unknown endpoint';
    console.error(`Error in response from ${url}:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    if (import.meta.env.DEV) {
      console.error('Error Response Data:', error.response?.data);
      console.error('Error Config:', error.config);
    }

    if (error.response?.status === 401) {
      console.warn('401 Unauthorized response - clearing auth data');
      localStorage.removeItem('authToken');
    }

    return Promise.reject(error);
  }
);

export default api;