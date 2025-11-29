import { userApi } from '@/api/userApi';
import { UserProfile, UserPreferences } from '@/types/user';

export const userService = {
  getProfile: (userId: string) => {
    return userApi.getUserById(userId);
  },
  updateProfile: (profileData: Partial<UserProfile>) => {
    return userApi.updateUserProfile(profileData);
  },
  updatePreferences: (preferences: Partial<UserPreferences>) => {
    return userApi.updatePreferences(preferences);
  },
  uploadProfileImage: (imageUri: string) => {
    return userApi.uploadAvatar(imageUri);
  },
  deleteAccount: () => {
    return userApi.deleteAccount();
  },
};
