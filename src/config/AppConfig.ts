import { Platform } from 'react-native';

export const AppConfig = {
  // Android Emulator → host machine`
  API_BASE_URL:
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api', // iOS Simulator or real device on same WiFi → use your Mac/IP
  // API_BASE_URL: 'https://api.freeact.app/api', // Production API
} as const;
