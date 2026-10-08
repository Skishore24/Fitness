/**
 * FitTrack Auth Store (Zustand)
 */
import { create } from 'zustand';
import { UserProfile } from '../types';
import { AuthService } from '../services/auth/AuthService';
import { StorageService } from '../services/storage/StorageService';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;

  // Actions
  initAuth: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isRestoring: true,
  error: null,

  initAuth: async () => {
    try {
      set({ isRestoring: true, error: null });
      const user = await AuthService.getCurrentUser();
      set({ user, isRestoring: false });
    } catch (e: any) {
      set({ isRestoring: false, error: e?.message || 'Failed to restore session' });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await AuthService.signInWithGoogle();
      set({ user, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || 'Google Sign-In failed' });
      throw e;
    }
  },

  signInWithEmail: async (email, pass) => {
    try {
      set({ isLoading: true, error: null });
      const user = await AuthService.signInWithEmail(email, pass);
      set({ user, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || 'Email Sign-In failed' });
      throw e;
    }
  },

  signUpWithEmail: async (email, pass, name) => {
    try {
      set({ isLoading: true, error: null });
      const user = await AuthService.signUpWithEmail(email, pass, name);
      set({ user, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || 'Sign-Up failed' });
      throw e;
    }
  },

  signInAsGuest: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await AuthService.signInAsGuest();
      set({ user, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || 'Guest login failed' });
    }
  },

  updateProfile: async (partial) => {
    const current = get().user;
    if (!current) return;
    const updated: UserProfile = { ...current, ...partial };
    await StorageService.saveUserProfile(updated);
    set({ user: updated });
  },

  signOut: async () => {
    set({ isLoading: true });
    await AuthService.signOut();
    set({ user: null, isLoading: false });
  },

  clearError: () => set({ error: null }),
}));
