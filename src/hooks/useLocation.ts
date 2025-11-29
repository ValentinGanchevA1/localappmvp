// src/hooks/useLocation.ts
import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  startLocationTracking,
  stopLocationTracking,
  fetchNearbyData,
  updateCurrentLocation,
  clearLocationError,
} from '@/store/slices/locationSlice';
import { requestLocationPermission } from '@/utils/permissions';
import { LocationPermission } from '@/types';

/**
 * useLocation Hook - Location tracking and nearby users
 *
 * Provides:
 * - Start/stop location tracking
 * - Get current location
 * - Fetch nearby users
 * - Permission handling
 */
export const useLocation = () => {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  const [permissions, setPermissions] = useState<LocationPermission>('undetermined');

  /**
   * Start location tracking with permission check
   */
  const startTracking = useCallback(async () => {
    try {
      // Request permission first
      const permission = await requestLocationPermission();
      setPermissions(permission);

      if (permission !== 'granted') {
        console.warn('Location permission denied');
        return { success: false, error: 'Permission denied' };
      }

      // Start tracking
      const result = await dispatch(startLocationTracking()).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Failed to start location tracking:', error);
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  /**
   * Stop location tracking
   */
  const stopTracking = useCallback(() => {
    dispatch(stopLocationTracking());
  }, [dispatch]);

  /**
   * Get current location once
   */
  const getCurrentLocation = useCallback(async () => {
    try {
      const result = await dispatch(updateCurrentLocation()).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Failed to get current location:', error);
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  /**
   * Fetch nearby users within radius
   */
  const refreshNearbyUsers = useCallback(
    async (params?: {
      latitude?: number;
      longitude?: number;
      radius?: number;
    }) => {
      if (permissions !== 'granted') {
        return { success: false, error: 'Permission not granted' };
      }

      try {
        // Use provided coords or current location
        const latitude = params?.latitude ?? locationState.latitude;
        const longitude = params?.longitude ?? locationState.longitude;

        if (!latitude || !longitude) {
          throw new Error('Location not available');
        }

        const result = await dispatch(
          fetchNearbyData({
            latitude,
            longitude,
            radius: params?.radius || 1000,
          })
        ).unwrap();

        return { success: true, data: result };
      } catch (error: any) {
        console.error('Failed to fetch nearby users:', error);
        return { success: false, error: error.message };
      }
    },
    [dispatch, permissions, locationState.latitude, locationState.longitude]
  );

  /**
   * Clear location error
   */
  const clearError = useCallback(() => {
    dispatch(clearLocationError());
  }, [dispatch]);

  /**
   * Check if location is available
   */
  const hasLocation = !!(locationState.latitude && locationState.longitude);

  /**
   * Auto-refresh nearby users when location changes
   */
  useEffect(() => {
    if (
      locationState.tracking &&
      locationState.latitude &&
      locationState.longitude
    ) {
      // Debounce to avoid too many requests
      const timer = setTimeout(() => {
        refreshNearbyUsers();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [locationState.latitude, locationState.longitude, locationState.tracking]);

  return {
    // State
    ...locationState,
    permissions,
    hasLocation,

    // Actions
    startTracking,
    stopTracking,
    getCurrentLocation,
    refreshNearbyUsers,
    clearError,
  };
};
