/**
 * FitTrack Theme Store (Zustand)
 */
import { create } from 'zustand';
import { ThemeMode } from '../types';
import { StorageService } from '../services/storage/StorageService';
import { createTheme, AppTheme } from '../theme';

interface ThemeStoreState {
  mode: ThemeMode;
  theme: AppTheme;
  initTheme: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  mode: 'dark',
  theme: createTheme(true),

  initTheme: async () => {
    const saved = await StorageService.getThemeMode();
    const isDark = saved === 'dark';
    set({
      mode: saved,
      theme: createTheme(isDark),
    });
  },

  setThemeMode: async (mode: ThemeMode) => {
    const isDark = mode === 'dark';
    await StorageService.saveThemeMode(mode);
    set({
      mode,
      theme: createTheme(isDark),
    });
  },

  toggleTheme: async () => {
    const current = get().mode;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    await get().setThemeMode(next);
  },
}));
