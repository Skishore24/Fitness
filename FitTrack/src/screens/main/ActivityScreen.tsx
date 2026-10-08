/**
 * FitTrack Activity Screen
 * Detailed health metrics analysis with Day, Week, and Month filters,
 * real dynamic charts, averages, totals, and goal completions.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { useThemeStore } from '../../store/ThemeStore';
import { useActivityStore } from '../../store/ActivityStore';
import { useGoalStore } from '../../store/GoalStore';
import { WeeklyChart } from '../../components/charts/WeeklyChart';
import { StatCard } from '../../components/fitness/StatCard';
import { GoalProgressCard } from '../../components/fitness/GoalProgressCard';
import { Icon } from '../../components/common/Icon';

type FilterPeriod = 'Day' | 'Week' | 'Month';

export const ActivityScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const colors = theme.colors;

  const {
    today,
    weekly,
    monthly,
    isRefreshing,
    refreshAll,
    loadMonthlyActivity,
  } = useActivityStore();

  const { goals } = useGoalStore();

  const [period, setPeriod] = useState<FilterPeriod>('Week');

  useEffect(() => {
    if (period === 'Month' && monthly.length === 0) {
      loadMonthlyActivity();
    }
  }, [period, monthly.length, loadMonthlyActivity]);

  // Active dataset according to period
  const currentDataset =
    period === 'Day' ? [today] : period === 'Month' ? (monthly.length > 0 ? monthly : weekly) : weekly;

  // Aggregate metrics for chosen period
  const totalSteps = currentDataset.reduce((s, i) => s + i.steps, 0);
  const totalCalories = currentDataset.reduce((s, i) => s + i.calories, 0);
  const totalDistance = currentDataset.reduce((s, i) => s + i.distance, 0);
  const totalActive = currentDataset.reduce((s, i) => s + i.activeMinutes, 0);

  const daysCount = Math.max(1, currentDataset.length);
  const avgSteps = Math.round(totalSteps / daysCount);
  const avgCalories = Math.round(totalCalories / daysCount);
  const avgDistance = parseFloat((totalDistance / daysCount).toFixed(2));
  const avgActive = Math.round(totalActive / daysCount);

  // Goal completion rate
  const daysGoalAchieved = currentDataset.filter((i) => i.steps >= goals.dailySteps).length;
  const goalCompletionPercent = Math.round((daysGoalAchieved / daysCount) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Screen Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Activity Analytics</Text>

        {/* Filter Pills */}
        <View style={[styles.filterBar, { backgroundColor: colors.surfaceLight }]}>
          {(['Day', 'Week', 'Month'] as FilterPeriod[]).map((p) => {
            const isSelected = period === p;
            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.filterPill,
                  isSelected && { backgroundColor: colors.primary },
                ]}
                onPress={() => setPeriod(p)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected ? { color: colors.textInverse } : { color: colors.textSecondary },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Goal Completion Banner */}
        <View style={[styles.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.bannerRow}>
            <View style={[styles.bannerIcon, { backgroundColor: `${colors.secondary}20` }]}>
              <Icon name="trophy" size={24} color={colors.secondary} />
            </View>
            <View style={styles.bannerText}>
              <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
                Goal Consistency: {goalCompletionPercent}%
              </Text>
              <Text style={[styles.bannerSub, { color: colors.textSecondary }]}>
                {daysGoalAchieved} of {daysCount} {daysCount === 1 ? 'day' : 'days'} hit target of {goals.dailySteps.toLocaleString()} steps
              </Text>
            </View>
          </View>
        </View>

        {/* Dynamic Metric Chart */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {period === 'Day' ? "Today's Hourly Activity" : `${period}ly Breakdown`}
          </Text>
        </View>

        <WeeklyChart
          data={currentDataset.length > 0 ? currentDataset : [today]}
          goal={goals.dailySteps}
        />

        {/* Period Totals & Averages Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {period === 'Day' ? 'Day Stats' : `${period}ly Averages`}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title={period === 'Day' ? 'Steps' : 'Avg Steps'}
            value={(period === 'Day' ? totalSteps : avgSteps).toLocaleString()}
            unit="steps"
            icon="steps"
            accentColor={colors.primary}
            subtitle={period !== 'Day' ? `Total: ${totalSteps.toLocaleString()}` : undefined}
          />
          <StatCard
            title={period === 'Day' ? 'Calories' : 'Avg Burn'}
            value={(period === 'Day' ? totalCalories : avgCalories).toLocaleString()}
            unit="kcal"
            icon="flame"
            accentColor={colors.accentFlame}
            subtitle={period !== 'Day' ? `Total: ${totalCalories.toLocaleString()}` : undefined}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title={period === 'Day' ? 'Distance' : 'Avg Distance'}
            value={period === 'Day' ? totalDistance.toFixed(1) : avgDistance.toFixed(1)}
            unit="km"
            icon="distance"
            accentColor={colors.accentPurple}
            subtitle={period !== 'Day' ? `Total: ${totalDistance.toFixed(1)} km` : undefined}
          />
          <StatCard
            title={period === 'Day' ? 'Active Time' : 'Avg Active'}
            value={period === 'Day' ? totalActive : avgActive}
            unit="min"
            icon="clock"
            accentColor={colors.secondary}
            subtitle={period !== 'Day' ? `Total: ${totalActive}m` : undefined}
          />
        </View>

        {/* Goals Progress Summary */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Daily Goal Tracking</Text>
        </View>

        <GoalProgressCard
          title="Daily Steps"
          current={today.steps}
          target={goals.dailySteps}
          unit="steps"
          icon="steps"
          accentColor={colors.primary}
        />

        <GoalProgressCard
          title="Active Calories"
          current={today.calories}
          target={goals.dailyCalories}
          unit="kcal"
          icon="flame"
          accentColor={colors.accentFlame}
        />

        <GoalProgressCard
          title="Active Minutes"
          current={today.activeMinutes}
          target={goals.activeMinutes}
          unit="min"
          icon="clock"
          accentColor={colors.secondary}
        />
      </ScrollView>
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
  filterBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  banner: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    padding: 12,
    borderRadius: 16,
    marginRight: 14,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
