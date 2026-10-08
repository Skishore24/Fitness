/**
 * Onboarding Screen 9: Daily Step Goal
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';

interface DailyStepGoalScreenProps {
  initialGoal?: number;
  onNext: (stepGoal: number) => void;
  onBack: () => void;
}

const PRESET_GOALS = [6000, 8000, 10000, 12000, 15000];

export const DailyStepGoalScreen: React.FC<DailyStepGoalScreenProps> = ({
  initialGoal = 10000,
  onNext,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [stepGoal, setStepGoal] = useState<number>(initialGoal);

  const increment = (delta: number) => {
    setStepGoal((prev) => Math.max(1000, Math.min(50000, prev + delta)));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>9 of 10</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Daily step target?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          World Health Organization recommends at least 8,000–10,000 steps daily for longevity and vitality.
        </Text>

        <View style={styles.displayContainer}>
          <View style={[styles.displayBox, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <Text style={[styles.stepsValue, { color: colors.primary }]}>
              {stepGoal.toLocaleString()}
            </Text>
            <Text style={[styles.stepsUnit, { color: colors.textSecondary }]}>steps / day</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(-1000)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>-1,000</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(-500)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>-500</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(500)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>+500</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(1000)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>+1,000</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.presetsRow}>
            {PRESET_GOALS.map((preset) => {
              const isSelected = stepGoal === preset;
              return (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: isSelected ? `${colors.primary}25` : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setStepGoal(preset)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.presetText,
                      { color: isSelected ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {preset / 1000}k
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={() => onNext(stepGoal)}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 12,
  },
  displayContainer: {
    alignItems: 'center',
    width: '100%',
  },
  displayBox: {
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 20,
    borderRadius: 28,
    borderWidth: 2,
    marginBottom: 24,
    width: '100%',
  },
  stepsValue: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  stepsUnit: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  stepperButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 14,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  presetChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
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
