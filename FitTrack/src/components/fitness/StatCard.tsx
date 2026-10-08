/**
 * StatCard Component
 * Displays individual health metrics (Calories, Distance, Active Time)
 * with distinctive accent colors, icons, and units.
 */
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon, IconName } from '../common/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: IconName;
  accentColor: string;
  subtitle?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  accentColor,
  subtitle,
  isLoading = false,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${accentColor}18` }]}>
          <Icon name={icon} size={20} color={accentColor} />
        </View>
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      </View>

      <View style={styles.valueRow}>
        {isLoading ? (
          <ActivityIndicator size="small" color={accentColor} />
        ) : (
          <>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
            <Text style={[styles.unit, { color: colors.textMuted }]}>{unit}</Text>
          </>
        )}
      </View>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    margin: 6,
    minHeight: 110,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginRight: 4,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
