/**
 * ErrorState Component
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from './Icon';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: `${colors.error}20` }]}>
        <Icon name="alert" size={32} color={colors.error} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
