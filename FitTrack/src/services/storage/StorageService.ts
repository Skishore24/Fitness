/**
 * FitTrack Local Storage Service
 * Provides robust offline-first caching for activity, profile, goals, workouts, and sync queues.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  ActivitySummary,
  UserGoals,
  WorkoutSession,
  HealthPermissionsState,
  ThemeMode,
} from '../../types';

const STORAGE_KEYS = {
  USER_PROFILE: '@fittrack:user_profile',
  ONBOARDING_COMPLETED: '@fittrack:onboarding_completed',
  THEME_MODE: '@fittrack:theme_mode',
  USER_GOALS: '@fittrack:user_goals',
  TODAY_ACTIVITY: '@fittrack:today_activity',
  ACTIVITY_HISTORY: '@fittrack:activity_history',
  WORKOUT_HISTORY: '@fittrack:workouts',
  LAST_SYNC_TIME: '@fittrack:last_sync_time',
  OFFLINE_QUEUE: '@fittrack:offline_sync_queue',
  HEALTH_PERMISSIONS: '@fittrack:health_permissions',
  API_BASE_URL: '@fittrack:api_base_url',
};

export const DEFAULT_GOALS: UserGoals = {
  dailySteps: 10000,
  dailyCalories: 500,
  activeMinutes: 45,
  water: 2500, // ml
};

export const StorageService = {
  // --- User Profile ---
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('StorageService: getUserProfile failed', e);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(profile)
      );
    } catch (e) {
      console.warn('StorageService: saveUserProfile failed', e);
    }
  },

  // --- Onboarding ---
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return data === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        completed ? 'true' : 'false'
      );
    } catch (e) {
      console.warn('StorageService: setOnboardingCompleted failed', e);
    }
  },

  // --- Goals ---
  async getGoals(): Promise<UserGoals> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_GOALS);
      return data ? JSON.parse(data) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  },

  async saveGoals(goals: UserGoals): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_GOALS, JSON.stringify(goals));
    } catch (e) {
      console.warn('StorageService: saveGoals failed', e);
    }
  },

  // --- Activity Cache ---
  async getTodayActivity(): Promise<ActivitySummary | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TODAY_ACTIVITY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveTodayActivity(activity: ActivitySummary): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TODAY_ACTIVITY,
        JSON.stringify(activity)
      );
    } catch (e) {
      console.warn('StorageService: saveTodayActivity failed', e);
    }
  },

  async getActivityHistory(): Promise<ActivitySummary[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveActivityHistory(history: ActivitySummary[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ACTIVITY_HISTORY,
        JSON.stringify(history)
      );
    } catch (e) {
      console.warn('StorageService: saveActivityHistory failed', e);
    }
  },

  // --- Workouts ---
  async getWorkouts(): Promise<WorkoutSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveWorkout(workout: WorkoutSession): Promise<void> {
    try {
      const workouts = await this.getWorkouts();
      // Add new workout to beginning
      const updated = [workout, ...workouts.filter((w) => w.id !== workout.id)];
      await AsyncStorage.setItem(
        STORAGE_KEYS.WORKOUT_HISTORY,
        JSON.stringify(updated)
      );
    } catch (e) {
      console.warn('StorageService: saveWorkout failed', e);
    }
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      const workouts = await this.getWorkouts();
      const updated = workouts.filter((w) => w.id !== workoutId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.WORKOUT_HISTORY,
        JSON.stringify(updated)
      );
    } catch (e) {
      console.warn('StorageService: deleteWorkout failed', e);
    }
  },

  // --- Sync State ---
  async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
    } catch {
      return null;
    }
  },

  async setLastSyncTime(isoTime: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, isoTime);
    } catch (e) {
      console.warn('StorageService: setLastSyncTime failed', e);
    }
  },

  async getOfflineQueue(): Promise<ActivitySummary[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async addToOfflineQueue(activity: ActivitySummary): Promise<void> {
    try {
      const queue = await this.getOfflineQueue();
      // Replace existing entry for the same date or append
      const filtered = queue.filter((item) => item.date !== activity.date);
      filtered.push(activity);
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_QUEUE,
        JSON.stringify(filtered)
      );
    } catch (e) {
      console.warn('StorageService: addToOfflineQueue failed', e);
    }
  },

  async clearOfflineQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    } catch (e) {
      console.warn('StorageService: clearOfflineQueue failed', e);
    }
  },

  // --- Theme ---
  async getThemeMode(): Promise<ThemeMode> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return (theme as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  },

  async saveThemeMode(theme: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, theme);
    } catch (e) {
      console.warn('StorageService: saveThemeMode failed', e);
    }
  },

  // --- Health Permission Cache ---
  async getCachedHealthPermissions(): Promise<HealthPermissionsState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_PERMISSIONS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveCachedHealthPermissions(
    state: HealthPermissionsState
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.HEALTH_PERMISSIONS,
        JSON.stringify(state)
      );
    } catch (e) {
      console.warn('StorageService: saveCachedHealthPermissions failed', e);
    }
  },

  // --- Clear / Reset ---
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('StorageService: clearAll failed', e);
    }
  },
};
