/**
 * FitTrack Activity Store (Zustand)
 * Central store for real health metrics from Health Connect and backend synchronization.
 */
import { create } from 'zustand';
import {
  ActivitySummary,
  HealthConnectStatus,
  HealthPermissionsState,
  SyncState,
} from '../types';
import { HealthConnectService } from '../services/health/HealthConnectService';
import { StorageService } from '../services/storage/StorageService';
import { ApiService } from '../services/api/ApiService';

interface ActivityState {
  today: ActivitySummary;
  weekly: ActivitySummary[];
  monthly: ActivitySummary[];
  healthStatus: HealthConnectStatus;
  permissions: HealthPermissionsState;
  isLoading: boolean;
  isRefreshing: boolean;
  syncState: SyncState;

  // Actions
  initActivity: () => Promise<void>;
  checkHealthStatus: () => Promise<HealthConnectStatus>;
  checkPermissions: () => Promise<HealthPermissionsState>;
  requestPermissions: () => Promise<HealthPermissionsState>;
  openHealthSettings: () => void;
  loadTodayActivity: () => Promise<void>;
  loadWeeklyActivity: () => Promise<void>;
  loadMonthlyActivity: () => Promise<void>;
  refreshAll: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

const DEFAULT_TODAY: ActivitySummary = {
  date: new Date().toISOString().split('T')[0],
  steps: 0,
  distance: 0,
  calories: 0,
  activeMinutes: 0,
};

const DEFAULT_PERMISSIONS: HealthPermissionsState = {
  stepsGranted: false,
  distanceGranted: false,
  caloriesGranted: false,
  exerciseGranted: false,
  allGranted: false,
};

export const useActivityStore = create<ActivityState>((set, get) => ({
  today: DEFAULT_TODAY,
  weekly: [],
  monthly: [],
  healthStatus: 'UNAVAILABLE',
  permissions: DEFAULT_PERMISSIONS,
  isLoading: true,
  isRefreshing: false,
  syncState: {
    lastSyncTime: null,
    isSyncing: false,
    pendingCount: 0,
    error: null,
    isOffline: false,
  },

  initActivity: async () => {
    try {
      set({ isLoading: true });

      // 1. Immediately restore cached data for instant offline launch
      const cachedToday = await StorageService.getTodayActivity();
      const cachedHistory = await StorageService.getActivityHistory();
      const cachedPerms = await StorageService.getCachedHealthPermissions();
      const syncStatus = await ApiService.getSyncState();

      if (cachedToday) set({ today: cachedToday });
      if (cachedHistory.length > 0) set({ weekly: cachedHistory.slice(0, 7) });
      if (cachedPerms) set({ permissions: cachedPerms });
      set({ syncState: syncStatus });

      // 2. Check real Health Connect availability and permissions
      const status = await HealthConnectService.isHealthConnectAvailable();
      set({ healthStatus: status });

      if (status === 'AVAILABLE') {
        const perms = await HealthConnectService.checkPermissions();
        set({ permissions: perms });

        if (perms.stepsGranted) {
          // Fetch real data from Health Connect
          const realToday = await HealthConnectService.getTodaySummary();
          set({ today: realToday });
          // Background load weekly
          get().loadWeeklyActivity();
        }
      }

      set({ isLoading: false });
    } catch (e) {
      console.warn('ActivityStore: initActivity error', e);
      set({ isLoading: false });
    }
  },

  checkHealthStatus: async () => {
    const status = await HealthConnectService.isHealthConnectAvailable();
    set({ healthStatus: status });
    return status;
  },

  checkPermissions: async () => {
    const perms = await HealthConnectService.checkPermissions();
    set({ permissions: perms });
    return perms;
  },

  requestPermissions: async () => {
    const perms = await HealthConnectService.requestPermissions();
    set({ permissions: perms });
    if (perms.stepsGranted) {
      await get().loadTodayActivity();
      await get().loadWeeklyActivity();
    }
    return perms;
  },

  openHealthSettings: () => {
    HealthConnectService.openSettings();
  },

  loadTodayActivity: async () => {
    try {
      const summary = await HealthConnectService.getTodaySummary();
      set({ today: summary });
      // Non-blocking sync to backend if online
      ApiService.syncActivity(summary);
    } catch (e) {
      console.warn('ActivityStore: loadTodayActivity failed', e);
    }
  },

  loadWeeklyActivity: async () => {
    try {
      const weekly = await HealthConnectService.getWeeklySteps();
      set({ weekly });
    } catch (e) {
      console.warn('ActivityStore: loadWeeklyActivity failed', e);
    }
  },

  loadMonthlyActivity: async () => {
    try {
      const monthly = await HealthConnectService.getMonthlySteps();
      set({ monthly });
    } catch (e) {
      console.warn('ActivityStore: loadMonthlyActivity failed', e);
    }
  },

  refreshAll: async () => {
    set({ isRefreshing: true });
    try {
      const perms = await HealthConnectService.checkPermissions();
      set({ permissions: perms });

      if (perms.stepsGranted) {
        const [today, weekly] = await Promise.all([
          HealthConnectService.getTodaySummary(),
          HealthConnectService.getWeeklySteps(),
        ]);
        set({ today, weekly });
        await ApiService.syncActivity(today);
      }
      const syncStatus = await ApiService.getSyncState();
      set({ syncState: syncStatus });
    } catch (e) {
      console.warn('ActivityStore: refreshAll failed', e);
    } finally {
      set({ isRefreshing: false });
    }
  },

  syncWithBackend: async () => {
    set((state) => ({ syncState: { ...state.syncState, isSyncing: true } }));
    try {
      await ApiService.syncActivity(get().today);
      await ApiService.processOfflineQueue();
      const syncStatus = await ApiService.getSyncState();
      set({ syncState: syncStatus });
    } catch (e: any) {
      set((state) => ({
        syncState: {
          ...state.syncState,
          isSyncing: false,
          error: e?.message || 'Sync failed',
        },
      }));
    }
  },
}));
