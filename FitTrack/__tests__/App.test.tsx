/**
 * FitTrack App Smoke Test
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock RootNavigator so navigation tree does not perform heavy deep rendering in smoke test
jest.mock('../src/navigation/RootNavigator', () => ({
  RootNavigator: () => null,
}));

// Mock all bootstrap store actions
jest.mock('../src/store/ThemeStore', () => ({
  useThemeStore: () => ({
    theme: {
      colors: {
        background: '#0B0F19',
        card: '#161F30',
        text: '#F3F4F6',
        textSecondary: '#9CA3AF',
        primary: '#3B82F6',
      },
    },
    mode: 'dark',
    initTheme: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('../src/store/AuthStore', () => ({
  useAuthStore: () => ({
    initAuth: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('../src/store/ActivityStore', () => ({
  useActivityStore: () => ({
    initActivity: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('../src/store/GoalStore', () => ({
  useGoalStore: () => ({
    loadGoals: jest.fn().mockResolvedValue(undefined),
  }),
}));

test('renders correctly without crashing', () => {
  let tree: any;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });
  expect(tree).toBeTruthy();
});
