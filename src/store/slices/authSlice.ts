import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ValidationUtils } from '@/utils/validation';
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

export const loginWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async (
    credentials: { phone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Clean payload
      const payload = {
        phone: String(credentials.phone || '').trim(),
        password: String(credentials.password || '').trim(),
      };

      if (__DEV__) {
        console.log('[authSlice] Login payload:', payload);
      }

      // Validate
      if (!ValidationUtils.validateAuthPayload(payload)) {
        return rejectWithValue('Invalid phone or password');
      }

      // Send request
      const response = await axiosInstance.post('/api/auth/login', payload);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerWithPhone = createAsyncThunk(
  'auth/registerWithPhone',
  async (
    credentials: {
      phone: string;
      password: string;
      name?: string;
      email?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Build clean payload - only include fields if provided
      const payload: any = {
        phone: String(credentials.phone || '').trim(),
        password: String(credentials.password || '').trim(),
      };

      if (credentials.name && String(credentials.name).trim()) {
        payload.name = String(credentials.name).trim();
      }

      if (credentials.email && String(credentials.email).trim()) {
        payload.email = String(credentials.email).trim();
      }

      if (__DEV__) {
        console.log('[authSlice] Register payload:', payload);
      }

      // Validate
      if (!ValidationUtils.validateRegisterPayload(payload)) {
        return rejectWithValue('Invalid registration data');
      }

      // Send request
      const response = await axiosInstance.post('/api/auth/register', payload);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginWithPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerWithPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerWithPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
