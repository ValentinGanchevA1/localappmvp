// src/hooks/useLocationManager.ts - REFACTORED
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Region } from 'react-native-maps';
import { RootState, AppDispatch } from '@/store';
import { updateRegion, fetchNearbyData } from '@/store/slices/locationSlice'; // Consolidated
import { User } from '@/types/user';
import { requestLocationPermission } from '@/utils/permissions';
import { locationService } from '@/services/locationService';

export const useLocationManager = (
  user: User | null,
  dispatch: AppDispatch,
) => {
  const locationState = useSelector((state: RootState) => state.location);
  const { region } = locationState;
  const isInitializing = !region && !!user; // Derive from state

  useEffect(() => {
    const initialize = async () => {
      if (!user) return;

      try {
        const permission = await requestLocationPermission();
        if (permission !== 'granted') {
          // Dispatch an error action or handle it appropriately
          console.error('Location permission denied');
          return;
        }

        const loc = await locationService.getCurrentLocation();
        const initialRegion: Region = {
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        dispatch(updateRegion(initialRegion));
        dispatch(
          fetchNearbyData({ latitude: loc.latitude, longitude: loc.longitude }),
        );
      } catch (err) {
        console.error('Location init failed:', err);
        // Dispatch error if the slice supports it
      }
    };

    initialize().catch(err =>
      console.error('Failed to initialize location manager:', err),
    );
  }, [user, dispatch]);

  const setRegion = (newRegion: Region) => {
    dispatch(updateRegion(newRegion));
    // Debounced fetch in MapScreen
  };

  return {
    ...locationState,
    isInitializing,
    setRegion,
    locationError: locationState.error ? { message: locationState.error } : null
  };
};
