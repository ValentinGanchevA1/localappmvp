import { useCallback, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Region } from 'react-native-maps';
import { updateRegion, fetchNearbyData } from '@/store/slices/locationSlice';

/**
 * useLocationManager - Manages map region and debounced data fetching.
 */
export const useLocationManager = () => {
  const dispatch = useAppDispatch();
  const { region, latitude, longitude, error } = useAppSelector((state) => state.location);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const debounceTimeoutRef = useRef<number | null>(null);

  const setRegion = useCallback(
    (newRegion: Region) => {
      dispatch(updateRegion(newRegion));
    },
    [dispatch]
  );

  const onRegionChangeComplete = useCallback(
    (newRegion: Region) => {
      setRegion(newRegion);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        dispatch(
          fetchNearbyData({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            radius: 5000, // or calculate from region
          })
        );
      }, 800); // Debounce time
    },
    [dispatch, setRegion]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    region,
    latitude,
    longitude,
    error,
    isInitializing: !region && isAuthenticated,
    setRegion,
    onRegionChangeComplete,
  };
};
