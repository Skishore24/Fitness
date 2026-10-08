/**
 * OnboardingFlowScreen
 * Orchestrates the full 10-screen onboarding experience.
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/AuthStore';
import { useGoalStore } from '../../store/GoalStore';
import { StorageService } from '../../services/storage/StorageService';
import { FitnessGoal, ActivityLevel, Gender, UserProfile } from '../../types';

import { WelcomeScreen } from './WelcomeScreen';
import { ProfileNameScreen } from './ProfileNameScreen';
import { ProfileAgeScreen } from './ProfileAgeScreen';
import { ProfileGenderScreen } from './ProfileGenderScreen';
import { ProfileHeightScreen } from './ProfileHeightScreen';
import { ProfileWeightScreen } from './ProfileWeightScreen';
import { FitnessGoalScreen } from './FitnessGoalScreen';
import { ActivityLevelScreen } from './ActivityLevelScreen';
import { DailyStepGoalScreen } from './DailyStepGoalScreen';
import { ConnectHealthScreen } from './ConnectHealthScreen';

interface OnboardingFlowScreenProps {
  onFinish: () => void;
}

export const OnboardingFlowScreen: React.FC<OnboardingFlowScreenProps> = ({
  onFinish,
}) => {
  const { user, updateProfile } = useAuthStore();
  const { updateGoals } = useGoalStore();

  const [step, setStep] = useState<number>(1);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    name: user?.name || '',
    age: user?.age || 25,
    gender: user?.gender || 'Male',
    height: user?.height || 175,
    weight: user?.weight || 70,
    fitnessGoal: user?.fitnessGoal || 'Improve Fitness',
    activityLevel: user?.activityLevel || 'Moderately Active',
  });
  const [dailyStepGoal, setDailyStepGoal] = useState<number>(10000);

  const completeOnboarding = async () => {
    // 1. Persist profile
    await updateProfile({
      ...profileData,
      onboardingCompleted: true,
    });

    // 2. Persist step goal
    await updateGoals({ dailySteps: dailyStepGoal });

    // 3. Set onboarding completed flag
    await StorageService.setOnboardingCompleted(true);

    // 4. Navigate into main app
    onFinish();
  };

  return (
    <View style={styles.container}>
      {step === 1 && <WelcomeScreen onStart={() => setStep(2)} />}

      {step === 2 && (
        <ProfileNameScreen
          initialName={profileData.name}
          onNext={(name) => {
            setProfileData((prev) => ({ ...prev, name }));
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ProfileAgeScreen
          initialAge={profileData.age}
          onNext={(age) => {
            setProfileData((prev) => ({ ...prev, age }));
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <ProfileGenderScreen
          initialGender={profileData.gender}
          onNext={(gender: Gender) => {
            setProfileData((prev) => ({ ...prev, gender }));
            setStep(5);
          }}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <ProfileHeightScreen
          initialHeight={profileData.height}
          onNext={(height) => {
            setProfileData((prev) => ({ ...prev, height }));
            setStep(6);
          }}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <ProfileWeightScreen
          initialWeight={profileData.weight}
          onNext={(weight) => {
            setProfileData((prev) => ({ ...prev, weight }));
            setStep(7);
          }}
          onBack={() => setStep(5)}
        />
      )}

      {step === 7 && (
        <FitnessGoalScreen
          initialGoal={profileData.fitnessGoal}
          onNext={(fitnessGoal: FitnessGoal) => {
            setProfileData((prev) => ({ ...prev, fitnessGoal }));
            setStep(8);
          }}
          onBack={() => setStep(6)}
        />
      )}

      {step === 8 && (
        <ActivityLevelScreen
          initialLevel={profileData.activityLevel}
          onNext={(activityLevel: ActivityLevel) => {
            setProfileData((prev) => ({ ...prev, activityLevel }));
            setStep(9);
          }}
          onBack={() => setStep(7)}
        />
      )}

      {step === 9 && (
        <DailyStepGoalScreen
          initialGoal={dailyStepGoal}
          onNext={(stepTarget) => {
            setDailyStepGoal(stepTarget);
            setStep(10);
          }}
          onBack={() => setStep(8)}
        />
      )}

      {step === 10 && (
        <ConnectHealthScreen
          onComplete={completeOnboarding}
          onBack={() => setStep(9)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
