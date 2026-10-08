/**
 * Onboarding Screen 5: Height
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';

interface ProfileHeightScreenProps {
  initialHeight?: number;
  onNext: (heightCm: number) => void;
  onBack: () => void;
}

export const ProfileHeightScreen: React.FC<ProfileHeightScreenProps> = ({
  initialHeight = 175,
  onNext,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [height, setHeight] = useState<number>(initialHeight);

  const increment = (delta: number) => {
    setHeight((prev) => Math.max(100, Math.min(250, prev + delta)));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>5 of 10</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>What is your height?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Height helps FitTrack accurately calculate your stride length and calorie burn.
        </Text>

        <View style={styles.heightPickerWrapper}>
          <View style={[styles.displayBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.heightValue, { color: colors.primary }]}>{height}</Text>
            <Text style={[styles.heightUnit, { color: colors.textSecondary }]}>cm</Text>
          </View>

          {/* Stepper Controls */}
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
            Approx. {Math.floor(height / 30.48)} ft {Math.round((height % 30.48) / 2.54)} in
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={() => onNext(height)}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
          <Icon name="chevron-right" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  heightPickerWrapper: {
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
  heightValue: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heightUnit: {
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
