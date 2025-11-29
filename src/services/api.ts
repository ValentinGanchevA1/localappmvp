// src/services/api.ts - REFACTORED VERSION
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { errorHandler, ErrorCodes, AppError as CustomAppError } from './errorHandler';
import { AppConfig } from '@/config';

// Types
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    [key: string]: any; // Allow for flexible meta properties
    page?: number;
    limit?: number;
    total?: number;
  };
}

interface QueuedRequest {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}

class ApiClient {
  private readonly client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: AppConfig.API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // ============ INTERCEPTORS ============
  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      (error) => Promise.reject(error) // Keep Promise.reject for request errors
    );

    this.client.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): AxiosResponse {
    return {
      ...response,
      data: response.data.data ?? response.data,
    };
  }

  // ============ ERROR HANDLING ============
  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Network error
    if (!error.response) {
      throw errorHandler.handleError(new Error('Network error. Please check your connection.'), 'API Network');
    }

    const { status } = error.response;

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest._retry) {
      return this.handle401(originalRequest);
    }

    // Other errors
    throw errorHandler.handleError(error, 'API Response');
  }

  private async handle401(originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }): Promise<any> {
    originalRequest._retry = true;

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => this.client(originalRequest));
    }

    this.isRefreshing = true;

    try {
      // Attempt to refresh token
      const refreshToken = store.getState().auth.token; // Assuming stored refresh token
      const { data } = await axios.post(`${this.client.defaults.baseURL}/auth/refresh-token`, { refreshToken });
      const newAccessToken = data.accessToken;

      store.dispatch(logout()); // Dispatch action to save new token

      this.failedQueue.forEach(prom => prom.resolve(newAccessToken));
      this.failedQueue = [];

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return this.client(originalRequest);
    } catch (refreshError) {
      this.failedQueue.forEach(prom => prom.reject(refreshError));
      this.failedQueue = [];
      store.dispatch(logout()); // Logout user if refresh fails
      throw errorHandler.handleError(refreshError, 'Token Refresh');
    } finally {
      this.isRefreshing = false;
    }
  }

  // ============ PUBLIC API ============
  public async get<T = any>(url: string, params?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { ...config, params });
    return response.data.data as T;
  }

  public async post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  public async put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  public async delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }
}

// Singleton
export const apiClient = new ApiClient();
