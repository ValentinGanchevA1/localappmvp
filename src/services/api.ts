// src/services/api.ts - REFACTORED VERSION
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { errorHandler, ErrorCodes, AppError as CustomAppError } from './errorHandler';
import { AppConfig } from '@/config/AppConfig';

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

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private readonly client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];
  private readonly requestCache = new Map<string, Promise<any>>();

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
      this.handleRequestError.bind(this)
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

    config.headers['X-Request-ID'] = this.generateRequestId(config);
    config.headers['X-Request-Time'] = Date.now().toString();

    return config;
  }

  private handleRequestError(error: any): Promise<never> {
    return Promise.reject(error);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): AxiosResponse {
    return {
      ...response,
      data: response.data.data ?? response.data,
    };
  }

  // ============ ERROR HANDLING ============
  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as RetryConfig;

    // Network error
    if (!error.response) {
      throw this.createNetworkError('Network error. Please check your connection.');
    }

    const { status } = error.response;

    // Handle specific status codes
    switch (status) {
      case 401:
        return this.handle401(originalRequest);
      case 403:
        throw this.createAuthError('Access denied');
      case 429:
        throw this.createNetworkError('Too many requests. Please try again later.');
      default:
        if (status >= 500) {
          throw this.createNetworkError('Server error. Please try again.');
        }
        throw errorHandler.handleError(error, 'API Response');
    }
  }

  private async handle401(originalRequest: RetryConfig): Promise<any> {
    // Don't retry refresh endpoint
    if (originalRequest.url?.includes('/auth/refresh')) {
      store.dispatch(logout());
      throw this.createAuthError('Session expired');
    }

    // Already retried
    if (originalRequest._retry) {
      store.dispatch(logout());
      throw new Error('Authentication failed');
    }

    // Queue request while refreshing
    if (this.isRefreshing) {
      return this.queueRequest(originalRequest);
    }

    return this.attemptTokenRefresh(originalRequest);
  }

  private async queueRequest(config: RetryConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
    }).then(() => this.client(config));
  }

  private async attemptTokenRefresh(originalRequest: RetryConfig): Promise<any> {
    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      await this.refreshToken();
      this.processQueue(null);
      return this.client(originalRequest);
    } catch (error) {
      this.processQueue(error);
      store.dispatch(logout());
      throw this.createAuthError('Failed to refresh token');
    } finally {
      this.isRefreshing = false;
    }
  }

  private async refreshToken(): Promise<void> {
    const token = store.getState().auth.token;
    await axios.post(
      `${AppConfig.API_BASE_URL}/auth/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  private processQueue(error: any): void {
    for (const { resolve, reject } of this.failedQueue) {
      error ? reject(error) : resolve();
    }
    this.failedQueue = [];
  }

  // ============ UTILITIES ============
  private createNetworkError(message: string): CustomAppError {
    const error: CustomAppError = {
      message,
      code: ErrorCodes.NETWORK_ERROR,
    };
    return errorHandler.handleError(error, 'API Network');
  }

  private createAuthError(message: string): CustomAppError {
    const error: CustomAppError = {
      message,
      code: ErrorCodes.AUTH_ERROR,
    };
    return errorHandler.handleError(error, 'API Forbidden');
  }

  private generateRequestId(config: AxiosRequestConfig): string {
    const { method = 'get', url = '', params = {} } = config;
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `${method}-${url}-${JSON.stringify(params)}-${timestamp}-${random}`;
  }

  private createCacheKey(method: string, url: string, params?: any): string {
    return `${method.toUpperCase()}-${url}-${JSON.stringify(params || {})}`;
  }

  // ============ REQUEST DEDUPLICATION ============
  private async deduplicateRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.requestCache.get(key);
    if (cached) {
      console.log('[API] Deduplicating request:', key);
      return cached;
    }

    const promise = requestFn().finally(() => {
      this.requestCache.delete(key);
    });

    this.requestCache.set(key, promise);
    return promise;
  }

  // ============ PUBLIC API ============
  public async get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const cacheKey = this.createCacheKey('GET', url, params);
    return this.deduplicateRequest(cacheKey, () =>
      this.client.get<T>(url, { ...config, params })
    );
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

// Singleton
export const apiClient = new ApiClient();
