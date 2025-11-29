import { apiClient } from './api';
import { LoginCredentials } from '@/types';
import { User } from '@/types/user';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export const authService = {
  async loginWithPhone(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<AuthResponse>('/auth/phone', credentials);
    return {
      token: response.data.access_token,
      user: {
        id: response.data.user.id,
        name: response.data.user.name || '',
        email: response.data.user.email || '',
        avatar: response.data.user.avatar || '',
      },
    };
  },

  async registerWithPhone(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return {
      token: response.data.access_token,
      user: {
        id: response.data.user.id,
        name: response.data.user.name || '',
        email: response.data.user.email || '',
        avatar: response.data.user.avatar || '',
      },
    };
  },

  async loginWithPassword(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return {
      token: response.data.access_token,
      user: {
        id: response.data.user.id,
        name: response.data.user.name || '',
        email: response.data.user.email || '',
        avatar: response.data.user.avatar || '',
      },
    };
  },

  async verifyCode(code: string): Promise<{ verified: boolean }> {
    const response = await apiClient.post('/auth/verify', { code });
    return response.data;
  },

  async refreshToken(token: string): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/refresh', { token });
    return response.data;
  },
};
