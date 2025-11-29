// src/services/locationService.ts
import { apiClient } from './api';
import Geolocation from 'react-native-geolocation-service';

export const locationService = {
  async start() {
    // In a real app, this would likely involve setting up a background service
    // to track the user's location and send it to the server.
    console.log('Location tracking started.');
    return Promise.resolve();
  },
  stop() {
    console.log('Location tracking stopped.');
  },
  async fetchNearby(params: { latitude: number; longitude: number; radius?: number }) {
    const response = await apiClient.get('/users/nearby', { params });
    return response.data;
  },
  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  },
};
