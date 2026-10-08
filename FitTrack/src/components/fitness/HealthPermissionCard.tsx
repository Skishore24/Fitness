/**
 * HealthPermissionCard Component
 * Informs the user of current Health Connect connection status, explains rationale,
 * and allows granting permissions or opening system Health Connect settings.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../common/Icon';
import { HealthConnectStatus, HealthPermissionsState } from '../../types';

interface HealthPermissionCardProps {
  status: HealthConnectStatus;
  permissions: HealthPermissionsState;
  onRequestPermissions: () => void;
  onOpenSettings: () => void;
  isLoading?: boolean;
}

export const HealthPermissionCard: React.FC<HealthPermissionCardProps> = ({
  status,
  permissions,
  onRequestPermissions,
  onOpenSettings,
  isLoading = false,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  // If Health Connect is fully available and steps are granted
  if (status === 'AVAILABLE' && permissions.stepsGranted) {
    return (
      <View style={[styles.container, { backgroundColor: `${colors.secondary}12`, borderColor: `${colors.secondary}40` }]}>
        <View style={styles.row}>
          <View style={[styles.iconBadge, { backgroundColor: `${colors.secondary}25` }]}>
            <Icon name="check" size={18} color={colors.secondary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.statusTitle, { color: colors.secondary }]}>Health Connect Connected</Text>
            <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
              Syncing real step and activity data directly from Android
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.smallButton, { borderColor: colors.border }]}
            onPress={onOpenSettings}
            activeOpacity={0.7}
          >
            <Text style={[styles.smallButtonText, { color: colors.textSecondary }]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // If Health Connect requires update
  if (status === 'PROVIDER_UPDATE_REQUIRED') {
    return (
      <View style={[styles.container, { backgroundColor: `${colors.warning}15`, borderColor: `${colors.warning}50` }]}>
        <View style={styles.row}>
          <View style={[styles.iconBadge, { backgroundColor: `${colors.warning}25` }]}>
            <Icon name="alert" size={20} color={colors.warning} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.statusTitle, { color: colors.warning }]}>Health Connect Update Needed</Text>
            <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
              Please update Health Connect from the Google Play Store to enable step reading.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.warning }]}
          onPress={onOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryButtonText, styles.darkButtonText]}>Update Health Connect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If Health Connect is unavailable on device
  if (status === 'UNAVAILABLE') {
    return (
      <View style={[styles.container, { backgroundColor: `${colors.error}12`, borderColor: `${colors.error}40` }]}>
        <View style={styles.row}>
          <View style={[styles.iconBadge, { backgroundColor: `${colors.error}25` }]}>
            <Icon name="alert" size={20} color={colors.error} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.statusTitle, { color: colors.error }]}>Health Connect Unavailable</Text>
            <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
              Health Connect is required for automatic step tracking on Android 9+. Install it via Google Play.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, styles.borderedButton, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
          onPress={onOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryButtonText, { color: colors.textPrimary }]}>Open System Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Available, but permissions NOT yet granted
  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
      <View style={styles.row}>
        <View style={[styles.iconBadge, { backgroundColor: `${colors.primary}20` }]}>
          <Icon name="shield" size={22} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>Connect Health Data</Text>
          <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
            FitTrack requires permission to read real step count and distance from Health Connect.
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.primaryButton, styles.flex2, { backgroundColor: colors.primary }]}
          onPress={onRequestPermissions}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text style={[styles.primaryButtonText, styles.darkButtonText]}>Grant Permission</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlineButton, styles.flex1, { borderColor: colors.border }]}
          onPress={onOpenSettings}
          activeOpacity={0.7}
        >
          <Text style={[styles.outlineButtonText, { color: colors.textSecondary }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  smallButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  smallButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  darkButtonText: {
    color: '#000000',
  },
  borderedButton: {
    borderWidth: 1,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});
