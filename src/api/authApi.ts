import { User } from '@/types/user';

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  register: async (credentials: {
    phone: string;
    password: string;
    name?: string;
    email?: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/api/auth/register', {
        phone: credentials.phone,
        password: credentials.password,
        name: credentials.name || undefined,
        email: credentials.email || undefined,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  },

  login: async (credentials: {
    phone: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/api/auth/login', {
        phone: credentials.phone,
        password: credentials.password,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>('/api/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
