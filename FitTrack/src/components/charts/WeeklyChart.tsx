/**
 * WeeklyChart Component
 * Renders daily bars for Steps, Calories, Distance, and Active Minutes
 * with statistics (Total, Average, Best Day, Goal Line) using pure SVG.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { useThemeStore } from '../../store/ThemeStore';
import { ActivitySummary } from '../../types';

export type MetricType = 'steps' | 'calories' | 'distance' | 'activeMinutes';

interface WeeklyChartProps {
  data: ActivitySummary[];
  goal?: number;
}

const METRIC_CONFIG: Record<
  MetricType,
  { label: string; unit: string; color: string; defaultGoal: number }
> = {
  steps: { label: 'Steps', unit: 'steps', color: '#00E5FF', defaultGoal: 10000 },
  calories: { label: 'Calories', unit: 'kcal', color: '#FF6D00', defaultGoal: 500 },
  distance: { label: 'Distance', unit: 'km', color: '#7C4DFF', defaultGoal: 7.0 },
  activeMinutes: { label: 'Active', unit: 'min', color: '#00E676', defaultGoal: 45 },
};

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, goal }) => {
  const { theme } = useThemeStore();
  const colors = theme.colors;
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('steps');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const config = METRIC_CONFIG[selectedMetric];
  const targetGoal = goal || config.defaultGoal;

  // Ensure 7 days array
  const chartItems = data.slice(-7);

  // Extract values
  const values = chartItems.map((item) => {
    switch (selectedMetric) {
      case 'steps':
        return item.steps;
      case 'calories':
        return item.calories;
      case 'distance':
        return item.distance;
      case 'activeMinutes':
        return item.activeMinutes;
    }
  });

  // Calculate stats
  const total = values.reduce((sum, v) => sum + v, 0);
  const average = values.length > 0 ? Math.round(total / values.length) : 0;
  const maxVal = Math.max(...values, targetGoal, 1);
  const bestDayVal = Math.max(...values, 0);
  const bestDayIdx = values.indexOf(bestDayVal);

  const getDayName = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }
    } catch {}
    return '';
  };

  // Dimensions
  const chartHeight = 160;
  const chartWidth = 320;
  const barWidth = 24;
  const barGap = (chartWidth - barWidth * 7) / 8;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Metric Tabs */}
      <View style={styles.metricTabs}>
        {(Object.keys(METRIC_CONFIG) as MetricType[]).map((key) => {
          const isSelected = selectedMetric === key;
          const metricColor = METRIC_CONFIG[key].color;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.tab,
                isSelected ? { backgroundColor: `${metricColor}20`, borderColor: metricColor } : styles.tabInactive,
              ]}
              onPress={() => {
                setSelectedMetric(key);
                setSelectedIndex(null);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isSelected ? metricColor : colors.textSecondary },
                ]}
              >
                {METRIC_CONFIG[key].label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Summary KPI Strip */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCol}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>TOTAL</Text>
          <Text style={[styles.kpiValue, { color: colors.textPrimary }]}>
            {selectedMetric === 'distance' ? total.toFixed(1) : total.toLocaleString()}{' '}
            <Text style={styles.kpiUnit}>{config.unit}</Text>
          </Text>
        </View>

        <View style={styles.kpiCol}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>DAILY AVG</Text>
          <Text style={[styles.kpiValue, { color: colors.textPrimary }]}>
            {selectedMetric === 'distance' ? (total / Math.max(1, values.length)).toFixed(1) : average.toLocaleString()}{' '}
            <Text style={styles.kpiUnit}>{config.unit}</Text>
          </Text>
        </View>

        <View style={styles.kpiCol}>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>BEST DAY</Text>
          <Text style={[styles.kpiValue, { color: config.color }]}>
            {selectedMetric === 'distance' ? bestDayVal.toFixed(1) : bestDayVal.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* SVG Bar Chart */}
      <View style={styles.svgWrapper}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Goal Line */}
          {targetGoal > 0 && (
            <G>
              <Line
                x1={0}
                y1={chartHeight - 30 - ((targetGoal / maxVal) * (chartHeight - 45))}
                x2={chartWidth}
                y2={chartHeight - 30 - ((targetGoal / maxVal) * (chartHeight - 45))}
                stroke={colors.textMuted}
                strokeWidth={1}
                strokeDasharray="4, 4"
              />
              <SvgText
                x={chartWidth - 5}
                y={chartHeight - 34 - ((targetGoal / maxVal) * (chartHeight - 45))}
                fill={colors.textMuted}
                fontSize="9"
                fontWeight="bold"
                textAnchor="end"
              >
                GOAL
              </SvgText>
            </G>
          )}

          {/* Daily Bars */}
          {chartItems.map((item, index) => {
            const val = values[index];
            const barH = Math.max(4, (val / maxVal) * (chartHeight - 45));
            const x = barGap + index * (barWidth + barGap);
            const y = chartHeight - 24 - barH;
            const isHovered = selectedIndex === index;
            const isBest = index === bestDayIdx && val > 0;

            return (
              <G key={item.date || index}>
                {/* Background track */}
                <Rect
                  x={x}
                  y={15}
                  width={barWidth}
                  height={chartHeight - 39}
                  rx={6}
                  fill={colors.surfaceLight}
                />
                {/* Active Bar */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={6}
                  fill={isHovered ? colors.primaryLight : isBest ? config.color : `${config.color}CC`}
                />
                {/* Day Label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight - 8}
                  fill={isHovered ? colors.textPrimary : colors.textMuted}
                  fontSize="10"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {getDayName(item.date)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  metricTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabInactive: {
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: 10,
  },
  kpiCol: {
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  kpiUnit: {
    fontSize: 10,
    fontWeight: '500',
  },
  svgWrapper: {
    alignItems: 'center',
    marginTop: 6,
  },
});
