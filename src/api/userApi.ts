import axiosInstance from './axiosInstance';
import { User, UserPreferences, UserProfile } from '@/types/user';

interface AvatarResponse {
  avatarUrl: string;
}

export const userApi = {
  getUserProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/user/profile');
    return response.data;
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put<User>('/user/profile', data);
    return response.data;
  },

  uploadAvatar: async (imageUri: string): Promise<AvatarResponse> => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await axiosInstance.post<AvatarResponse>(
      '/user/avatar',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await axiosInstance.delete('/user/account');
  },

  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>(`/users/${userId}`);
    return response.data;
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const response = await axiosInstance.put<UserPreferences>('/user/preferences', preferences);
    return response.data;
  },

  blockUser: async (userId: string): Promise<void> => {
    await axiosInstance.post(`/users/${userId}/block`);
  },

  reportUser: async (userId: string, reason: string): Promise<void> => {
    await axiosInstance.post(`/users/${userId}/report`, { reason });
  },
};
