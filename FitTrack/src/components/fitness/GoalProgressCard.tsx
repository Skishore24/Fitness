/**
 * GoalProgressCard Component
 * Displays a single goal (Steps, Calories, Active Minutes, Water)
 * with dynamic progress bar capped visually at 100%.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon, IconName } from '../common/Icon';

interface GoalProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: IconName;
  accentColor: string;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  title,
  current,
  target,
  unit,
  icon,
  accentColor,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const rawPercent = target > 0 ? Math.round((current / target) * 100) : 0;
  // Clamped at 100% for the visual bar
  const visualPercent = Math.min(100, Math.max(0, rawPercent));

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrapper, { backgroundColor: `${accentColor}18` }]}>
            <Icon name={icon} size={18} color={accentColor} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        </View>
        <Text style={[styles.percentage, { color: accentColor }]}>{rawPercent}%</Text>
      </View>

      {/* Progress Bar Container */}
      <View style={[styles.barBackground, { backgroundColor: colors.surfaceLight }]}>
        <View
          style={[
            styles.barFill,
            {
              backgroundColor: accentColor,
              width: `${visualPercent}%`,
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.valueText, { color: colors.textSecondary }]}>
          <Text style={[styles.boldCurrent, { color: colors.textPrimary }]}>
            {current.toLocaleString()}
          </Text>{' '}
          / {target.toLocaleString()} {unit}
        </Text>
        <Text style={[styles.remainingText, { color: colors.textMuted }]}>
          {current >= target ? 'Done 🎉' : `${(target - current).toLocaleString()} left`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  barBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  valueText: {
    fontSize: 13,
  },
  boldCurrent: {
    fontWeight: '700',
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
