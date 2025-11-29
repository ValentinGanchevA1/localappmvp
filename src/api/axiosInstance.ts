import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

const getBaseURL = (): string => {
  if (__DEV__) {
    return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  }
  return 'https://api.your-domain.com';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(`\n[AXIOS] Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      if (config.data) {
        console.log('[AXIOS] Request Data:', JSON.stringify(config.data, null, 2));
      }
    }

    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('[AXIOS] Request Error:', error.message);
    }
    throw error;
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[AXIOS] Response: ${response.status} ${response.config.url}`);
      console.log('[AXIOS] Response Data:', JSON.stringify(response.data, null, 2));
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      if (error.response) {
        console.error('\n[AXIOS] Error Response:', error.response.status, error.config?.url);
        console.error('[AXIOS] Error Message:', error.response.data);
      } else {
        console.error('\n[AXIOS] Error:', error.message);
      }
    }

    if (error.response?.status === 401) {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        if (store.getState().auth.isAuthenticated) {
          store.dispatch(logout());
        }
      }
    }

    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    throw error;
  }
);

export default axiosInstance;
