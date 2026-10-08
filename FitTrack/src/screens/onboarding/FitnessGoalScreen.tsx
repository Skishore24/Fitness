/**
 * Onboarding Screen 7: Fitness Goal
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon, IconName } from '../../components/common/Icon';
import { FitnessGoal } from '../../types';

interface FitnessGoalScreenProps {
  initialGoal?: FitnessGoal;
  onNext: (goal: FitnessGoal) => void;
  onBack: () => void;
}

interface GoalOption {
  key: FitnessGoal;
  title: string;
  desc: string;
  icon: IconName;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    key: 'Lose Weight',
    title: 'Lose Weight',
    desc: 'Burn calories consistently & build an active daily deficit.',
    icon: 'flame',
  },
  {
    key: 'Gain Muscle',
    title: 'Gain Muscle',
    desc: 'Strength sessions, progressive resistance & muscle recovery.',
    icon: 'strength',
  },
  {
    key: 'Maintain Weight',
    title: 'Maintain Weight',
    desc: 'Keep current body weight while improving endurance & stamina.',
    icon: 'heart',
  },
  {
    key: 'Improve Fitness',
    title: 'Improve Fitness',
    desc: 'Elevate cardiovascular health, mobility, and daily activity levels.',
    icon: 'trophy',
  },
];

export const FitnessGoalScreen: React.FC<FitnessGoalScreenProps> = ({
  initialGoal = 'Improve Fitness',
  onNext,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>(initialGoal);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>7 of 10</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>What is your primary goal?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We customize your daily step and calorie milestones around this focus.
        </Text>

        <View style={styles.list}>
          {GOAL_OPTIONS.map((item) => {
            const isSelected = selectedGoal === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedGoal(item.key)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isSelected ? `${colors.primary}20` : colors.surfaceLight },
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={24}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.goalTitle,
                      { color: isSelected ? colors.primary : colors.textPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.goalDesc, { color: colors.textSecondary }]}>
                    {item.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={() => onNext(selectedGoal)}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
          <Icon name="chevron-right" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 48,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },
  list: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  iconBox: {
    padding: 12,
    borderRadius: 14,
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    width: '100%',
    paddingTop: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
