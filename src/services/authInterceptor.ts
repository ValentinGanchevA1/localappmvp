import { store } from '@/store';

/**
 * Get current auth token from Redux store
 * Used to avoid circular dependencies in API client
 */
export const getAuthToken = (): string | null => {
  return store.getState().auth.token;
};

export const isAuthenticated = (): boolean => {
  const state = store.getState().auth;
  return state.isAuthenticated && !!state.token;
};

export const getUserId = (): string | null => {
  return store.getState().auth.user?.id || null;
};

export const clearAuth = () => {
  // Import logout here to avoid circular dependency
  const { logout } = require('@/store/slices/authSlice');
  store.dispatch(logout());
};
