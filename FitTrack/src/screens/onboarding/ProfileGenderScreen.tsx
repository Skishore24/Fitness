/**
 * Onboarding Screen 4: Gender
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';
import { Gender } from '../../types';

interface ProfileGenderScreenProps {
  initialGender?: Gender;
  onNext: (gender: Gender) => void;
  onBack: () => void;
}

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const ProfileGenderScreen: React.FC<ProfileGenderScreenProps> = ({
  initialGender = 'Male',
  onNext,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [selectedGender, setSelectedGender] = useState<Gender>(initialGender);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>4 of 10</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Select your gender</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Biological sex is factored into basal metabolic rate (BMR) and calorie expenditure algorithms.
        </Text>

        <View style={styles.optionsList}>
          {GENDER_OPTIONS.map((option) => {
            const isSelected = selectedGender === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedGender(option)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? colors.primary : colors.textPrimary },
                  ]}
                >
                  {option}
                </Text>
                <View
                  style={[
                    styles.radio,
                    { borderColor: isSelected ? colors.primary : colors.border },
                  ]}
                >
                  {isSelected && (
                    <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={() => onNext(selectedGender)}
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
    marginBottom: 32,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
