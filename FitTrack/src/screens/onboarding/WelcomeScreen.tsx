/**
 * Onboarding Screen 1: Welcome to FitTrack
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { Icon } from '../../components/common/Icon';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.logoBadge, { backgroundColor: `${colors.primary}20` }]}>
          <Icon name="steps" size={54} color={colors.primary} />
        </View>

        <Text style={[styles.appName, { color: colors.primary }]}>FITTRACK</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Real Fitness.{'\n'}Zero Compromise.
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track your real steps, distance, workouts, and calories directly from your phone's Android Health Connect sensor engine.
        </Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.featureText, { color: colors.textPrimary }]}>
              Real Health Connect integration — 100% genuine activity
            </Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: colors.accentFlame }]} />
            <Text style={[styles.featureText, { color: colors.textPrimary }]}>
              Works fully offline with local cache & sync
            </Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: colors.accentPurple }]} />
            <Text style={[styles.featureText, { color: colors.textPrimary }]}>
              Zero subscription fees — personal & open
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    padding: 24,
    borderRadius: 36,
    marginBottom: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  featuresList: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    width: '100%',
    paddingTop: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
