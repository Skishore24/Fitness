/**
 * FitTrack Backend API Service & Offline Sync Engine
 * Handles communication with FastAPI backend, token injection, and offline queue reconciliation.
 */
import axios, { AxiosInstance } from 'axios';
import { getApiBaseUrl } from '../../config/env';
import { AuthService } from '../auth/AuthService';
import { StorageService } from '../storage/StorageService';
import {
  UserProfile,
  ActivitySummary,
  UserGoals,
  WorkoutSession,
  SyncState,
} from '../../types';

class ApiServiceClass {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 8000, // Fast timeout for responsiveness when backend is offline
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to inject Firebase ID token
    this.client.interceptors.request.use(async (config) => {
      config.baseURL = getApiBaseUrl();
      const token = await AuthService.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Checks if backend server is reachable.
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200 && response.data?.status === 'ok';
    } catch {
      return false;
    }
  }

  // --- User Profile ---
  async getMyProfile(): Promise<UserProfile | null> {
    try {
      const res = await this.client.get('/users/me');
      return res.data;
    } catch {
      return null;
    }
  }

  async updateMyProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const res = await this.client.put('/users/me', profile);
      return res.data;
    } catch {
      return null;
    }
  }

  // --- Goals ---
  async getGoals(): Promise<UserGoals | null> {
    try {
      const res = await this.client.get('/goals');
      if (!res.data) return null;
      return {
        dailySteps: res.data.dailySteps ?? res.data.daily_steps ?? 10000,
        dailyCalories: res.data.dailyCalories ?? res.data.daily_calories ?? 500,
        activeMinutes: res.data.activeMinutes ?? res.data.active_minutes ?? 45,
        water: res.data.water ?? 2500,
      };
    } catch {
      return null;
    }
  }

  async updateGoals(goals: UserGoals): Promise<boolean> {
    try {
      await this.client.put('/goals', {
        daily_steps: goals.dailySteps,
        daily_calories: goals.dailyCalories,
        active_minutes: goals.activeMinutes,
        water: goals.water,
        dailySteps: goals.dailySteps,
        dailyCalories: goals.dailyCalories,
        activeMinutes: goals.activeMinutes,
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Workouts ---
  async getWorkouts(): Promise<WorkoutSession[]> {
    try {
      const res = await this.client.get('/workouts');
      if (!Array.isArray(res.data)) return [];
      return res.data.map((w: any) => ({
        id: String(w.id),
        userId: w.userId ?? w.user_id,
        type: w.type,
        startTime: w.startTime ?? (typeof w.start_time === 'string' ? w.start_time : new Date(w.start_time || Date.now()).toISOString()),
        endTime: w.endTime ?? (typeof w.end_time === 'string' ? w.end_time : new Date(w.end_time || Date.now()).toISOString()),
        durationSeconds: w.durationSeconds ?? w.duration_seconds ?? 0,
        distance: w.distance,
        calories: w.calories ?? 0,
        createdAt: w.createdAt ?? (typeof w.created_at === 'string' ? w.created_at : new Date(w.created_at || Date.now()).toISOString()),
        isSynced: true,
      }));
    } catch {
      return [];
    }
  }

  async createWorkout(workout: WorkoutSession): Promise<boolean> {
    try {
      await this.client.post('/workouts', {
        id: workout.id,
        type: workout.type,
        start_time: workout.startTime,
        end_time: workout.endTime,
        duration_seconds: workout.durationSeconds,
        distance: workout.distance,
        calories: workout.calories,
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteWorkout(id: string): Promise<boolean> {
    try {
      await this.client.delete(`/workouts/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  // --- Activity Sync ---
  /**
   * Synchronizes daily activity summary with backend.
   * If backend is offline, pushes summary into local offline queue.
   */
  async syncActivity(summary: ActivitySummary): Promise<boolean> {
    try {
      await this.client.post('/activity/sync', {
        date: summary.date,
        steps: summary.steps,
        distance: summary.distance,
        calories: summary.calories,
        active_minutes: summary.activeMinutes,
        activeMinutes: summary.activeMinutes,
      });
      await StorageService.setLastSyncTime(new Date().toISOString());
      return true;
    } catch {
      console.log('ApiService: Backend sync unavailable, queuing locally');
      await StorageService.addToOfflineQueue(summary);
      return false;
    }
  }

  /**
   * Flushes all pending offline activity summaries to the backend.
   */
  async processOfflineQueue(): Promise<{ synced: number; failed: number }> {
    const queue = await StorageService.getOfflineQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;
    const remainingQueue: ActivitySummary[] = [];

    for (const item of queue) {
      try {
        await this.client.post('/activity/sync', {
          date: item.date,
          steps: item.steps,
          distance: item.distance,
          calories: item.calories,
          active_minutes: item.activeMinutes,
        });
        synced++;
      } catch {
        failed++;
        remainingQueue.push(item);
      }
    }

    if (synced > 0) {
      await StorageService.setLastSyncTime(new Date().toISOString());
    }

    if (failed === 0) {
      await StorageService.clearOfflineQueue();
    } else {
      // Retain failed items in queue
      await StorageService.clearOfflineQueue();
      for (const item of remainingQueue) {
        await StorageService.addToOfflineQueue(item);
      }
    }

    return { synced, failed };
  }

  /**
   * Get sync status metadata.
   */
  async getSyncState(): Promise<SyncState> {
    const lastSyncTime = await StorageService.getLastSyncTime();
    const queue = await StorageService.getOfflineQueue();
    const isOnline = await this.checkBackendHealth();

    return {
      lastSyncTime,
      isSyncing: false,
      pendingCount: queue.length,
      error: null,
      isOffline: !isOnline,
    };
  }
}

export const ApiService = new ApiServiceClass();
