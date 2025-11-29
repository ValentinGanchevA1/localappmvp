import { createSlice, createAsyncThunk, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { UserProfile, UserPreferences } from '@/types/user';
import { userService } from '@/services/userService';
import { RootState } from '@/store/store';

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  preferences: {
    notifications: {
      push: true,
      email: true,
    },
    theme: 'light',
  },
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<UserProfile, void, { state: RootState }>('user/fetchUserProfile', async (_, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;
  if (!userId) {
    return rejectWithValue('User not authenticated');
  }
  try {
    return await userService.getProfile(userId);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch profile');
  }
});

export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
  try {
    return await userService.updateProfile(profileData);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update profile');
  }
});

export const updatePreferences = createAsyncThunk('user/updatePreferences', async (preferences: Partial<UserPreferences>, { rejectWithValue }) => {
  try {
    return await userService.updatePreferences(preferences);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update preferences');
  }
});

export const uploadProfileImage = createAsyncThunk('user/uploadProfileImage', async (imageUri: string, { rejectWithValue }) => {
  try {
    const { avatarUrl } = await userService.uploadProfileImage(imageUri);
    return avatarUrl;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to upload image');
  }
});

export const deleteAccount = createAsyncThunk('user/deleteAccount', async (_, { rejectWithValue }) => {
  try {
    await userService.deleteAccount();
    return true;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete account');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateLocalProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      } else {
        state.profile = action.payload as UserProfile;
      }
    },
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<Partial<UserProfile>>) => {
        state.profile = { ...(state.profile as UserProfile), ...action.payload };
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload;
        }
      })
      .addCase(deleteAccount.fulfilled, () => initialState)
      .addMatcher(isAnyOf(fetchUserProfile.pending, updateUserProfile.pending, uploadProfileImage.pending, deleteAccount.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isAnyOf(fetchUserProfile.rejected, updateUserProfile.rejected, updatePreferences.rejected, uploadProfileImage.rejected, deleteAccount.rejected), (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addMatcher(isAnyOf(fetchUserProfile.fulfilled, updateUserProfile.fulfilled, updatePreferences.fulfilled, uploadProfileImage.fulfilled), (state) => {
        state.loading = false;
      });
  },
});

export const { updateLocalProfile, setPreferences, clearUserError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
