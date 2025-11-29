// src/services/authService.ts
import { apiClient } from './api';
import { LoginCredentials } from '@/types';
import { User } from '@/types/user';

export const authService = {
  async loginWithPhone(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    // In a real app, the server would return the user and token
    const response = await apiClient.post('/auth/phone', credentials);
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
    return { token: response.data.token, user };
  },
};
