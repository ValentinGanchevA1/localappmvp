import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginWithPhone,
  registerWithPhone,
  logout,
  clearError,
} from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

/**
 * useAuth Hook - Handles all authentication
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      // Ensure credentials are strings, not arrays
      const cleanCredentials = {
        phone: String(credentials.phone).trim(),
        password: String(credentials.password).trim(),
      };

      console.log('[useAuth] Login attempt:', { phone: cleanCredentials.phone });

      const result = await dispatch(loginWithPhone(cleanCredentials));
      return result;
    },
    [dispatch]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      // Ensure all fields are strings or undefined, never arrays
      const cleanCredentials = {
        phone: String(credentials.phone).trim(),
        password: String(credentials.password).trim(),
        name: credentials.name ? String(credentials.name).trim() : undefined,
        email: credentials.email ? String(credentials.email).trim() : undefined,
      };

      console.log('[useAuth] Register attempt:', { phone: cleanCredentials.phone });

      const result = await dispatch(registerWithPhone(cleanCredentials));
      return result;
    },
    [dispatch]
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    ...authState,
    isAuthenticated: authState.isAuthenticated && !!authState.token,

    // Actions
    login,
    register,
    signOut,
    clearAuthError,
  };
};
