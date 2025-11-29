import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  enableLogging?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiClient {
  private readonly client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors(config.enableLogging ?? false);
  }

  private setupInterceptors(enableLogging: boolean): void {
    this.client.interceptors.request.use(
      (config) => this.onRequest(config, enableLogging),
      (error) => {
        throw error;
      }
    );
    this.client.interceptors.response.use(
      (response) => this.onResponse(response, enableLogging),
      (error) => this.onResponseError(error)
    );
  }

  private onRequest(config: InternalAxiosRequestConfig, enableLogging: boolean): InternalAxiosRequestConfig {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (enableLogging) {
      console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  }

  private onResponse(response: AxiosResponse, enableLogging: boolean): AxiosResponse {
    if (enableLogging) {
      console.log(`[API] Response: ${response.status} ${response.config.url}`);
    }
    return response;
  }

  private async onResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return this.client(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const { data } = await this.client.post('/auth/refresh-token');
        const { accessToken } = data;
        store.dispatch(/* set new token */);
        this.processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return this.client(originalRequest);
      } catch (e) {
        this.processQueue(e, null);
        store.dispatch(logout());
        throw new Error('Session expired. Please login again.');
      } finally {
        this.isRefreshing = false;
      }
    }

    throw error;
  }

  private processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  public async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

export default ApiClient;
