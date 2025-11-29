
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginWithPhone,
  registerWithPhone,
  verifyCode,
  logout,
  clearError,
  updateUser,
  refreshToken,
} from '@/store/slices/authSlice';
import { resetUserState } from '@/store/slices/userSlice';
import { clearTasks } from '@/store/slices/taskSlice';
import { User } from '@/types/user';

export interface LoginCredentials {
  phone: string;
  password?: string;
}

/**
 * useAuth Hook - Centralized authentication logic
 *
 * Provides all authentication-related functionality including:
 * - Login/Register
 * - Phone verification
 * - Logout
 * - Error handling
 * - Auth state access
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  /**
   * Login with phone and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return await dispatch(loginWithPhone(credentials));
    },
    [dispatch]
  );

  /**
   * Register new user
   */
  const registerUser = useCallback(
    async (credentials: LoginCredentials) => {
      return await dispatch(registerWithPhone(credentials));
    },
    [dispatch]
  );

  /**
   * Verify phone with code
   */
  const verify = useCallback(
    async (code: string) => {
      return await dispatch(verifyCode(code));
    },
    [dispatch]
  );

  /**
   * Sign out user and clear all data
   */
  const signOut = useCallback(async () => {
    // Clear all slices
    dispatch(logout());
    dispatch(resetUserState());
    dispatch(clearTasks());

    // Optional: Call backend to invalidate token
    // await authService.logout();
  }, [dispatch]);

  /**
   * Clear authentication error
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Update current user data
   */
  const updateCurrentUser = useCallback(
    (userData: Partial<User>) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  /**
   * Refresh authentication token
   */
  const refresh = useCallback(async () => {
    return await dispatch(refreshToken());
  }, [dispatch]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = authState.isAuthenticated && !!authState.token;

  return {
    // State
    ...authState,
    isAuthenticated,

    // Actions
    login,
    registerUser,
    verify,
    signOut,
    clearAuthError,
    updateCurrentUser,
    refresh,
  };
};
