// src/hooks/useLocationManager.ts
import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Region } from 'react-native-maps';
import {
  updateRegion,
  fetchNearbyData,
  updateCurrentLocation,
} from '@/store/slices/locationSlice';
import { requestLocationPermission } from '@/utils/permissions';
import { locationService } from '@/services/locationService';

/**
 * useLocationManager - Advanced location management for MapScreen
 *
 * Handles:
 * - Region updates
 * - Debounced nearby user fetching
 * - Location initialization
 * - Background/foreground transitions
 */
export const useLocationManager = () => {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  const authState = useAppSelector((state) => state.auth);

  const fetchTimeoutRef = useRef<NodeJS.Timeout>();
  const lastFetchRef = useRef<{ latitude: number; longitude: number } | null>(
    null
  );

  /**
   * Initialize location on mount
   */
  useEffect(() => {
    const initialize = async () => {
      if (!authState.isAuthenticated) return;

      try {
        const permission = await requestLocationPermission();
        if (permission !== 'granted') {
          console.warn('Location permission denied');
          return;
        }

        const location = await locationService.getCurrentLocation();

        // Set initial region
        const initialRegion: Region = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        dispatch(updateRegion(initialRegion));

        // Fetch nearby users
        await dispatch(
          fetchNearbyData({
            latitude: location.latitude,
            longitude: location.longitude,
            radius: 1000,
          })
        );

        lastFetchRef.current = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      } catch (error) {
        console.error('Location initialization failed:', error);
      }
    };

    initialize();
  }, [authState.isAuthenticated, dispatch]);

  /**
   * Update map region
   */
  const setRegion = useCallback(
    (newRegion: Region) => {
      dispatch(updateRegion(newRegion));
    },
    [dispatch]
  );

  /**
   * Debounced fetch of nearby users when region changes
   */
  const debouncedFetchNearby = useCallback(
    (latitude: number, longitude: number) => {
      // Clear existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Check if we've moved significantly
      const lastFetch = lastFetchRef.current;
      if (lastFetch) {
        const distance = locationService.calculateDistance(
          lastFetch.latitude,
          lastFetch.longitude,
          latitude,
          longitude
        );

        // Only fetch if moved more than 100 meters
        if (distance < 100) {
          return;
        }
      }

      // Set new timeout
      fetchTimeoutRef.current = setTimeout(async () => {
        try {
          await dispatch(
            fetchNearbyData({
              latitude,
              longitude,
              radius: 1000,
            })
          ).unwrap();

          lastFetchRef.current = { latitude, longitude };
        } catch (error) {
          console.error('Failed to fetch nearby users:', error);
        }
      }, 1000); // 1 second debounce
    },
    [dispatch]
  );

  /**
   * Handle region change (called by MapView)
   */
  const onRegionChangeComplete = useCallback(
    (region: Region) => {
      setRegion(region);
      debouncedFetchNearby(region.latitude, region.longitude);
    },
    [setRegion, debouncedFetchNearby]
  );

  /**
   * Refresh current location
   */
  const refreshLocation = useCallback(async () => {
    try {
      const result = await dispatch(updateCurrentLocation()).unwrap();

      // Update region to new location
      const newRegion: Region = {
        latitude: result.latitude,
        longitude: result.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      dispatch(updateRegion(newRegion));

      return { success: true, data: result };
    } catch (error: any) {
      console.error('Failed to refresh location:', error);
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...locationState,
    isInitializing: !locationState.region && authState.isAuthenticated,
    setRegion,
    onRegionChangeComplete,
    refreshLocation,
    locationError: locationState.error
      ? { message: locationState.error }
      : null,
  };
};
