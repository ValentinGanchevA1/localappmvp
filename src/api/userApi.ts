// src/api/userApi.ts
import axiosInstance from './axiosInstance';
import { User, UserPreferences } from '@/types/user';

// User profile operations
export const userApi = {
  // Get current user profile
  getUserProfile: async () => {
    const response = await axiosInstance.get<User>('/user/profile');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (data: Partial<User>) => {
    const response = await axiosInstance.put<User>('/user/profile', data);
    return response.data;
  },

  // Upload profile image
  uploadAvatar: async (imageUri: string) => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await axiosInstance.post<{ avatarUrl: string }>(
      '/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Delete user account
  deleteAccount: async () => {
    const response = await axiosInstance.delete('/user/account');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    const response = await axiosInstance.get<User>(`/users/${userId}`);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences: Partial<UserPreferences>) => {
    const response = await axiosInstance.put('/user/preferences', preferences);
    return response.data;
  },

  // Block user
  blockUser: async (userId: string) => {
    const response = await axiosInstance.post(`/users/${userId}/block`);
    return response.data;
  },

  // Report user
  reportUser: async (userId: string, reason: string) => {
    const response = await axiosInstance.post(`/users/${userId}/report`, {
      reason,
    });
    return response.data;
  },
};

// Export individual functions for convenience
export const {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteAccount,
  getUserById,
  updatePreferences,
  blockUser,
  reportUser,
} = userApi;
