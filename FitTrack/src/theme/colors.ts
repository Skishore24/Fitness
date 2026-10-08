/**
 * FitTrack Design System Colors
 * Curated for a premium athletic dark/light aesthetic.
 */

export const darkPalette = {
  background: '#0B0E14',
  surface: '#151A22',
  surfaceLight: '#1E2530',
  surfaceLighter: '#283140',
  border: '#2A3342',
  borderLight: '#374151',

  // Brand Accents
  primary: '#00E5FF', // Cyan Glow (Active & Modern)
  primaryLight: '#6EFAFF',
  primaryDark: '#00B4D8',

  secondary: '#00E676', // Neon Green (Energy & Goal)
  accentFlame: '#FF6D00', // Neon Orange (Calories / Workouts)
  accentPurple: '#7C4DFF', // Neon Violet (Stats & Distance)
  accentPink: '#FF4081',

  // Status
  success: '#00E676',
  warning: '#FFD600',
  error: '#FF5252',
  info: '#40C4FF',

  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0B0E14',

  // Overlays & Highlights
  overlay: 'rgba(11, 14, 20, 0.75)',
  cardGlow: 'rgba(0, 229, 255, 0.12)',
};

export const lightPalette = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  surfaceLighter: '#E2E8F0',
  border: '#E2E8F0',
  borderLight: '#CBD5E1',

  // Brand Accents
  primary: '#00838F',
  primaryLight: '#00ACC1',
  primaryDark: '#006064',

  secondary: '#00A854',
  accentFlame: '#E65100',
  accentPurple: '#6200EA',
  accentPink: '#C2185B',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0284C7',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Overlays & Highlights
  overlay: 'rgba(15, 23, 42, 0.5)',
  cardGlow: 'rgba(0, 131, 143, 0.08)',
};

export type ThemeColors = typeof darkPalette;
