import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

// Determine base URL based on platform and environment
const getBaseURL = () => {
  if (__DEV__) {
    // Development
    if (Platform.OS === 'android') {
      // Android Emulator uses 10.0.2.2 to access host machine
      return 'http://10.0.2.2:3000';
    }
    // iOS Simulator
    return 'http://localhost:3000';
  }
  // Production
  return 'https://api.your-domain.com';
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('[API Request Data]', config.data);
      }
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in development
    if (__DEV__) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if it's a token expiration issue
      const state = store.getState();
      if (state.auth.isAuthenticated) {
        // Token expired - logout user
        store.dispatch(logout());

        // You could also try to refresh token here
        // const newToken = await refreshAccessToken();
        // if (newToken) {
        //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //   return axiosInstance(originalRequest);
        // }
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('[Network Error] Please check your internet connection');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }

    // Handle specific error codes
    if (error.response?.status === 403) {
      console.error('[Access Denied]');
    } else if (error.response?.status === 404) {
      console.error('[Not Found]', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error('[Server Error]');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Export typed instance for specific use cases
export const api = {
  get: <T = any>(url: string, config?: any) =>
    axiosInstance.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.put<T>(url, data, config),

  delete: <T = any>(url: string, config?: any) =>
    axiosInstance.delete<T>(url, config),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.patch<T>(url, data, config),
}; */
// src/api/axiosInstance.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

// Determine base URL based on platform and environment
const getBaseURL = (): string => {
  if (__DEV__) {
    // Development
    if (Platform.OS === 'android') {
      // Android Emulator uses 10.0.2.2 to access host machine
      return 'http://10.0.2.2:3000/api';
    }
    // iOS Simulator
    return 'http://localhost:3000';
  }
  // Production
  return 'https://api.your-domain.com';
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('[API Request Data]', config.data);
      }
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in development
    if (__DEV__) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if it's a token expiration issue
      const state = store.getState();
      if (state.auth.isAuthenticated) {
        // Token expired - logout user
        store.dispatch(logout());

        // You could also try to refresh token here
        // const newToken = await refreshAccessToken();
        // if (newToken) {
        //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //   return axiosInstance(originalRequest);
        // }
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('[Network Error] Please check your internet connection');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }

    // Handle specific error codes
    if (error.response?.status === 403) {
      console.error('[Access Denied]');
    } else if (error.response?.status === 404) {
      console.error('[Not Found]', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error('[Server Error]');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Export typed instance for specific use cases
export const api = {
  get: <T = any>(url: string, config?: any) =>
    axiosInstance.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.put<T>(url, data, config),

  delete: <T = any>(url: string, config?: any) =>
    axiosInstance.delete<T>(url, config),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    axiosInstance.patch<T>(url, data, config),
};
