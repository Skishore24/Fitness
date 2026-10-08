/**
 * FitTrack Goals Store (Zustand)
 */
import { create } from 'zustand';
import { UserGoals } from '../types';
import { StorageService, DEFAULT_GOALS } from '../services/storage/StorageService';
import { ApiService } from '../services/api/ApiService';

interface GoalState {
  goals: UserGoals;
  isLoading: boolean;

  loadGoals: () => Promise<void>;
  updateGoals: (partial: Partial<UserGoals>) => Promise<void>;
  calculateProgress: (current: number, target: number) => number;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: DEFAULT_GOALS,
  isLoading: true,

  loadGoals: async () => {
    try {
      const stored = await StorageService.getGoals();
      set({ goals: stored, isLoading: false });
    } catch {
      set({ goals: DEFAULT_GOALS, isLoading: false });
    }
  },

  updateGoals: async (partial) => {
    const current = get().goals;
    const updated: UserGoals = { ...current, ...partial };
    set({ goals: updated });
    await StorageService.saveGoals(updated);
    // Non-blocking sync to backend
    ApiService.updateGoals(updated);
  },

  /**
   * Calculates progress percentage, clamped between 0 and 100 for visual bars.
   */
  calculateProgress: (current: number, target: number): number => {
    if (!target || target <= 0) return 0;
    const ratio = (current / target) * 100;
    return Math.min(100, Math.max(0, Math.round(ratio)));
  },
}));
