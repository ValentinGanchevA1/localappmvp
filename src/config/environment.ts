// src/config/environment.ts - ENVIRONMENT CONFIGURATION
import { Platform } from 'react-native';

interface AppEnvironment {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_API_LOGGING: boolean;
  SOCKET_URL: string;
}

const isDevelopment = __DEV__;

const getDevBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000'; // Android Emulator
  }
  return 'http://localhost:3000'; // iOS Simulator/real device
};

const environments: Record<string, AppEnvironment> = {
  development: {
    API_BASE_URL: getDevBaseUrl(),
    API_TIMEOUT: 30000,
    ENABLE_API_LOGGING: true,
    SOCKET_URL: getDevBaseUrl(),
  },
  staging: {
    API_BASE_URL: 'https://staging-api.your-domain.com',
    API_TIMEOUT: 20000,
    ENABLE_API_LOGGING: true,
    SOCKET_URL: 'https://staging-api.your-domain.com',
  },
  production: {
    API_BASE_URL: 'https://api.your-domain.com',
    API_TIMEOUT: 15000,
    ENABLE_API_LOGGING: false,
    SOCKET_URL: 'https://api.your-domain.com',
  },
};

export const getEnvironment = (): AppEnvironment => {
  const env = isDevelopment ? 'development' : 'production';
  return environments[env];
};

export const AppEnvironment = getEnvironment();
