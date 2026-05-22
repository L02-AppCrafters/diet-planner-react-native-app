import { StyleSheet, Text, View } from 'react-native';
import {
  activityStreak,
  bodyFat,
  nutrientAdherence,
  weeklyCaloriesAverage,
  weightPoints,
  weightSummary,
} from '../../data/progress';
import { ProgressBar } from '../../components/tracker/ProgressBar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const font = {
  medium: {
    fontFamily: fontFamily.medium,
    fontWeight: undefined,
  },
  semiBold: {
    fontFamily: fontFamily.semiBold,
    fontWeight: undefined,
  },
  bold: {
    fontFamily: fontFamily.bold,
    fontWeight: undefined,
  },
  extraBold: {
    fontFamily: fontFamily.extraBold,
    fontWeight: undefined,
  },
  manropeBold: {
    fontFamily: fontFamily.manropeBold,
    fontWeight: undefined,
  },
} as const;

const chartWidth = 240;
const chartHeight = 120;

export function ProgressTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Your Performance</Text>
      <Text style={styles.pageSubtitle}>Consistency is the secret to lasting results.</Text>
      <WeightCard />
      <ActivityCard />
      <WeeklyCaloriesCard />
      <BodyFatCard />
      <NutrientAdherenceCard />
    </View>
  );
}

function WeightCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{weightSummary.title}</Text>
        <View style={styles.segmented}>
          <Text style={[styles.segmentText, styles.segmentActive]}>Week</Text>
          <Text style={styles.segmentText}>Month</Text>
        </View>
      </View>
      <View style={styles.weightRow}>
        <Text style={styles.weightValue}>{weightSummary.value}</Text>
        <Text style={styles.weightDelta}>↓ {weightSummary.delta}</Text>
      </View>
      <LineChart />
      <Text style={styles.chartTarget}>{weightSummary.target}</Text>
    </View>
  );
}

function LineChart() {
  const max = Math.max(...weightPoints);
  const min = Math.min(...weightPoints);
  const range = Math.max(1, max - min);
  const points = weightPoints.map((value, index) => {
    const x = (chartWidth / (weightPoints.length - 1)) * index;
    const y = chartHeight - ((value - min) / range) * chartHeight;
    return { x, y };
  });

  return (
    <View style={styles.chart}>
      {points.slice(1).map((point, index) => {
        const prev = points[index];
        const dx = point.x - prev.x;
        const dy = point.y - prev.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <View
            key={`line-${index}`}
            style={[
              styles.chartLine,
              {
                width: length,
                left: prev.x,
                top: prev.y,
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          />
        );
      })}
      {points.map((point, index) => (
        <View key={`dot-${index}`} style={[styles.chartDot, { left: point.x - 6, top: point.y - 6 }]} />
      ))}
    </View>
  );
}

function ActivityCard() {
  return (
    <View style={[styles.card, styles.cardRail]}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>{activityStreak.title}</Text>
        <Text style={styles.activityValue}>{activityStreak.days}</Text>
        <Text style={styles.activityUnit}>Days</Text>
      </View>
      <ProgressBar color={colors.primary} progress={activityStreak.progress} />
      <Text style={styles.activityNote}>{activityStreak.subtitle}</Text>
    </View>
  );
}

function WeeklyCaloriesCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{weeklyCaloriesAverage.title}</Text>
        <View style={styles.weeklyValueWrap}>
          <Text style={styles.weeklyValue}>{weeklyCaloriesAverage.value}</Text>
          <Text style={styles.weeklySuffix}>{weeklyCaloriesAverage.suffix}</Text>
        </View>
      </View>
      <View style={styles.weeklyDays}>
        {weeklyCaloriesAverage.days.map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.weeklyDay}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

function BodyFatCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{bodyFat.title}</Text>
        <View style={styles.bodyFatBadge}>
          <Text style={styles.bodyFatBadgeText}>+</Text>
        </View>
      </View>
      <View style={styles.bodyFatRow}>
        <View>
          <Text style={styles.bodyFatValue}>{bodyFat.value}</Text>
          <Text style={styles.bodyFatDelta}>↓ {bodyFat.delta}</Text>
        </View>
        <View style={styles.bodyFatRing}>
          <Text style={styles.bodyFatStatus}>{bodyFat.status}</Text>
        </View>
      </View>
      <Text style={styles.bodyFatNote}>{bodyFat.note}</Text>
    </View>
  );
}

function NutrientAdherenceCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Nutrient Adherence</Text>
      {nutrientAdherence.map((item) => (
        <View key={item.label} style={styles.nutrientRow}>
          <View style={styles.nutrientInfo}>
            <View style={[styles.nutrientIcon, { backgroundColor: `${item.color}22` }]} />
            <Text style={styles.nutrientLabel}>{item.label}</Text>
          </View>
          <Text style={styles.nutrientPercent}>{item.percent}%</Text>
          <View style={styles.nutrientTrack}>
            <View style={[styles.nutrientFill, { backgroundColor: item.color, width: `${item.percent}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  activityHeader: {
    marginBottom: spacing.md,
  },
  activityNote: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontWeight: undefined,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  activityTitle: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  activityUnit: {
    color: colors.ink,
    ...font.medium,
    fontSize: 16,
  },
  activityValue: {
    color: colors.primary,
    ...font.extraBold,
    fontSize: 48,
    lineHeight: 54,
  },
  bodyFatBadge: {
    alignItems: 'center',
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  bodyFatBadgeText: {
    color: colors.accent,
    ...font.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  bodyFatDelta: {
    color: colors.primary,
    ...font.semiBold,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  bodyFatNote: {
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontWeight: undefined,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  bodyFatRing: {
    alignItems: 'center',
    borderColor: '#DDE9FF',
    borderRadius: 999,
    borderWidth: 10,
    height: 92,
    justifyContent: 'center',
    width: 92,
  },
  bodyFatRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  bodyFatStatus: {
    color: colors.accent,
    ...font.bold,
    fontSize: 10,
  },
  bodyFatValue: {
    color: colors.ink,
    ...font.extraBold,
    fontSize: 30,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    marginTop: 24,
    padding: 22,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRail: {
    borderLeftColor: colors.primary,
    borderLeftWidth: 4,
  },
  cardTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 18,
  },
  chart: {
    height: chartHeight,
    marginTop: spacing.lg,
    width: chartWidth,
  },
  chartDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  chartLine: {
    backgroundColor: colors.primary,
    height: 4,
    position: 'absolute',
  },
  chartTarget: {
    alignSelf: 'flex-end',
    color: colors.primary,
    ...font.bold,
    fontSize: 10,
    marginTop: spacing.sm,
  },
  container: {
    paddingTop: spacing.xl,
  },
  nutrientFill: {
    borderRadius: 999,
    height: '100%',
  },
  nutrientIcon: {
    borderRadius: 10,
    height: 34,
    width: 34,
  },
  nutrientInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  nutrientLabel: {
    color: colors.ink,
    ...font.semiBold,
    fontSize: 14,
  },
  nutrientPercent: {
    color: colors.ink,
    ...font.bold,
    fontSize: 12,
  },
  nutrientRow: {
    marginTop: spacing.lg,
  },
  nutrientTrack: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    height: 8,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  pageSubtitle: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontWeight: undefined,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  pageTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 28,
  },
  segmented: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    flexDirection: 'row',
    padding: 4,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    borderRadius: 999,
  },
  segmentText: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  weightDelta: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  weightRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  weightValue: {
    color: colors.primary,
    ...font.extraBold,
    fontSize: 24,
  },
  weeklyDay: {
    color: colors.inkSoft,
    ...font.bold,
    fontSize: 10,
  },
  weeklyDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  weeklySuffix: {
    color: colors.inkSoft,
    ...font.semiBold,
    fontSize: 10,
  },
  weeklyValue: {
    color: colors.accent,
    ...font.extraBold,
    fontSize: 18,
    textAlign: 'right',
  },
  weeklyValueWrap: {
    alignItems: 'flex-end',
  },
});
