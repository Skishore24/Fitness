/**
 * Onboarding Screen 8: Activity Level
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';
import { ActivityLevel } from '../../types';

interface ActivityLevelScreenProps {
  initialLevel?: ActivityLevel;
  onNext: (level: ActivityLevel) => void;
  onBack: () => void;
}

interface LevelOption {
  key: ActivityLevel;
  title: string;
  desc: string;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    key: 'Sedentary',
    title: 'Sedentary',
    desc: 'Desk job, little to no deliberate physical exercise.',
  },
  {
    key: 'Lightly Active',
    title: 'Lightly Active',
    desc: 'Light exercise or active walking 1 to 3 days a week.',
  },
  {
    key: 'Moderately Active',
    title: 'Moderately Active',
    desc: 'Moderate workouts or cardio 3 to 5 days a week.',
  },
  {
    key: 'Very Active',
    title: 'Very Active',
    desc: 'Intense athletic training, running, or sports 6 to 7 days a week.',
  },
];

export const ActivityLevelScreen: React.FC<ActivityLevelScreenProps> = ({
  initialLevel = 'Moderately Active',
  onNext,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [selectedLevel, setSelectedLevel] = useState<ActivityLevel>(initialLevel);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>8 of 10</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Current activity level?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Helps calibrate your target daily active minutes and calorie expenditure.
        </Text>

        <View style={styles.list}>
          {LEVEL_OPTIONS.map((item) => {
            const isSelected = selectedLevel === item.key;
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
                onPress={() => setSelectedLevel(item.key)}
                activeOpacity={0.8}
              >
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.levelTitle,
                      { color: isSelected ? colors.primary : colors.textPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.levelDesc, { color: colors.textSecondary }]}>
                    {item.desc}
                  </Text>
                </View>
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
          onPress={() => onNext(selectedLevel)}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 12,
    lineHeight: 17,
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
