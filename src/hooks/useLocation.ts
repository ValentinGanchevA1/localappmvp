import { useCallback, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  startLocationTracking,
  stopLocationTracking,
  fetchNearbyData,
  updateCurrentLocation,
  clearLocationError,
  updateRegion,
} from '@/store/slices/locationSlice';
import { requestLocationPermission } from '@/utils/permissions';
import { LocationPermission } from '@/types/location';
import Geolocation from 'react-native-geolocation-service';
import { Region } from 'react-native-maps';
import { locationService } from '@/services/locationService';

/**
 * useLocation Hook - Real-time geolocation tracking and data fetching.
 */
export const useLocation = () => {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);
  const [permission, setPermission] = useState<LocationPermission>(
    'undetermined'
  );
  const watchIdRef = useRef<number | null>(null);

  const handlePermission = useCallback(async () => {
    const status = await requestLocationPermission();
    setPermission(status);
    return status;
  }, []);

  const startTracking = useCallback(async () => {
    try {
      const perm = await handlePermission();
      if (perm !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get initial location to center map
      const { latitude, longitude } =
        await locationService.getCurrentLocation();

      const initialRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      dispatch(updateRegion(initialRegion));
      dispatch(updateCurrentLocation());

      // Start watching for location changes
      watchIdRef.current = Geolocation.watchPosition(
        (position) => {
          dispatch(updateCurrentLocation());
          dispatch(
            fetchNearbyData({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              radius: 5000,
            })
          );
        },
        (error) => console.error('[useLocation] Watch Error:', error),
        { enableHighAccuracy: true, distanceFilter: 50, interval: 10000 }
      );

      dispatch(startLocationTracking());
      return { success: true };
    } catch (error: any) {
      console.error('[useLocation] Start Tracking Error:', error);
      return { success: false, error: error.message };
    }
  }, [dispatch, handlePermission]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    dispatch(stopLocationTracking());
  }, [dispatch]);

  const getCurrentLocation = useCallback(async () => {
    try {
      const result = await dispatch(updateCurrentLocation()).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  const refreshNearbyUsers = useCallback(
    async (params?: {
      latitude?: number;
      longitude?: number;
      radius?: number;
    }) => {
      if (permission !== 'granted') {
        return { success: false, error: 'Permission not granted' };
      }
      try {
        const { latitude, longitude } = locationState;
        if (!latitude || !longitude) {
          throw new Error('Location not available');
        }
        const result = await dispatch(
          fetchNearbyData({
            latitude: params?.latitude ?? latitude,
            longitude: params?.longitude ?? longitude,
            radius: params?.radius || 5000,
          })
        ).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [
      dispatch,
      permission,
      locationState.latitude,
      locationState.longitude,
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...locationState,
    permission,
    hasLocation: !!(
      locationState.latitude && locationState.longitude
    ),
    startTracking,
    stopTracking,
    getCurrentLocation,
    refreshNearbyUsers,
    clearError: useCallback(() => dispatch(clearLocationError()), [dispatch]),
  };
};
