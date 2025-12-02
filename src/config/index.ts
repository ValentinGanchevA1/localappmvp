import { AppEnvironment } from './environment';

export const AppConfig = {
  API_BASE_URL: AppEnvironment.API_BASE_URL,
  API_TIMEOUT: AppEnvironment.API_TIMEOUT,
  ENABLE_API_LOGGING: AppEnvironment.ENABLE_API_LOGGING,
  SOCKET_URL: AppEnvironment.SOCKET_URL,
};

export { AppEnvironment };
