/**
 * FitTrack Health Connect Service
 * Integrates directly with Android Health Connect as the single source of truth
 * for real step counts, distance, calories, and exercise sessions.
 *
 * Handles all permission states:
 * - AVAILABLE, UNAVAILABLE, PROVIDER_UPDATE_REQUIRED
 * - Granted, Denied, Revoked, Partial
 * - Never returns simulated or fake data.
 */
import {
  initialize,
  getSdkStatus,
  requestPermission,
  getGrantedPermissions,
  openHealthConnectSettings,
  readRecords,
  SdkAvailabilityStatus,
  Permission,
} from 'react-native-health-connect';
import {
  HealthConnectStatus,
  HealthPermissionsState,
  ActivitySummary,
} from '../../types';
import { StorageService } from '../storage/StorageService';

const REQUIRED_PERMISSIONS: Permission[] = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'Distance' },
  { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  { accessType: 'read', recordType: 'ExerciseSession' },
];

class HealthConnectServiceClass {
  private isInitialized = false;

  /**
   * Initializes Health Connect client if not already initialized.
   */
  async ensureInitialized(): Promise<boolean> {
    if (this.isInitialized) return true;
    try {
      const status = await this.isHealthConnectAvailable();
      if (status !== 'AVAILABLE') {
        return false;
      }
      const success = await initialize();
      this.isInitialized = success;
      return success;
    } catch (error) {
      console.warn('HealthConnectService: Initialization failed', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Checks whether Health Connect is available, unavailable, or requires an update.
   */
  async isHealthConnectAvailable(): Promise<HealthConnectStatus> {
    try {
      const status = await getSdkStatus();
      if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
        return 'AVAILABLE';
      }
      if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
        return 'PROVIDER_UPDATE_REQUIRED';
      }
      return 'UNAVAILABLE';
    } catch (error) {
      console.warn('HealthConnectService: getSdkStatus check failed', error);
      return 'UNAVAILABLE';
    }
  }

  /**
   * Checks current permissions granted by the user.
   */
  async checkPermissions(): Promise<HealthPermissionsState> {
    try {
      const isReady = await this.ensureInitialized();
      if (!isReady) {
        return {
          stepsGranted: false,
          distanceGranted: false,
          caloriesGranted: false,
          exerciseGranted: false,
          allGranted: false,
        };
      }

      const granted = await getGrantedPermissions();
      const grantedTypes = new Set(
        granted.map((p) => ('recordType' in p ? p.recordType : ''))
      );

      const state: HealthPermissionsState = {
        stepsGranted: grantedTypes.has('Steps'),
        distanceGranted: grantedTypes.has('Distance'),
        caloriesGranted: grantedTypes.has('TotalCaloriesBurned'),
        exerciseGranted: grantedTypes.has('ExerciseSession'),
        allGranted:
          grantedTypes.has('Steps') &&
          grantedTypes.has('Distance') &&
          grantedTypes.has('TotalCaloriesBurned') &&
          grantedTypes.has('ExerciseSession'),
      };

      await StorageService.saveCachedHealthPermissions(state);
      return state;
    } catch (error) {
      console.warn('HealthConnectService: checkPermissions failed', error);
      return {
        stepsGranted: false,
        distanceGranted: false,
        caloriesGranted: false,
        exerciseGranted: false,
        allGranted: false,
      };
    }
  }

  /**
   * Prompts the native Android Health Connect permission dialog.
   */
  async requestPermissions(): Promise<HealthPermissionsState> {
    try {
      const isReady = await this.ensureInitialized();
      if (!isReady) {
        return await this.checkPermissions();
      }

      await requestPermission(REQUIRED_PERMISSIONS);
      return await this.checkPermissions();
    } catch (error) {
      console.warn('HealthConnectService: requestPermissions failed', error);
      return await this.checkPermissions();
    }
  }

  /**
   * Opens the system Android Health Connect settings.
   */
  openSettings(): void {
    try {
      openHealthConnectSettings();
    } catch (error) {
      console.warn('HealthConnectService: openHealthConnectSettings failed', error);
    }
  }

  /**
   * Helper: Get start of day and end of day ISO strings for a given Date.
   */
  private getDayRange(targetDate: Date) {
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    return {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
  }

  /**
   * Formats a Date object to YYYY-MM-DD in local time.
   */
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Reads real step count for today from Health Connect.
   * Returns 0 if no records exist, permissions are missing, or SDK is unavailable.
   */
  async getTodaySteps(): Promise<number> {
    return await this.getStepsForDate(new Date());
  }

  /**
   * Reads real step count for a specific date from Health Connect.
   */
  async getStepsForDate(date: Date): Promise<number> {
    try {
      const isReady = await this.ensureInitialized();
      if (!isReady) return 0;

      const { startTime, endTime } = this.getDayRange(date);
      const response = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime,
          endTime,
        },
      });

      if (!response || !response.records || response.records.length === 0) {
        return 0;
      }

      // Aggregate total steps from all step records
      const totalSteps = response.records.reduce(
        (sum, record) => sum + (record.count || 0),
        0
      );
      return Math.round(totalSteps);
    } catch (error) {
      console.warn('HealthConnectService: getStepsForDate failed', error);
      return 0;
    }
  }

  /**
   * Reads real walking/running distance for today in kilometers.
   */
  async getTodayDistance(): Promise<number> {
    return await this.getDistanceForDate(new Date());
  }

  async getDistanceForDate(date: Date): Promise<number> {
    try {
      const isReady = await this.ensureInitialized();
      if (!isReady) return 0;

      const { startTime, endTime } = this.getDayRange(date);
      const response = await readRecords('Distance', {
        timeRangeFilter: {
          operator: 'between',
          startTime,
          endTime,
        },
      });

      if (!response || !response.records || response.records.length === 0) {
        return 0;
      }

      // Health Connect distance is in Length (in meters or kilometers)
      const totalMeters = response.records.reduce((sum, record) => {
        const meters = record.distance?.inMeters ?? (record.distance?.inKilometers ? record.distance.inKilometers * 1000 : 0);
        return sum + meters;
      }, 0);

      // Convert meters to kilometers rounded to 2 decimal places
      return parseFloat((totalMeters / 1000).toFixed(2));
    } catch (error) {
      console.warn('HealthConnectService: getDistanceForDate failed', error);
      return 0;
    }
  }

  /**
   * Reads real active/total calories burned for today in kcal.
   */
  async getTodayCalories(): Promise<number> {
    return await this.getCaloriesForDate(new Date());
  }

  async getCaloriesForDate(date: Date): Promise<number> {
    try {
      const isReady = await this.ensureInitialized();
      if (!isReady) return 0;

      const { startTime, endTime } = this.getDayRange(date);
      const response = await readRecords('TotalCaloriesBurned', {
        timeRangeFilter: {
          operator: 'between',
          startTime,
          endTime,
        },
      });

      if (!response || !response.records || response.records.length === 0) {
        return 0;
      }

      const totalKcal = response.records.reduce((sum, record) => {
        const kcal = record.energy?.inKilocalories ?? (record.energy?.inCalories ? record.energy.inCalories / 1000 : 0);
        return sum + kcal;
      }, 0);

      return Math.round(totalKcal);
    } catch (error) {
      console.warn('HealthConnectService: getCaloriesForDate failed', error);
      return 0;
    }
  }

  /**
   * Reads real active minutes for today calculated from exercise sessions.
   */
  async getTodayActiveMinutes(): Promise<number> {
    return await this.getActiveMinutesForDate(new Date());
  }

  async getActiveMinutesForDate(date: Date): Promise<number> {
    try {
      const isReady = await this.ensureInitialized();
      if (!isReady) return 0;

      const { startTime, endTime } = this.getDayRange(date);
      const response = await readRecords('ExerciseSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime,
          endTime,
        },
      });

      if (!response || !response.records || response.records.length === 0) {
        return 0;
      }

      // Calculate total duration in minutes
      const totalMinutes = response.records.reduce((sum, record) => {
        const start = new Date(record.startTime).getTime();
        const end = new Date(record.endTime).getTime();
        const diffMs = Math.max(0, end - start);
        return sum + diffMs / (1000 * 60);
      }, 0);

      return Math.round(totalMinutes);
    } catch (error) {
      console.warn('HealthConnectService: getActiveMinutesForDate failed', error);
      return 0;
    }
  }

  /**
   * Retrieves complete summary for today and saves it into local cache.
   */
  async getTodaySummary(): Promise<ActivitySummary> {
    const today = new Date();
    const dateStr = this.formatDateToYYYYMMDD(today);

    const [steps, distance, calories, activeMinutes] = await Promise.all([
      this.getTodaySteps(),
      this.getTodayDistance(),
      this.getTodayCalories(),
      this.getTodayActiveMinutes(),
    ]);

    const summary: ActivitySummary = {
      date: dateStr,
      steps,
      distance,
      calories,
      activeMinutes,
    };

    // Cache locally for offline dashboard
    await StorageService.saveTodayActivity(summary);
    return summary;
  }

  /**
   * Queries real daily steps & metrics for the past 7 days (including today).
   */
  async getWeeklySteps(): Promise<ActivitySummary[]> {
    const results: ActivitySummary[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = this.formatDateToYYYYMMDD(d);

      const [steps, distance, calories, activeMinutes] = await Promise.all([
        this.getStepsForDate(d),
        this.getDistanceForDate(d),
        this.getCaloriesForDate(d),
        this.getActiveMinutesForDate(d),
      ]);

      results.push({
        date: dateStr,
        steps,
        distance,
        calories,
        activeMinutes,
      });
    }

    await StorageService.saveActivityHistory(results);
    return results;
  }

  /**
   * Queries real daily steps & metrics for the past 30 days.
   */
  async getMonthlySteps(): Promise<ActivitySummary[]> {
    const results: ActivitySummary[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = this.formatDateToYYYYMMDD(d);

      const [steps, distance, calories, activeMinutes] = await Promise.all([
        this.getStepsForDate(d),
        this.getDistanceForDate(d),
        this.getCaloriesForDate(d),
        this.getActiveMinutesForDate(d),
      ]);

      results.push({
        date: dateStr,
        steps,
        distance,
        calories,
        activeMinutes,
      });
    }

    return results;
  }
}

export const HealthConnectService = new HealthConnectServiceClass();
