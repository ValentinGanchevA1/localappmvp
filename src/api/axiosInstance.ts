import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { store } from '@/store';
import { AppEnvironment } from '@/config/environment';
import { logout } from '@/store/slices/authSlice';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: AppEnvironment.API_BASE_URL,
  timeout: AppEnvironment.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data || response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired - logout
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
