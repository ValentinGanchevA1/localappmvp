// src/types/index.ts - CONSOLIDATED

// Auth types
export interface LoginCredentials {
  phone: string;
}

export type LocationPermission = 'granted' | 'denied' | 'undetermined';

// Navigation - Export consolidated types
export * from './navigation';
export * from './auth';
export * from './user';
export * from './location';
