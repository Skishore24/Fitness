/**
 * Onboarding Screen 2: Name
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';

interface ProfileNameScreenProps {
  initialName?: string;
  onNext: (name: string) => void;
  onBack: () => void;
}

export const ProfileNameScreen: React.FC<ProfileNameScreenProps> = ({
  initialName = '',
  onNext,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [name, setName] = useState<string>(initialName);

  const isValid = name.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>2 of 10</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>What's your name?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We'll use this to personalize your dashboard greetings and achievements.
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: isValid ? colors.primary : colors.border,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
          autoCapitalize="words"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: isValid ? colors.primary : colors.surfaceLight },
          ]}
          onPress={() => isValid && onNext(name.trim())}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.nextButtonText,
              isValid ? styles.nextButtonTextValid : styles.nextButtonTextDisabled,
            ]}
          >
            Continue
          </Text>
          <Icon
            name="chevron-right"
            size={20}
            color={isValid ? '#000000' : colors.textMuted}
          />
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
  input: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonTextValid: {
    color: '#000000',
  },
  nextButtonTextDisabled: {
    color: '#64748B',
  },
});
