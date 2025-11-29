import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ValidationUtils } from '@/utils/validation';
import { User } from '@/types/user';
import { SocketService } from '@/services/socketService';
import axiosInstance from '@/api/axiosInstance';

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

interface LoginCredentials {
  phone: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name?: string;
  email?: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export const loginWithPhone = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/loginWithPhone',
  async (credentials, { rejectWithValue }) => {
    try {
      const payload = {
        phone: String(credentials.phone).trim(),
        password: String(credentials.password).trim(),
      };

      if (!ValidationUtils.validateAuthPayload(payload)) {
        return rejectWithValue('Invalid phone or password');
      }

      const response = await axiosInstance.post<AuthResponse>('/auth/login', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerWithPhone = createAsyncThunk<AuthResponse, RegisterCredentials>(
  'auth/registerWithPhone',
  async (credentials, { rejectWithValue }) => {
    try {
      const payload: any = {
        phone: String(credentials.phone).trim(),
        password: String(credentials.password).trim(),
      };

      if (credentials.name) payload.name = String(credentials.name).trim();
      if (credentials.email) payload.email = String(credentials.email).trim();

      if (!ValidationUtils.validateRegisterPayload(payload)) {
        return rejectWithValue('Invalid registration data');
      }

      const response = await axiosInstance.post<AuthResponse>('/auth/register', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      SocketService.getInstance().disconnect();
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
