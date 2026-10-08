/**
 * FitTrack Main Application Entry Point
 * Production-quality React Native Android Fitness Tracker
 */
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useThemeStore } from './src/store/ThemeStore';
import { useAuthStore } from './src/store/AuthStore';
import { useActivityStore } from './src/store/ActivityStore';
import { useGoalStore } from './src/store/GoalStore';
import { RootNavigator } from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  const { theme, mode, initTheme } = useThemeStore();
  const { initAuth } = useAuthStore();
  const { initActivity } = useActivityStore();
  const { loadGoals } = useGoalStore();

  useEffect(() => {
    // Bootstrap essential application stores on launch
    const bootstrap = async () => {
      await initTheme();
      await initAuth();
      await loadGoals();
      await initActivity();
    };

    bootstrap();
  }, [initActivity, initAuth, initTheme, loadGoals]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.(theme.colors.background, true);
    }
  }, [theme.colors.background]);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
