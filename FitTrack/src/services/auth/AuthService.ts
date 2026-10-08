/**
 * FitTrack Authentication Service
 * Implements Firebase Authentication with Google Sign-In as primary provider,
 * optional Email/Password authentication, session restoration, and token extraction.
 */
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { configureGoogleSignIn, getFirebaseAuth } from '../../config/firebase';
import { StorageService } from '../storage/StorageService';
import { UserProfile } from '../../types';

class AuthServiceClass {
  constructor() {
    configureGoogleSignIn();
  }

  /**
   * Primary Login: Continue with Google
   * Launches native Google Sign-In picker -> retrieves idToken -> signs in to Firebase.
   */
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      configureGoogleSignIn();

      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Trigger the Google Sign In intent
      const signInResult = await GoogleSignin.signIn();

      // Retrieve tokens
      const idToken = signInResult.data?.idToken;
      if (!idToken) {
        throw new Error('Google Sign-In failed: No ID Token returned from Google.');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential into Firebase
      const firebaseUserCredential = await auth().signInWithCredential(
        googleCredential
      );
      const user = firebaseUserCredential.user;

      const profile: UserProfile = {
        firebaseUid: user.uid,
        googleId: signInResult.data?.user?.id || undefined,
        email: user.email || '',
        name: user.displayName || 'Fitness Enthusiast',
        profileImage: user.photoURL || undefined,
        onboardingCompleted: await StorageService.isOnboardingCompleted(),
      };

      await StorageService.saveUserProfile(profile);
      return profile;
    } catch (error: any) {
      console.warn('AuthService: signInWithGoogle error', error);
      throw error;
    }
  }

  /**
   * Optional: Email & Password Sign Up
   */
  async signUpWithEmail(email: string, pass: string, name: string): Promise<UserProfile> {
    try {
      const fbAuth = getFirebaseAuth();
      if (!fbAuth) throw new Error('Firebase Auth not available');

      const userCred = await fbAuth.createUserWithEmailAndPassword(email, pass);
      await userCred.user.updateProfile({ displayName: name });

      const profile: UserProfile = {
        firebaseUid: userCred.user.uid,
        email: userCred.user.email || email,
        name: name,
        onboardingCompleted: await StorageService.isOnboardingCompleted(),
      };

      await StorageService.saveUserProfile(profile);
      return profile;
    } catch (error: any) {
      console.warn('AuthService: signUpWithEmail error', error);
      throw error;
    }
  }

  /**
   * Optional: Email & Password Sign In
   */
  async signInWithEmail(email: string, pass: string): Promise<UserProfile> {
    try {
      const fbAuth = getFirebaseAuth();
      if (!fbAuth) throw new Error('Firebase Auth not available');

      const userCred = await fbAuth.signInWithEmailAndPassword(email, pass);
      const user = userCred.user;

      const existingProfile = await StorageService.getUserProfile();
      const profile: UserProfile = {
        firebaseUid: user.uid,
        email: user.email || email,
        name: user.displayName || existingProfile?.name || 'Athlete',
        profileImage: user.photoURL || existingProfile?.profileImage,
        onboardingCompleted: await StorageService.isOnboardingCompleted(),
      };

      await StorageService.saveUserProfile(profile);
      return profile;
    } catch (error: any) {
      console.warn('AuthService: signInWithEmail error', error);
      throw error;
    }
  }

  /**
   * Guest / Offline Mode: For running the app immediately before configuring Firebase.
   */
  async signInAsGuest(): Promise<UserProfile> {
    const existing = await StorageService.getUserProfile();
    const profile: UserProfile = {
      firebaseUid: existing?.firebaseUid || `local_${Date.now()}`,
      email: existing?.email || 'local.user@fittrack.local',
      name: existing?.name || 'Local Athlete',
      onboardingCompleted: await StorageService.isOnboardingCompleted(),
    };
    await StorageService.saveUserProfile(profile);
    return profile;
  }

  /**
   * Restores authenticated session on app launch.
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const fbAuth = getFirebaseAuth();
      const currentUser = fbAuth?.currentUser;

      if (currentUser) {
        const stored = await StorageService.getUserProfile();
        return {
          firebaseUid: currentUser.uid,
          email: currentUser.email || stored?.email || '',
          name: currentUser.displayName || stored?.name || 'Athlete',
          profileImage: currentUser.photoURL || stored?.profileImage,
          age: stored?.age,
          gender: stored?.gender,
          height: stored?.height,
          weight: stored?.weight,
          fitnessGoal: stored?.fitnessGoal,
          activityLevel: stored?.activityLevel,
          onboardingCompleted: await StorageService.isOnboardingCompleted(),
        };
      }

      // Check local stored session for offline access
      const stored = await StorageService.getUserProfile();
      if (stored && stored.firebaseUid) {
        return stored;
      }

      return null;
    } catch (error) {
      console.warn('AuthService: getCurrentUser failed', error);
      return await StorageService.getUserProfile();
    }
  }

  /**
   * Obtains current user's Firebase ID token for secure backend API authorization.
   */
  async getIdToken(): Promise<string | null> {
    try {
      const fbAuth = getFirebaseAuth();
      const currentUser = fbAuth?.currentUser;
      if (currentUser) {
        return await currentUser.getIdToken(false);
      }
      return null;
    } catch (error) {
      console.warn('AuthService: getIdToken failed', error);
      return null;
    }
  }

  /**
   * Signs out user from Firebase and Google.
   */
  async signOut(): Promise<void> {
    try {
      const fbAuth = getFirebaseAuth();
      if (fbAuth) {
        await fbAuth.signOut();
      }
      try {
        await GoogleSignin.signOut();
      } catch {}
      // Clear profile from local cache
      const stored = await StorageService.getUserProfile();
      if (stored) {
        await StorageService.saveUserProfile({
          ...stored,
          firebaseUid: '',
        });
      }
    } catch (error) {
      console.warn('AuthService: signOut error', error);
    }
  }
}

export const AuthService = new AuthServiceClass();
