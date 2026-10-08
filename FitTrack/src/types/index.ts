/**
 * Core Type Definitions for FitTrack
 */

export type FitnessGoal = 'Lose Weight' | 'Gain Muscle' | 'Maintain Weight' | 'Improve Fitness';

export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type WorkoutType =
  | 'Walking'
  | 'Running'
  | 'Cycling'
  | 'Strength Training'
  | 'HIIT'
  | 'Yoga';

export interface UserProfile {
  id?: string;
  firebaseUid: string;
  googleId?: string;
  email: string;
  name: string;
  profileImage?: string;
  age?: number;
  gender?: Gender;
  height?: number; // cm
  weight?: number; // kg
  fitnessGoal?: FitnessGoal;
  activityLevel?: ActivityLevel;
  onboardingCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivitySummary {
  date: string; // YYYY-MM-DD
  steps: number;
  distance: number; // kilometers
  calories: number; // kcal
  activeMinutes: number; // minutes
}

export interface UserGoals {
  dailySteps: number;
  dailyCalories: number;
  activeMinutes: number;
  water: number; // ml
}

export interface WorkoutSession {
  id: string;
  userId?: string;
  type: WorkoutType;
  startTime: string; // ISO
  endTime: string; // ISO
  durationSeconds: number;
  distance?: number; // km
  calories: number; // kcal
  createdAt: string;
  isSynced?: boolean;
}

export type HealthConnectStatus =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'PROVIDER_UPDATE_REQUIRED';

export interface HealthPermissionsState {
  stepsGranted: boolean;
  distanceGranted: boolean;
  caloriesGranted: boolean;
  exerciseGranted: boolean;
  allGranted: boolean;
}

export interface SyncState {
  lastSyncTime: string | null;
  isSyncing: boolean;
  pendingCount: number;
  error: string | null;
  isOffline: boolean;
}

export type ThemeMode = 'dark' | 'light' | 'system';
