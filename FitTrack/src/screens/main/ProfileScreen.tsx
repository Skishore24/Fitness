/**
 * FitTrack Profile & Settings Screen
 * Manages user bio & metrics editing, Health Connect permissions & settings,
 * backend synchronization status, theme toggle, and logout.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { useAuthStore } from '../../store/AuthStore';
import { useActivityStore } from '../../store/ActivityStore';
import { Icon } from '../../components/common/Icon';
import { UserProfile } from '../../types';
import { getApiBaseUrl, setRuntimeApiBaseUrl } from '../../config/env';

export const ProfileScreen: React.FC = () => {
  const { theme, mode, toggleTheme } = useThemeStore();
  const colors = theme.colors;

  const { user, updateProfile, signOut } = useAuthStore();
  const {
    permissions,
    syncState,
    openHealthSettings,
    requestPermissions,
    syncWithBackend,
  } = useActivityStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const [editData, setEditData] = useState<Partial<UserProfile>>({
    name: user?.name || '',
    age: user?.age || 25,
    gender: user?.gender || 'Male',
    height: user?.height || 175,
    weight: user?.weight || 70,
    fitnessGoal: user?.fitnessGoal || 'Improve Fitness',
    activityLevel: user?.activityLevel || 'Moderately Active',
  });

  const [serverUrl, setServerUrl] = useState(getApiBaseUrl());

  const handleSaveProfile = async () => {
    await updateProfile(editData);
    setEditModalVisible(false);
  };

  const handleSaveServerUrl = () => {
    setRuntimeApiBaseUrl(serverUrl);
    setServerModalVisible(false);
    syncWithBackend();
  };

  const handleLogoutPrompt = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of FitTrack?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Profile & Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card Header */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { borderColor: colors.primary }]}>
            <Icon name="profile" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.profileName, { color: colors.textPrimary }]}>
            {user?.name || 'Athlete'}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            {user?.email || 'local.user@fittrack.local'}
          </Text>

          <TouchableOpacity
            style={[styles.editProfileBtn, { backgroundColor: `${colors.primary}20` }]}
            onPress={() => {
              setEditData({
                name: user?.name || '',
                age: user?.age || 25,
                gender: user?.gender || 'Male',
                height: user?.height || 175,
                weight: user?.weight || 70,
                fitnessGoal: user?.fitnessGoal || 'Improve Fitness',
                activityLevel: user?.activityLevel || 'Moderately Active',
              });
              setEditModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Icon name="edit" size={14} color={colors.primary} />
            <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>

          {/* User Bio Metrics Strip */}
          <View style={[styles.metricsStrip, { borderTopColor: colors.borderLight }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricStripVal, { color: colors.textPrimary }]}>
                {user?.age || 25}
              </Text>
              <Text style={[styles.metricStripLabel, { color: colors.textMuted }]}>Age</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricStripVal, { color: colors.textPrimary }]}>
                {user?.height || 175} cm
              </Text>
              <Text style={[styles.metricStripLabel, { color: colors.textMuted }]}>Height</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricStripVal, { color: colors.textPrimary }]}>
                {user?.weight || 70} kg
              </Text>
              <Text style={[styles.metricStripLabel, { color: colors.textMuted }]}>Weight</Text>
            </View>
          </View>
        </View>

        {/* Section: HEALTH CONNECT DATA */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>HEALTH DATA ACCESS</Text>

        <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={permissions.stepsGranted ? openHealthSettings : requestPermissions}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${colors.secondary}18` }]}>
              <Icon name="shield" size={18} color={colors.secondary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Health Connect Status</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                {permissions.stepsGranted
                  ? 'Active • Connected & Reading Real Steps'
                  : 'Disconnected • Tap to Grant Permission'}
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          <TouchableOpacity style={styles.menuRow} onPress={openHealthSettings} activeOpacity={0.7}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}18` }]}>
              <Icon name="settings" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Manage System Permissions</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                Open Android Health Connect settings app
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section: BACKEND & SYNC */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>BACKEND & SYNC</Text>

        <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.menuRow} onPress={syncWithBackend} activeOpacity={0.7}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.accentPurple}18` }]}>
              <Icon name="refresh" size={18} color={colors.accentPurple} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Sync Activity Data</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                {syncState.isSyncing
                  ? 'Syncing in progress...'
                  : syncState.isOffline
                  ? 'Backend unreachable • Operating in local offline mode'
                  : syncState.lastSyncTime
                  ? `Last synced: ${new Date(syncState.lastSyncTime).toLocaleTimeString()}`
                  : 'Tap to sync pending activity'}
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setServerModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${colors.accentFlame}18` }]}>
              <Icon name="settings" size={18} color={colors.accentFlame} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Server API Base URL</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {getApiBaseUrl()}
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section: PREFERENCES */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>

        <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.menuRow}>
            <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}18` }]}>
              <Icon name="clock" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Dark Mode</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                {mode === 'dark' ? 'Athletic Dark Theme' : 'Clean Light Theme'}
              </Text>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              thumbColor={mode === 'dark' ? colors.primary : '#FFFFFF'}
              trackColor={{ false: colors.surfaceLight, true: `${colors.primary}60` }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setPrivacyModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${colors.secondary}18` }]}>
              <Icon name="shield" size={18} color={colors.secondary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Privacy Policy</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                Data storage, Health Connect explanation & rights
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: `${colors.error}15`, borderColor: colors.error }]}
          onPress={handleLogoutPrompt}
          activeOpacity={0.8}
        >
          <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                value={editData.name}
                onChangeText={(v) => setEditData((p) => ({ ...p, name: v }))}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupFlex}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Age</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={String(editData.age)}
                  onChangeText={(v) => setEditData((p) => ({ ...p, age: parseInt(v, 10) || 0 }))}
                />
              </View>

              <View style={styles.formGroupFlex}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Height (cm)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={String(editData.height)}
                  onChangeText={(v) => setEditData((p) => ({ ...p, height: parseInt(v, 10) || 0 }))}
                />
              </View>

              <View style={styles.formGroupFlex}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={String(editData.weight)}
                  onChangeText={(v) => setEditData((p) => ({ ...p, weight: parseInt(v, 10) || 0 }))}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Server URL Modal */}
      <Modal visible={serverModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Backend Server URL</Text>
              <TouchableOpacity onPress={() => setServerModalVisible(false)}>
                <Icon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Enter your laptop's local IP address (e.g. http://192.168.1.5:8000) when running FastAPI locally.
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={serverUrl}
              onChangeText={setServerUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveServerUrl}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Update URL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal visible={privacyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.modalContentLarge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>FitTrack Privacy Policy</Text>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                <Icon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.policyScroll}>
              <Text style={[styles.policyHeading, { color: colors.textPrimary }]}>1. Health Connect Integration</Text>
              <Text style={[styles.policyText, { color: colors.textSecondary }]}>
                FitTrack reads step count and distance directly from Android Health Connect with your explicit consent. No background sensor tracking or unauthorized access is performed.
              </Text>

              <Text style={[styles.policyHeading, { color: colors.textPrimary }]}>2. Zero Third-Party Advertising</Text>
              <Text style={[styles.policyText, { color: colors.textSecondary }]}>
                Your fitness records are never sold, rented, or shared with commercial ad networks. Data remains stored locally on your device and only synced to your private personal backend.
              </Text>

              <Text style={[styles.policyHeading, { color: colors.textPrimary }]}>3. Full Revocation Rights</Text>
              <Text style={[styles.policyText, { color: colors.textSecondary }]}>
                You can revoke FitTrack's permissions at any time directly through Android Settings &gt; Health Connect.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={() => setPrivacyModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    marginBottom: 14,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 6,
    marginBottom: 18,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricsStrip: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 14,
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricStripVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  metricStripLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    padding: 10,
    borderRadius: 12,
    marginRight: 14,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  formGroup: {
    gap: 6,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  policyHeading: {
    fontSize: 14,
    fontWeight: '700',
  },
  policyText: {
    fontSize: 12,
    lineHeight: 18,
  },
  formGroupFlex: {
    flex: 1,
    gap: 6,
  },
  modalContentLarge: {
    maxHeight: '80%',
  },
  policyScroll: {
    gap: 12,
  },
});
