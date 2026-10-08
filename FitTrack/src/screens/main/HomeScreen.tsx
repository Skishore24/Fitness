/**
 * FitTrack Home Screen (Dashboard)
 * Premium fitness dashboard displaying real steps, health metrics,
 * quick workout launches, and weekly trends.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { useAuthStore } from '../../store/AuthStore';
import { useActivityStore } from '../../store/ActivityStore';
import { useGoalStore } from '../../store/GoalStore';

import { StepProgressCard } from '../../components/fitness/StepProgressCard';
import { StatCard } from '../../components/fitness/StatCard';
import { HealthPermissionCard } from '../../components/fitness/HealthPermissionCard';
import { WeeklyChart } from '../../components/charts/WeeklyChart';
import { Icon } from '../../components/common/Icon';
import { WorkoutType } from '../../types';

interface HomeScreenProps {
  onNavigateToWorkouts: () => void;
  onNavigateToActivity: () => void;
  onStartWorkout: (type: WorkoutType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToWorkouts,
  onNavigateToActivity,
  onStartWorkout,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const { user } = useAuthStore();
  const {
    today,
    weekly,
    healthStatus,
    permissions,
    isLoading,
    isRefreshing,
    syncState,
    refreshAll,
    requestPermissions,
    openHealthSettings,
    syncWithBackend,
  } = useActivityStore();

  const { goals } = useGoalStore();

  // Greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon ⚡';
    return 'Good Evening 🌙';
  };

  const getSyncLabel = () => {
    if (syncState.isSyncing) return 'Syncing...';
    if (syncState.isOffline) return 'Offline Mode';
    if (!syncState.lastSyncTime) return 'Tap to Sync';
    try {
      const diffMin = Math.round(
        (Date.now() - new Date(syncState.lastSyncTime).getTime()) / (1000 * 60)
      );
      if (diffMin <= 1) return 'Synced just now';
      return `Synced ${diffMin}m ago`;
    } catch {
      return 'Synced';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {user?.name || 'Athlete'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Sync Pill */}
          <TouchableOpacity
            style={[
              styles.syncPill,
              {
                backgroundColor: syncState.isOffline ? `${colors.warning}18` : `${colors.primary}18`,
                borderColor: syncState.isOffline ? `${colors.warning}50` : `${colors.primary}50`,
              },
            ]}
            onPress={syncWithBackend}
            activeOpacity={0.7}
          >
            <Icon
              name={syncState.isOffline ? 'cloud-offline' : 'cloud-done'}
              size={12}
              color={syncState.isOffline ? colors.warning : colors.primary}
            />
            <Text
              style={[
                styles.syncText,
                { color: syncState.isOffline ? colors.warning : colors.primary },
              ]}
            >
              {getSyncLabel()}
            </Text>
          </TouchableOpacity>

          {/* User Profile Avatar */}
          <View style={[styles.avatarCircle, { borderColor: colors.primary }]}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
            ) : (
              <Icon name="profile" size={20} color={colors.primary} />
            )}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Health Connect Status Banner */}
        <HealthPermissionCard
          status={healthStatus}
          permissions={permissions}
          onRequestPermissions={requestPermissions}
          onOpenSettings={openHealthSettings}
        />

        {/* Real Step Progress Card */}
        <StepProgressCard
          steps={today.steps}
          goal={goals.dailySteps}
          isLoading={isLoading}
        />

        {/* 3 Metric Stat Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Calories"
            value={today.calories.toLocaleString()}
            unit="kcal"
            icon="flame"
            accentColor={colors.accentFlame}
            subtitle={`Goal: ${goals.dailyCalories} kcal`}
            isLoading={isLoading}
          />
          <StatCard
            title="Distance"
            value={today.distance.toFixed(1)}
            unit="km"
            icon="distance"
            accentColor={colors.primary}
            subtitle="Walk & Run"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Time"
            value={today.activeMinutes}
            unit="min"
            icon="clock"
            accentColor={colors.secondary}
            subtitle={`Goal: ${goals.activeMinutes}m`}
            isLoading={isLoading}
          />
        </View>

        {/* Quick Workout Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Workouts</Text>
          <TouchableOpacity onPress={onNavigateToWorkouts}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>All Sessions →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickWorkoutsRow}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onStartWorkout('Walking')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIcon, { backgroundColor: `${colors.primary}20` }]}>
              <Icon name="walking" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.quickTitle, { color: colors.textPrimary }]}>Walk</Text>
            <Text style={[styles.quickSub, { color: colors.textMuted }]}>Start now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onStartWorkout('Running')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIcon, { backgroundColor: `${colors.accentFlame}20` }]}>
              <Icon name="running" size={22} color={colors.accentFlame} />
            </View>
            <Text style={[styles.quickTitle, { color: colors.textPrimary }]}>Run</Text>
            <Text style={[styles.quickSub, { color: colors.textMuted }]}>Track GPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onStartWorkout('Cycling')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIcon, { backgroundColor: `${colors.secondary}20` }]}>
              <Icon name="cycling" size={22} color={colors.secondary} />
            </View>
            <Text style={[styles.quickTitle, { color: colors.textPrimary }]}>Cycle</Text>
            <Text style={[styles.quickSub, { color: colors.textMuted }]}>Outdoor/Indoor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onStartWorkout('Strength Training')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIcon, { backgroundColor: `${colors.accentPurple}20` }]}>
              <Icon name="strength" size={22} color={colors.accentPurple} />
            </View>
            <Text style={[styles.quickTitle, { color: colors.textPrimary }]}>Strength</Text>
            <Text style={[styles.quickSub, { color: colors.textMuted }]}>Weights</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Weekly Progress Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>7-Day Trends</Text>
          <TouchableOpacity onPress={onNavigateToActivity}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>Details →</Text>
          </TouchableOpacity>
        </View>

        <WeeklyChart data={weekly.length > 0 ? weekly : [today]} goal={goals.dailySteps} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 48,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  syncText: {
    fontSize: 10,
    fontWeight: '700',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickWorkoutsRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 12,
  },
  quickCard: {
    width: 105,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickIcon: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickSub: {
    fontSize: 10,
    marginTop: 2,
  },
});
