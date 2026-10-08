/**
 * StepProgressCard Component
 * Displays real step count with an SVG circular progress ring, goal comparison,
 * and clamped progress percentage.
 */
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../common/Icon';

interface StepProgressCardProps {
  steps: number;
  goal: number;
  isLoading?: boolean;
}

export const StepProgressCard: React.FC<StepProgressCardProps> = ({
  steps,
  goal,
  isLoading = false,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  // Clamped percentage for visual ring (0% to 100%)
  const percentage = goal > 0 ? Math.min(100, Math.max(0, Math.round((steps / goal) * 100))) : 0;
  const rawPercentage = goal > 0 ? Math.round((steps / goal) * 100) : 0;

  // SVG Circle Geometry
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBadge, { backgroundColor: `${colors.primary}20` }]}>
            <Icon name="steps" size={18} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textSecondary }]}>TODAY'S STEPS</Text>
        </View>
        <Text style={[styles.goalText, { color: colors.textMuted }]}>
          Goal: {goal.toLocaleString()}
        </Text>
      </View>

      <View style={styles.ringWrapper}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.surfaceLight}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Animated / Glow Active Ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.primary}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>

        <View style={styles.centerContent}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Text style={[styles.stepsValue, { color: colors.textPrimary }]}>
                {steps.toLocaleString()}
              </Text>
              <Text style={[styles.percentageText, { color: colors.primaryLight }]}>
                {rawPercentage}% of goal
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          {steps >= goal
            ? '🎉 Daily step goal achieved! Fantastic work!'
            : `${Math.max(0, goal - steps).toLocaleString()} steps left to reach your goal`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    padding: 6,
    borderRadius: 10,
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  goalText: {
    fontSize: 13,
    fontWeight: '600',
  },
  ringWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsValue: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
