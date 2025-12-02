import axiosInstance from '@/api/axiosInstance';
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
    const data = await axiosInstance.post<AuthResponse>('/auth/phone', credentials);
    const response = (data as any).data || data;
    return {
      token: response.access_token,
      user: {
        id: response.user.id,
        name: response.user.name || '',
        email: response.user.email || '',
        avatar: response.user.avatar || '',
      },
    };
  },

  async registerWithPhone(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const data = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
    const response = (data as any).data || data;
    return {
      token: response.access_token,
      user: {
        id: response.user.id,
        name: response.user.name || '',
        email: response.user.email || '',
        avatar: response.user.avatar || '',
      },
    };
  },

  async loginWithPassword(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const data = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    const response = (data as any).data || data;
    return {
      token: response.access_token,
      user: {
        id: response.user.id,
        name: response.user.name || '',
        email: response.user.email || '',
        avatar: response.user.avatar || '',
      },
    };
  },

  async verifyCode(code: string): Promise<{ verified: boolean }> {
    return await axiosInstance.post('/auth/verify', { code });
  },

  async refreshToken(token: string): Promise<{ token: string }> {
    return await axiosInstance.post('/auth/refresh', { token });
  },
};
