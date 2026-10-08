/**
 * WorkoutCard Component
 * Displays a completed workout item in history or workout list.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon, IconName } from '../common/Icon';
import { WorkoutSession, WorkoutType } from '../../types';

interface WorkoutCardProps {
  workout: WorkoutSession;
  onPress?: () => void;
  onDelete?: () => void;
}

const WORKOUT_ICONS: Record<WorkoutType, { icon: IconName; color: string }> = {
  Walking: { icon: 'walking', color: '#00E5FF' },
  Running: { icon: 'running', color: '#FF6D00' },
  Cycling: { icon: 'cycling', color: '#00E676' },
  'Strength Training': { icon: 'strength', color: '#7C4DFF' },
  HIIT: { icon: 'hiit', color: '#FF5252' },
  Yoga: { icon: 'yoga', color: '#40C4FF' },
};

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onPress,
  onDelete,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const cfg = WORKOUT_ICONS[workout.type] || { icon: 'workout', color: colors.primary };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrapper, { backgroundColor: `${cfg.color}18` }]}>
        <Icon name={cfg.icon} size={22} color={cfg.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.typeTitle, { color: colors.textPrimary }]}>{workout.type}</Text>
          <Text style={[styles.dateText, { color: colors.textMuted }]}>
            {formatDate(workout.startTime)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="clock" size={13} color={colors.textSecondary} />
            <Text style={[styles.statValue, { color: colors.textSecondary }]}>
              {formatDuration(workout.durationSeconds)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="flame" size={13} color={colors.accentFlame} />
            <Text style={[styles.statValue, { color: colors.textSecondary }]}>
              {workout.calories} kcal
            </Text>
          </View>

          {workout.distance !== undefined && workout.distance > 0 ? (
            <View style={styles.statItem}>
              <Icon name="distance" size={13} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                {workout.distance} km
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {onDelete ? (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="trash" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 14,
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 6,
  },
});
