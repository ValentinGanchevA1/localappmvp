import Geolocation from 'react-native-geolocation-service';
import axiosInstance from '@/api/axiosInstance';

export const locationService = {
  getCurrentLocation: () => {
    return new Promise<{ latitude: number; longitude: number; accuracy: number }>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('[locationService] getCurrentLocation Error:', error.code, error.message);
          reject(new Error(error.message));
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
    });
  },

  fetchNearby: (params: { latitude: number; longitude: number; radius?: number }) => {
    if (!axiosInstance) {
      throw new Error('axiosInstance is not initialized');
    }
    return axiosInstance.get('/api/users/nearby', {
      params: {
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius || 5000,
      },
    });
  },

  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  },
};
