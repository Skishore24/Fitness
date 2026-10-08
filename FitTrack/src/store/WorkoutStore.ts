/**
 * FitTrack Workout Store (Zustand)
 * Manages active workout session states (Timer, Pause/Resume, Calorie estimation) and workout history.
 */
import { create } from 'zustand';
import { WorkoutSession, WorkoutType } from '../types';
import { StorageService } from '../services/storage/StorageService';
import { ApiService } from '../services/api/ApiService';

export type WorkoutStateStatus = 'IDLE' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

interface ActiveWorkout {
  type: WorkoutType;
  startTime: string;
  durationSeconds: number;
  distanceKm: number;
  caloriesBurned: number;
  status: WorkoutStateStatus;
}

interface WorkoutStoreState {
  workouts: WorkoutSession[];
  activeWorkout: ActiveWorkout | null;
  isLoading: boolean;

  // Actions
  loadWorkouts: () => Promise<void>;
  startWorkout: (type: WorkoutType) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  tickTimer: () => void;
  updateDistance: (distanceKm: number) => void;
  finishWorkout: () => Promise<WorkoutSession | null>;
  cancelWorkout: () => void;
  deleteWorkout: (id: string) => Promise<void>;
}

// Calorie burn rate estimates per minute by workout type
const CALORIE_MET_RATES: Record<WorkoutType, number> = {
  Walking: 4.5,
  Running: 11.5,
  Cycling: 8.0,
  'Strength Training': 6.0,
  HIIT: 12.0,
  Yoga: 3.5,
};

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  workouts: [],
  activeWorkout: null,
  isLoading: true,

  loadWorkouts: async () => {
    try {
      const stored = await StorageService.getWorkouts();
      set({ workouts: stored, isLoading: false });
      // Background fetch from backend if online
      const remote = await ApiService.getWorkouts();
      if (remote && remote.length > 0) {
        set({ workouts: remote });
      }
    } catch {
      set({ workouts: [], isLoading: false });
    }
  },

  startWorkout: (type: WorkoutType) => {
    set({
      activeWorkout: {
        type,
        startTime: new Date().toISOString(),
        durationSeconds: 0,
        distanceKm: 0,
        caloriesBurned: 0,
        status: 'ACTIVE',
      },
    });
  },

  pauseWorkout: () => {
    const current = get().activeWorkout;
    if (current && current.status === 'ACTIVE') {
      set({ activeWorkout: { ...current, status: 'PAUSED' } });
    }
  },

  resumeWorkout: () => {
    const current = get().activeWorkout;
    if (current && current.status === 'PAUSED') {
      set({ activeWorkout: { ...current, status: 'ACTIVE' } });
    }
  },

  tickTimer: () => {
    const current = get().activeWorkout;
    if (!current || current.status !== 'ACTIVE') return;

    const newDuration = current.durationSeconds + 1;
    const ratePerSec = CALORIE_MET_RATES[current.type] / 60;
    const newCalories = Math.round(newDuration * ratePerSec);

    // Rough distance estimation for outdoor walking/running/cycling if GPS is off
    let newDist = current.distanceKm;
    if (current.type === 'Running') {
      newDist = parseFloat(((newDuration * 3.0) / 1000).toFixed(2)); // ~10.8 km/h
    } else if (current.type === 'Walking') {
      newDist = parseFloat(((newDuration * 1.3) / 1000).toFixed(2)); // ~4.7 km/h
    } else if (current.type === 'Cycling') {
      newDist = parseFloat(((newDuration * 5.5) / 1000).toFixed(2)); // ~20 km/h
    }

    set({
      activeWorkout: {
        ...current,
        durationSeconds: newDuration,
        caloriesBurned: newCalories,
        distanceKm: newDist,
      },
    });
  },

  updateDistance: (distanceKm: number) => {
    const current = get().activeWorkout;
    if (current) {
      set({ activeWorkout: { ...current, distanceKm } });
    }
  },

  finishWorkout: async () => {
    const current = get().activeWorkout;
    if (!current) return null;

    const session: WorkoutSession = {
      id: `w_${Date.now()}`,
      type: current.type,
      startTime: current.startTime,
      endTime: new Date().toISOString(),
      durationSeconds: current.durationSeconds,
      distance: current.distanceKm > 0 ? current.distanceKm : undefined,
      calories: current.caloriesBurned,
      createdAt: new Date().toISOString(),
    };

    // Save locally
    await StorageService.saveWorkout(session);

    // Update state
    set((state) => ({
      workouts: [session, ...state.workouts],
      activeWorkout: null,
    }));

    // Sync to backend non-blocking
    ApiService.createWorkout(session);

    return session;
  },

  cancelWorkout: () => {
    set({ activeWorkout: null });
  },

  deleteWorkout: async (id: string) => {
    await StorageService.deleteWorkout(id);
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
    ApiService.deleteWorkout(id);
  },
}));
