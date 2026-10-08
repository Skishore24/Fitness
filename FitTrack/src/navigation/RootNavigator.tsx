/**
 * FitTrack Root Navigator & Main Tab Navigator
 * Orchestrates Splash -> Auth -> Onboarding -> Main Tab Navigation flows.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../store/ThemeStore';
import { useAuthStore } from '../store/AuthStore';
import { useWorkoutStore } from '../store/WorkoutStore';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { OnboardingFlowScreen } from '../screens/onboarding/OnboardingFlowScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ActivityScreen } from '../screens/main/ActivityScreen';
import { WorkoutScreen } from '../screens/main/WorkoutScreen';
import { GoalsScreen } from '../screens/main/GoalsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { LoadingState } from '../components/common/LoadingState';
import { Icon, IconName } from '../components/common/Icon';
import { WorkoutType } from '../types';

export type MainTab = 'Home' | 'Activity' | 'Workout' | 'Goals' | 'Profile';

export const RootNavigator: React.FC = () => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const { user, isRestoring, updateProfile } = useAuthStore();
  const { startWorkout } = useWorkoutStore();

  const [activeTab, setActiveTab] = useState<MainTab>('Home');
  const [onboardingFinished, setOnboardingFinished] = useState(false);

  // 1. Splash / Restoring Authentication State
  if (isRestoring) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.splashLogo, { backgroundColor: `${colors.primary}20` }]}>
          <Icon name="steps" size={60} color={colors.primary} />
        </View>
        <Text style={[styles.splashTitle, { color: colors.primary }]}>FITTRACK</Text>
        <LoadingState message="Restoring fitness data..." />
      </View>
    );
  }

  // 2. Authentication Flow (No logged-in user)
  if (!user || !user.firebaseUid) {
    return <LoginScreen onLoginSuccess={() => {}} />;
  }

  // 3. Onboarding Flow (User logged in but first run not finished)
  if (!user.onboardingCompleted && !onboardingFinished) {
    return (
      <OnboardingFlowScreen
        onFinish={async () => {
          await updateProfile({ onboardingCompleted: true });
          setOnboardingFinished(true);
        }}
      />
    );
  }

  // 4. Main App Tab Navigator
  const tabs: { key: MainTab; label: string; icon: IconName }[] = [
    { key: 'Home', label: 'Home', icon: 'home' },
    { key: 'Activity', label: 'Activity', icon: 'activity' },
    { key: 'Workout', label: 'Workout', icon: 'workout' },
    { key: 'Goals', label: 'Goals', icon: 'trophy' },
    { key: 'Profile', label: 'Profile', icon: 'profile' },
  ];

  const handleStartWorkoutFromHome = (type: WorkoutType) => {
    startWorkout(type);
    setActiveTab('Workout');
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      {/* Tab Screen Content */}
      <View style={styles.tabContent}>
        {activeTab === 'Home' && (
          <HomeScreen
            onNavigateToWorkouts={() => setActiveTab('Workout')}
            onNavigateToActivity={() => setActiveTab('Activity')}
            onStartWorkout={handleStartWorkoutFromHome}
          />
        )}
        {activeTab === 'Activity' && <ActivityScreen />}
        {activeTab === 'Workout' && <WorkoutScreen />}
        {activeTab === 'Goals' && <GoalsScreen />}
        {activeTab === 'Profile' && <ProfileScreen />}
      </View>

      {/* Bottom Tab Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const activeColor = colors.primary;
          const inactiveColor = colors.textMuted;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  isActive && { backgroundColor: `${colors.primary}18` },
                ]}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  color={isActive ? activeColor : inactiveColor}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? activeColor : inactiveColor },
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashLogo: {
    padding: 24,
    borderRadius: 36,
    marginBottom: 16,
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 8,
  },
  mainContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 68 : 84,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'android' ? 6 : 20,
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});
