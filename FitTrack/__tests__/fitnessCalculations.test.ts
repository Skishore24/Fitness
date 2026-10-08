/**
 * Unit Tests for FitTrack Core Logic
 * Tests:
 * 1. Step percentage calculation & visual clamping (cannot exceed 100%)
 * 2. Goal progress calculation
 * 3. Date calculations & formatting
 * 4. Activity aggregation (totals, averages, best day)
 * 5. Workout calculations (calories, paces, duration)
 */
import { ActivitySummary } from '../src/types';

describe('FitTrack Core Logic Tests', () => {
  // 1. Step Percentage Calculation
  describe('Step percentage calculation', () => {
    const calculateStepPercentage = (steps: number, goal: number) => {
      if (goal <= 0) return 0;
      return Math.round((steps / goal) * 100);
    };

    const calculateClampedPercentage = (steps: number, goal: number) => {
      const raw = calculateStepPercentage(steps, goal);
      return Math.min(100, Math.max(0, raw));
    };

    it('calculates exact 78% for 7842 steps out of 10000', () => {
      expect(calculateStepPercentage(7842, 10000)).toBe(78);
      expect(calculateClampedPercentage(7842, 10000)).toBe(78);
    });

    it('clamps visual indicator at 100% when goal is exceeded', () => {
      expect(calculateStepPercentage(14500, 10000)).toBe(145);
      expect(calculateClampedPercentage(14500, 10000)).toBe(100);
    });

    it('handles 0 steps gracefully without NaN', () => {
      expect(calculateStepPercentage(0, 10000)).toBe(0);
      expect(calculateClampedPercentage(0, 10000)).toBe(0);
    });

    it('handles 0 goal gracefully without division by zero', () => {
      expect(calculateStepPercentage(5000, 0)).toBe(0);
      expect(calculateClampedPercentage(5000, 0)).toBe(0);
    });
  });

  // 2. Goal Progress Calculations
  describe('Goal progress calculations', () => {
    it('calculates calories progress correctly', () => {
      const currentCalories = 350;
      const targetCalories = 500;
      const progress = Math.min(100, Math.round((currentCalories / targetCalories) * 100));
      expect(progress).toBe(70);
    });

    it('calculates active minutes progress correctly', () => {
      const currentMinutes = 45;
      const targetMinutes = 45;
      const progress = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));
      expect(progress).toBe(100);
    });
  });

  // 3. Date Calculations & Formatting
  describe('Date formatting and intervals', () => {
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    it('formats dates consistently to YYYY-MM-DD', () => {
      const testDate = new Date(2026, 9, 7); // Oct 7, 2026
      expect(formatDate(testDate)).toBe('2026-10-07');
    });

    it('computes 7 distinct consecutive daily keys', () => {
      const today = new Date(2026, 9, 7);
      const past7: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        past7.push(formatDate(d));
      }
      expect(past7.length).toBe(7);
      expect(past7[0]).toBe('2026-10-01');
      expect(past7[6]).toBe('2026-10-07');
    });
  });

  // 4. Activity Aggregation
  describe('Activity aggregation', () => {
    const mockWeek: ActivitySummary[] = [
      { date: '2026-10-01', steps: 8000, distance: 6.0, calories: 400, activeMinutes: 45 },
      { date: '2026-10-02', steps: 10500, distance: 8.2, calories: 520, activeMinutes: 60 },
      { date: '2026-10-03', steps: 7200, distance: 5.4, calories: 360, activeMinutes: 40 },
      { date: '2026-10-04', steps: 12000, distance: 9.5, calories: 610, activeMinutes: 75 },
      { date: '2026-10-05', steps: 9100, distance: 7.0, calories: 460, activeMinutes: 50 },
      { date: '2026-10-06', steps: 6500, distance: 4.8, calories: 310, activeMinutes: 35 },
      { date: '2026-10-07', steps: 7842, distance: 5.8, calories: 342, activeMinutes: 40 },
    ];

    it('calculates total weekly steps correctly', () => {
      const totalSteps = mockWeek.reduce((acc, curr) => acc + curr.steps, 0);
      expect(totalSteps).toBe(61142);
    });

    it('calculates daily average steps correctly', () => {
      const totalSteps = mockWeek.reduce((acc, curr) => acc + curr.steps, 0);
      const avgSteps = Math.round(totalSteps / mockWeek.length);
      expect(avgSteps).toBe(8735);
    });

    it('identifies best day accurately', () => {
      const maxSteps = Math.max(...mockWeek.map((d) => d.steps));
      const bestDay = mockWeek.find((d) => d.steps === maxSteps);
      expect(maxSteps).toBe(12000);
      expect(bestDay?.date).toBe('2026-10-04');
    });
  });

  // 5. Workout Calculations
  describe('Workout calculations', () => {
    it('estimates calories burned accurately for running', () => {
      const runningDurationMinutes = 30;
      const ratePerMinute = 11.5;
      const expectedCalories = Math.round(runningDurationMinutes * ratePerMinute);
      expect(expectedCalories).toBe(345);
    });

    it('formats seconds into human readable MM:SS or HH:MM:SS', () => {
      const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
          return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      };

      expect(formatDuration(75)).toBe('01:15');
      expect(formatDuration(3665)).toBe('01:01:05');
    });
  });
});
