/**
 * Firebase Configuration & Helper
 * FitTrack uses native @react-native-firebase for zero-cost authentication.
 */
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ENV } from './env';

let isGoogleSigninConfigured = false;

export const configureGoogleSignIn = () => {
  if (isGoogleSigninConfigured) return;
  try {
    GoogleSignin.configure({
      webClientId: ENV.googleWebClientId,
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
    isGoogleSigninConfigured = true;
  } catch (error) {
    console.warn('Google Sign In configuration warning:', error);
  }
};

export const getFirebaseAuth = () => {
  try {
    return auth();
  } catch (error) {
    console.warn('Firebase Auth native initialization warning:', error);
    return null;
  }
};

export type { FirebaseAuthTypes };
export { auth, GoogleSignin };
