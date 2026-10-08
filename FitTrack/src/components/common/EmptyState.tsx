/**
 * EmptyState Component
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon, IconName } from './Icon';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'workout',
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.surfaceLight }]}>
        <Icon name={icon} size={36} color={colors.textSecondary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      {actionText && onAction && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginVertical: 20,
  },
  iconWrapper: {
    padding: 20,
    borderRadius: 30,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 18,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  buttonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
});
