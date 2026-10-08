/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-firebase/auth', () => {
  const authMock = () => ({
    signInWithCredential: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
  });
  authMock.GoogleAuthProvider = {
    credential: jest.fn(() => ({})),
  };
  return authMock;
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ data: { idToken: 'mock_token', user: {} } }),
  },
}));

jest.mock('react-native-health-connect', () => ({
  initialize: jest.fn().mockResolvedValue(true),
  getSdkStatus: jest.fn().mockResolvedValue(1),
  requestPermission: jest.fn().mockResolvedValue([]),
  getGrantedPermissions: jest.fn().mockResolvedValue([]),
  readRecords: jest.fn().mockResolvedValue({ records: [] }),
  openHealthConnectSettings: jest.fn(),
  SdkAvailabilityStatus: {
    SDK_AVAILABLE: 1,
    SDK_UNAVAILABLE: 2,
    SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED: 3,
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});
