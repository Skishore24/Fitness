/**
 * Onboarding Screen 6: Weight
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';

interface ProfileWeightScreenProps {
  initialWeight?: number;
  onNext: (weightKg: number) => void;
  onBack: () => void;
}

export const ProfileWeightScreen: React.FC<ProfileWeightScreenProps> = ({
  initialWeight = 70,
  onNext,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [weight, setWeight] = useState<number>(initialWeight);

  const increment = (delta: number) => {
    setWeight((prev) => Math.max(30, Math.min(250, prev + delta)));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>6 of 10</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>What is your weight?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Weight is used in real-time calorie estimation during workouts and daily activity.
        </Text>

        <View style={styles.weightPickerWrapper}>
          <View style={[styles.displayBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.weightValue, { color: colors.accentFlame }]}>{weight}</Text>
            <Text style={[styles.weightUnit, { color: colors.textSecondary }]}>kg</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(-5)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>-5</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(-1)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(1)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>+1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.stepperButton, { backgroundColor: colors.surfaceLight }]}
              onPress={() => increment(5)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, { color: colors.textPrimary }]}>+5</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.hintText, { color: colors.textMuted }]}>
            Approx. {Math.round(weight * 2.20462)} lbs
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={() => onNext(weight)}
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
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  weightPickerWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  displayBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 36,
    paddingVertical: 20,
    borderRadius: 28,
    borderWidth: 2,
    marginBottom: 24,
  },
  weightValue: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -1,
  },
  weightUnit: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  stepperButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    minWidth: 54,
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 16,
    fontWeight: '700',
  },
  hintText: {
    fontSize: 13,
    fontWeight: '500',
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
