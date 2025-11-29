// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoginCredentials } from '@/types';
import { authService } from '@/services/authService';
import { User } from '@/types/user';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

// ============================================
// Async Thunks
// ============================================

export const loginWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.loginWithPhone(credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerWithPhone = createAsyncThunk(
  'auth/registerWithPhone',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.registerWithPhone(credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const data = await authService.verifyCode(code);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error('No token available');
      }

      const data = await authService.refreshToken(token);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// Slice
// ============================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // Login with Phone
      .addCase(loginWithPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register with Phone
      .addCase(registerWithPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify Code
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state) => {
        // Token refresh failed - logout user
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError, updateUser, setToken } = authSlice.actions;
export default authSlice.reducer;
