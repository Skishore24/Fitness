/**
 * FitTrack Login Screen
 * Primary: Continue with Google (Firebase Authentication)
 * Secondary: Email/Password & Instant Guest/Offline mode for local testing
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { useAuthStore } from '../../store/AuthStore';
import { Icon } from '../../components/common/Icon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch {
      // Handled in store
    }
  };

  const handleEmailAuth = async () => {
    clearError();
    if (!email.trim() || !password.trim()) return;

    try {
      if (mode === 'LOGIN') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password, name.trim() || 'Athlete');
      }
      onLoginSuccess();
    } catch {
      // Handled in store
    }
  };

  const handleGuestLogin = async () => {
    clearError();
    await signInAsGuest();
    onLoginSuccess();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Banner */}
        <View style={styles.brandSection}>
          <View style={[styles.logoBadge, { backgroundColor: `${colors.primary}20` }]}>
            <Icon name="steps" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>FITTRACK</Text>
          <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
            {mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.textSecondary }]}>
            Track real activity with Android Health Connect.
          </Text>
        </View>

        {/* Error Banner */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.error}18`, borderColor: colors.error }]}>
            <Icon name="alert" size={18} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}

        {/* Primary Auth: Continue with Google */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <>
              <Icon name="google" size={22} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>or with email</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Email Form */}
        <View style={styles.form}>
          {mode === 'SIGNUP' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="athlete@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.emailSubmitButton, { backgroundColor: colors.primary }]}
            onPress={handleEmailAuth}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.emailSubmitText}>
              {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode Toggle */}
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
            {mode === 'LOGIN' ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              clearError();
              setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
            }}
          >
            <Text style={[styles.toggleLink, { color: colors.primary }]}>
              {mode === 'LOGIN' ? ' Sign Up' : ' Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Offline / Local Guest Mode */}
        <TouchableOpacity
          style={[styles.guestButton, { borderColor: colors.border }]}
          onPress={handleGuestLogin}
          activeOpacity={0.7}
        >
          <Text style={[styles.guestButtonText, { color: colors.textSecondary }]}>
            Continue in Offline / Demo Mode
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    padding: 20,
    borderRadius: 30,
    marginBottom: 16,
  },
  appName: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
  },
  emailSubmitButton: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  emailSubmitText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  toggleText: {
    fontSize: 14,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  guestButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
