// src/services/userService.ts
import { apiClient } from './api';
import { UserProfile, UserPreferences } from '@/types/user';

export const userService = {
  async getProfile(userId: string) {
    return await apiClient.get<UserProfile>(`/users/${userId}/profile`);
  },

  async updateProfile(profileData: Partial<UserProfile>) {
    return await apiClient.put<UserProfile>('/user/profile', profileData);
  },

  async updatePreferences(preferences: Partial<UserPreferences>) {
    return await apiClient.put('/user/preferences', preferences);
  },

  async uploadProfileImage(imageUri: string) {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    return await apiClient.post<{ imageUrl: string }>(
      '/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  async deleteAccount() {
    return await apiClient.delete('/user/account');
  },
};
