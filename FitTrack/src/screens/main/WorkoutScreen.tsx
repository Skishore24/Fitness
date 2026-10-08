/**
 * FitTrack Workout Screen
 * Handles Workout Selection, Active Session (Timer, Pause/Resume, Distance, Calories),
 * Workout Completion summary, and Workout History list.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { useWorkoutStore } from '../../store/WorkoutStore';
import { WorkoutCard } from '../../components/fitness/WorkoutCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Icon, IconName } from '../../components/common/Icon';
import { WorkoutType, WorkoutSession } from '../../types';

const WORKOUT_TYPES: { type: WorkoutType; title: string; desc: string; icon: IconName; color: string }[] = [
  { type: 'Walking', title: 'Outdoor / Indoor Walk', desc: 'Step pacing & distance', icon: 'walking', color: '#00E5FF' },
  { type: 'Running', title: 'Running & Jogging', desc: 'Cardio endurance & speed', icon: 'running', color: '#FF6D00' },
  { type: 'Cycling', title: 'Cycling', desc: 'Bike tracking & cadence', icon: 'cycling', color: '#00E676' },
  { type: 'Strength Training', title: 'Strength & Weights', desc: 'Resistance & muscle building', icon: 'strength', color: '#7C4DFF' },
  { type: 'HIIT', title: 'High Intensity Intervals', desc: 'Peak metabolic burn', icon: 'hiit', color: '#FF5252' },
  { type: 'Yoga', title: 'Yoga & Mobility', desc: 'Flexibility & mindfulness', icon: 'yoga', color: '#40C4FF' },
];

export const WorkoutScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const {
    workouts,
    activeWorkout,
    loadWorkouts,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    tickTimer,
    finishWorkout,
    cancelWorkout,
    deleteWorkout,
  } = useWorkoutStore();

  const [completedSummary, setCompletedSummary] = useState<WorkoutSession | null>(null);

  // Active workout timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeWorkout && activeWorkout.status === 'ACTIVE') {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeWorkout, tickTimer]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    const summary = await finishWorkout();
    if (summary) {
      setCompletedSummary(summary);
    }
  };

  const handleCancelPrompt = () => {
    Alert.alert(
      'Cancel Workout?',
      'Are you sure you want to discard this workout session?',
      [
        { text: 'Keep Going', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: cancelWorkout },
      ]
    );
  };

  // --- 1. RENDER ACTIVE / PAUSED WORKOUT VIEW ---
  if (activeWorkout) {
    const activeCfg = WORKOUT_TYPES.find((w) => w.type === activeWorkout.type);
    const accentColor = activeCfg?.color || colors.primary;

    return (
      <View style={[styles.activeContainer, { backgroundColor: colors.background }]}>
        <View style={styles.activeHeader}>
          <TouchableOpacity onPress={handleCancelPrompt} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: colors.error }]}>Discard</Text>
          </TouchableOpacity>
          <View style={[styles.activeBadge, { backgroundColor: `${accentColor}20` }]}>
            <Text style={[styles.activeBadgeText, { color: accentColor }]}>
              {activeWorkout.status}
            </Text>
          </View>
        </View>

        <View style={styles.activeCenter}>
          <View style={[styles.bigIconCircle, { backgroundColor: `${accentColor}18`, borderColor: accentColor }]}>
            <Icon name={activeCfg?.icon || 'workout'} size={48} color={accentColor} />
          </View>

          <Text style={[styles.activeWorkoutTitle, { color: colors.textPrimary }]}>
            {activeWorkout.type}
          </Text>

          {/* Large Live Timer */}
          <Text style={[styles.activeTimerText, { color: colors.textPrimary }]}>
            {formatTimer(activeWorkout.durationSeconds)}
          </Text>

          {/* Metric Tiles */}
          <View style={styles.activeMetricsRow}>
            <View style={[styles.activeMetricTile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name="flame" size={20} color={colors.accentFlame} />
              <Text style={[styles.activeMetricVal, { color: colors.textPrimary }]}>
                {activeWorkout.caloriesBurned}
              </Text>
              <Text style={[styles.activeMetricUnit, { color: colors.textMuted }]}>kcal burned</Text>
            </View>

            {activeWorkout.type === 'Walking' ||
            activeWorkout.type === 'Running' ||
            activeWorkout.type === 'Cycling' ? (
              <View style={[styles.activeMetricTile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Icon name="distance" size={20} color={colors.primary} />
                <Text style={[styles.activeMetricVal, { color: colors.textPrimary }]}>
                  {activeWorkout.distanceKm.toFixed(2)}
                </Text>
                <Text style={[styles.activeMetricUnit, { color: colors.textMuted }]}>km distance</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Live Controls */}
        <View style={styles.activeControls}>
          {activeWorkout.status === 'ACTIVE' ? (
            <TouchableOpacity
              style={[styles.pauseBtn, { backgroundColor: colors.warning }]}
              onPress={pauseWorkout}
              activeOpacity={0.8}
            >
              <Icon name="pause" size={24} color="#000000" />
              <Text style={styles.btnTextBlack}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.resumeBtn, { backgroundColor: colors.secondary }]}
              onPress={resumeWorkout}
              activeOpacity={0.8}
            >
              <Icon name="play" size={24} color="#000000" />
              <Text style={styles.btnTextBlack}>Resume</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.finishBtn, { backgroundColor: colors.primary }]}
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <Icon name="stop" size={24} color="#000000" />
            <Text style={styles.btnTextBlack}>Finish Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- 2. RENDER WORKOUT COMPLETION SCREEN ---
  if (completedSummary) {
    return (
      <View style={[styles.activeContainer, { backgroundColor: colors.background }]}>
        <View style={styles.activeCenter}>
          <View style={[styles.bigIconCircle, { backgroundColor: `${colors.secondary}20`, borderColor: colors.secondary }]}>
            <Icon name="trophy" size={54} color={colors.secondary} />
          </View>

          <Text style={[styles.activeWorkoutTitle, { color: colors.textPrimary }]}>
            Workout Completed! 🎉
          </Text>
          <Text style={[styles.completedSub, { color: colors.textSecondary }]}>
            {completedSummary.type} session saved locally & ready for sync.
          </Text>

          <View style={[styles.summaryBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>DURATION</Text>
              <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>
                {formatTimer(completedSummary.durationSeconds)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>CALORIES</Text>
              <Text style={[styles.summaryVal, { color: colors.accentFlame }]}>
                {completedSummary.calories} kcal
              </Text>
            </View>

            {completedSummary.distance ? (
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>DISTANCE</Text>
                <Text style={[styles.summaryVal, { color: colors.primary }]}>
                  {completedSummary.distance} km
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.activeControls}>
          <TouchableOpacity
            style={[styles.finishBtn, { backgroundColor: colors.primary }]}
            onPress={() => setCompletedSummary(null)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTextBlack}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- 3. RENDER WORKOUT SELECTION & HISTORY LIST ---
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Workouts</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Workout Launchers Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Start a Workout</Text>
        </View>

        <View style={styles.workoutGrid}>
          {WORKOUT_TYPES.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[styles.launcherCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => startWorkout(item.type)}
              activeOpacity={0.8}
            >
              <View style={[styles.launcherIcon, { backgroundColor: `${item.color}18` }]}>
                <Icon name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={[styles.launcherTitle, { color: colors.textPrimary }]}>{item.type}</Text>
              <Text style={[styles.launcherDesc, { color: colors.textMuted }]}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Workout History */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Workout History</Text>
        </View>

        {workouts.length === 0 ? (
          <EmptyState
            icon="workout"
            title="No Workouts Yet"
            subtitle="Start your first walking, running, or strength session above!"
          />
        ) : (
          workouts.map((w) => (
            <WorkoutCard
              key={w.id}
              workout={w}
              onDelete={() => {
                Alert.alert('Delete Workout', 'Remove this workout record?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteWorkout(w.id) },
                ]);
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  launcherCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  launcherIcon: {
    padding: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  launcherTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  launcherDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  // Active workout styles
  activeContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 48,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  activeCenter: {
    alignItems: 'center',
  },
  bigIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activeWorkoutTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  activeTimerText: {
    fontSize: 60,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 28,
  },
  activeMetricsRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  activeMetricTile: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  activeMetricVal: {
    fontSize: 24,
    fontWeight: '800',
  },
  activeMetricUnit: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  pauseBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
  },
  resumeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
  },
  finishBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
  },
  btnTextBlack: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  completedSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  summaryBox: {
    width: '100%',
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: '800',
  },
});
