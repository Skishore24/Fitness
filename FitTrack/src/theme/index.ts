/**
 * FitTrack Theme System & Tokens
 */
import { darkPalette, lightPalette, ThemeColors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 38,
    giant: 48,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export interface AppTheme {
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
}

export const createTheme = (isDark: boolean): AppTheme => ({
  isDark,
  colors: isDark ? darkPalette : lightPalette,
  spacing,
  borderRadius,
  typography,
});
