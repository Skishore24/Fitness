/**
 * Onboarding Screen 10: Connect Health Data
 * Renders clear privacy rationale explaining Android Health Connect access
 * and launches native permission contract.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';
import { HealthConnectService } from '../../services/health/HealthConnectService';

interface ConnectHealthScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ConnectHealthScreen: React.FC<ConnectHealthScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [isRequesting, setIsRequesting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsRequesting(true);
      await HealthConnectService.requestPermissions();
    } catch (e) {
      console.warn('ConnectHealthScreen: permission request error', e);
    } finally {
      setIsRequesting(false);
      onComplete();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>10 of 10</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}20` }]}>
          <Icon name="shield" size={54} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Connect Health Data</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          FitTrack connects directly with Android Health Connect to read your actual steps and distance without battery-draining background processes.
        </Text>

        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <View style={[styles.bullet, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              <Text style={styles.boldInfoLabel}>Real Data Only:</Text> No mocked numbers or fake steps.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              <Text style={styles.boldInfoLabel}>Your Privacy First:</Text> Activity data remains stored on your phone.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.bullet, { backgroundColor: colors.accentPurple }]} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              <Text style={styles.boldInfoLabel}>Full User Control:</Text> You can revoke permissions at any time in Android settings.
            </Text>
          </View>
        </View>

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          Note: Pressing Connect will present Android's official Health Connect permission dialog.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleConnect}
          disabled={isRequesting}
          activeOpacity={0.8}
        >
          {isRequesting ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                Connect Health Connect
              </Text>
              <Icon name="chevron-right" size={20} color="#000000" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={onComplete}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipButtonText, { color: colors.textMuted }]}>
            Set up later in Settings
          </Text>
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
  iconWrapper: {
    padding: 24,
    borderRadius: 36,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  infoCard: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  footer: {
    width: '100%',
    paddingTop: 16,
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  boldInfoLabel: {
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
