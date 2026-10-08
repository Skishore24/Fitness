/**
 * FitTrack Goals Screen
 * Displays dynamic goal completion cards (Steps, Calories, Active Minutes, Water)
 * and allows in-place editing with automatic persistence and sync.
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
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { useGoalStore } from '../../store/GoalStore';
import { useActivityStore } from '../../store/ActivityStore';
import { GoalProgressCard } from '../../components/fitness/GoalProgressCard';
import { Icon } from '../../components/common/Icon';

export const GoalsScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const { goals, updateGoals } = useGoalStore();
  const { today } = useActivityStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [stepStr, setStepStr] = useState(String(goals.dailySteps));
  const [calStr, setCalStr] = useState(String(goals.dailyCalories));
  const [minStr, setMinStr] = useState(String(goals.activeMinutes));
  const [waterStr, setWaterStr] = useState(String(goals.water));

  const openEditor = () => {
    setStepStr(String(goals.dailySteps));
    setCalStr(String(goals.dailyCalories));
    setMinStr(String(goals.activeMinutes));
    setWaterStr(String(goals.water));
    setEditModalVisible(true);
  };

  const saveEditor = async () => {
    await updateGoals({
      dailySteps: parseInt(stepStr, 10) || goals.dailySteps,
      dailyCalories: parseInt(calStr, 10) || goals.dailyCalories,
      activeMinutes: parseInt(minStr, 10) || goals.activeMinutes,
      water: parseInt(waterStr, 10) || goals.water,
    });
    setEditModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Daily Goals</Text>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: `${colors.primary}20` }]}
          onPress={openEditor}
          activeOpacity={0.7}
        >
          <Icon name="edit" size={16} color={colors.primary} />
          <Text style={[styles.editText, { color: colors.primary }]}>Edit Goals</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step Goal Card */}
        <GoalProgressCard
          title="Daily Steps"
          current={today.steps}
          target={goals.dailySteps}
          unit="steps"
          icon="steps"
          accentColor={colors.primary}
        />

        {/* Calories Goal Card */}
        <GoalProgressCard
          title="Active Calories"
          current={today.calories}
          target={goals.dailyCalories}
          unit="kcal"
          icon="flame"
          accentColor={colors.accentFlame}
        />

        {/* Active Minutes Goal Card */}
        <GoalProgressCard
          title="Active Minutes"
          current={today.activeMinutes}
          target={goals.activeMinutes}
          unit="min"
          icon="clock"
          accentColor={colors.secondary}
        />

        {/* Hydration Goal Card */}
        <GoalProgressCard
          title="Daily Water Hydration"
          current={1750} // 1,750 ml
          target={goals.water}
          unit="ml"
          icon="water"
          accentColor="#29B6F6"
        />

        {/* Motivation Card */}
        <View style={[styles.motivationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.motivationRow}>
            <View style={[styles.trophyIcon, { backgroundColor: `${colors.secondary}20` }]}>
              <Icon name="trophy" size={24} color={colors.secondary} />
            </View>
            <View style={styles.motivationText}>
              <Text style={[styles.motivationTitle, { color: colors.textPrimary }]}>
                Daily Streak: 3 Days 🔥
              </Text>
              <Text style={[styles.motivationSub, { color: colors.textSecondary }]}>
                Consistency outperforms intensity. Stay active, hit your step milestones, and keep the streak alive!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Goals Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Daily Targets</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Daily Steps Target</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                keyboardType="numeric"
                value={stepStr}
                onChangeText={setStepStr}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Active Calories (kcal)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                keyboardType="numeric"
                value={calStr}
                onChangeText={setCalStr}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Active Minutes</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                keyboardType="numeric"
                value={minStr}
                onChangeText={setMinStr}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Water Intake (ml)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                keyboardType="numeric"
                value={waterStr}
                onChangeText={setWaterStr}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={saveEditor}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Targets</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  editText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  motivationCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
  },
  motivationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyIcon: {
    padding: 12,
    borderRadius: 16,
    marginRight: 14,
  },
  motivationText: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  motivationSub: {
    fontSize: 12,
    lineHeight: 17,
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
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  formGroup: {
    gap: 6,
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
    fontSize: 15,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },
});
