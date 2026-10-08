/**
 * Application Environment Configuration
 * Provides safe defaults and configurable endpoints for FitTrack.
 */

export interface AppConfig {
  apiBaseUrl: string;
  googleWebClientId: string;
  isDev: boolean;
  mockMode: boolean;
  appVersion: string;
  androidPackageName: string;
}

export const ENV: AppConfig = {
  // Update with your laptop's local IP (e.g. 'http://192.168.1.100:8000') when testing with physical phone
  apiBaseUrl: 'http://10.0.2.2:8000', // Default Android emulator host for localhost
  googleWebClientId: 'your-google-web-client-id.apps.googleusercontent.com',
  isDev: __DEV__,
  mockMode: false,
  appVersion: '1.0.0',
  androidPackageName: 'com.fittrack',
};

// Allow runtime override of API URL from Settings screen for easy testing on physical phone!
let runtimeApiBaseUrl: string | null = null;

export const getApiBaseUrl = (): string => {
  return runtimeApiBaseUrl || ENV.apiBaseUrl;
};

export const setRuntimeApiBaseUrl = (url: string) => {
  runtimeApiBaseUrl = url.trim();
};
