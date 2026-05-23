import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import {
  activityStreak,
  bodyFat,
  nutrientAdherence,
  weeklyCaloriesAverage,
  weightPoints,
  weightSummary,
} from '../../data/progress';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const font = {
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  medium: { fontFamily: fontFamily.medium, fontWeight: undefined },
  semiBold: { fontFamily: fontFamily.semiBold, fontWeight: undefined },
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  manropeBold: { fontFamily: fontFamily.manropeBold, fontWeight: undefined },
  manropeExtraBold: { fontFamily: fontFamily.manropeExtraBold, fontWeight: undefined },
} as const;

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const chartWidth = 300;
const chartHeight = 160;

export function ProgressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Your Performance</Text>
      <Text style={styles.pageSubtitle}>Consistency is the secret to lasting results.</Text>
      <WeightCard />
      <ActivityCard />
      <WeeklyCaloriesCard />
      <BodyFatCard />
      <Text style={styles.sectionTitle}>Nutrient Adherence</Text>
      <NutrientAdherenceCard />
    </View>
  );
}

function WeightCard() {
  const [range, setRange] = useState<'Week' | 'Month'>('Week');

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{weightSummary.title}</Text>
        <View style={styles.segmented}>
          {(['Week', 'Month'] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setRange(item)}
              style={[styles.segmentButton, range === item && styles.segmentButtonActive]}
            >
              <Text style={[styles.segmentText, range === item && styles.segmentTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.weightRow}>
        <Text style={styles.weightValue}>{weightSummary.value}</Text>
        <View style={styles.weightDeltaBadge}>
          <SvgIcon height={10} source={svgIcons.downArrow} width={10} />
          <Text style={styles.weightDeltaText}>{weightSummary.delta}</Text>
        </View>
      </View>
      <LineChart values={weightPoints} />
      <View style={styles.chartDays}>
        {days.map((day) => (
          <Text key={day} style={styles.chartDay}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

function LineChart({ compact, values }: { compact?: boolean; values: number[] }) {
  const width = chartWidth;
  const height = compact ? 122 : chartHeight;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values.map((value, index) => {
    const x = 16 + ((width - 32) / (values.length - 1)) * index;
    const y = 20 + (height - 44) - ((value - min) / range) * (height - 58);
    return { x, y };
  });
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1].x} ${height - 18} L ${points[0].x} ${height - 18} Z`;

  return (
    <View style={[styles.chartWrap, compact && styles.chartWrapCompact]}>
      <Svg height={height} width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={compact ? 'weeklyArea' : 'weightArea'} x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={colors.primaryMid} stopOpacity="0.26" />
            <Stop offset="1" stopColor={colors.primaryMid} stopOpacity="0.04" />
          </LinearGradient>
        </Defs>
        <Path d={`M 16 ${height - 18} H ${width - 16}`} stroke="#EEF2F1" strokeWidth="1" />
        <Path d={`M 16 ${height * 0.52} H ${width - 16}`} stroke="#EEF2F1" strokeWidth="1" />
        <Path d={area} fill={`url(#${compact ? 'weeklyArea' : 'weightArea'})`} />
        <Path d={line} fill="none" stroke={colors.primaryMid} strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
        {!compact
          ? points.slice(1, 6).map((point, index) => (
              <Circle key={`dot-${index}`} cx={point.x} cy={point.y} fill={colors.primary} r={5} stroke={colors.surface} strokeWidth="2" />
            ))
          : null}
      </Svg>
      {!compact ? <Text style={styles.chartTarget}>{weightSummary.target}</Text> : null}
    </View>
  );
}

function ActivityCard() {
  return (
    <View style={[styles.card, styles.activityCard]}>
      <View style={styles.activityRail} />
      <View style={styles.activityBackgroundIcon}>
        <SvgIcon height={96} source={svgIcons.activityStreak} width={86} />
      </View>
      <Text style={styles.activityTitle}>{activityStreak.title.toUpperCase()}</Text>
      <View style={styles.activityValueRow}>
        <Text style={styles.activityValue}>{activityStreak.days}</Text>
        <Text style={styles.activityUnit}>Days</Text>
      </View>
      <View style={styles.activityBars}>
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={index} style={[styles.activityBar, index >= activityStreak.days && styles.activityBarMuted]} />
        ))}
      </View>
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
      <LineChart compact values={[1980, 2140, 2020, 2300, 2180, 2400, 2260]} />
      <View style={styles.chartDays}>
        {weeklyCaloriesAverage.days.map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.chartDay}>
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
        <SvgIcon height={18} source={svgIcons.bodyFat} width={18} />
      </View>
      <View style={styles.bodyFatRow}>
        <View>
          <Text style={styles.bodyFatValue}>{bodyFat.value}</Text>
          <View style={styles.bodyFatDeltaRow}>
            <SvgIcon height={10} source={svgIcons.downArrow} width={10} />
            <Text style={styles.bodyFatDelta}>{bodyFat.delta}</Text>
          </View>
        </View>
        <HealthRing percent={22.4} />
      </View>
      <Text style={styles.bodyFatNote}>"{bodyFat.note}"</Text>
    </View>
  );
}

function HealthRing({ percent }: { percent: number }) {
  const size = 112;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <View style={styles.healthRingWrap}>
      <Svg height={size} width={size}>
        <Circle cx={size / 2} cy={size / 2} fill="transparent" r={radius} stroke="#EEF2FF" strokeWidth="10" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          originX={size / 2}
          originY={size / 2}
          r={radius}
          rotation="-90"
          stroke={colors.accent}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </Svg>
      <Text style={styles.healthText}>{bodyFat.status}</Text>
    </View>
  );
}

function NutrientAdherenceCard() {
  const icons = {
    Carbs: svgIcons.caloriesLarge,
    Fats: svgIcons.waterLarge,
    Protein: svgIcons.proteinLarge,
  } as const;
  const backgrounds = {
    Carbs: '#FEF3C7',
    Fats: '#DBEAFE',
    Protein: '#CFFBE4',
  } as const;

  return (
    <View style={styles.nutrientList}>
      {nutrientAdherence.map((item) => (
        <View key={item.label} style={styles.nutrientCard}>
          <View style={[styles.nutrientIcon, { backgroundColor: backgrounds[item.label as keyof typeof backgrounds] }]}>
            <SvgIcon source={icons[item.label as keyof typeof icons]} size={22} />
          </View>
          <View style={styles.nutrientMain}>
            <View style={styles.nutrientTopRow}>
              <Text style={styles.nutrientLabel}>{item.label}</Text>
              <Text style={styles.nutrientPercent}>{item.percent}%</Text>
            </View>
            <View style={styles.nutrientTrack}>
              <View style={[styles.nutrientFill, { backgroundColor: item.color, width: `${Math.min(item.percent, 100)}%` }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  activityBackgroundIcon: {
    bottom: 26,
    opacity: 1,
    position: 'absolute',
    right: 20,
  },
  activityBar: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    flex: 1,
    height: 6,
  },
  activityBarMuted: {
    backgroundColor: '#CBD9F3',
  },
  activityBars: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingRight: 12,
  },
  activityCard: {
    overflow: 'hidden',
    paddingLeft: 28,
  },
  activityNote: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  activityRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    bottom: 20,
    left: 0,
    position: 'absolute',
    top: 20,
    width: 4,
  },
  activityTitle: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 14,
    letterSpacing: 2,
  },
  activityUnit: {
    color: colors.ink,
    ...font.bold,
    fontSize: 20,
    marginBottom: 12,
  },
  activityValue: {
    color: colors.primary,
    ...font.manropeExtraBold,
    fontSize: 60,
    lineHeight: 66,
  },
  activityValueRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 14,
  },
  bodyFatDelta: {
    color: colors.primary,
    ...font.semiBold,
    fontSize: 14,
  },
  bodyFatDeltaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  bodyFatNote: {
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: undefined,
    lineHeight: 20,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  bodyFatRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  bodyFatValue: {
    color: colors.ink,
    ...font.bold,
    fontSize: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginTop: 28,
    padding: 24,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 18,
  },
  chartDay: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 10,
  },
  chartDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  chartTarget: {
    backgroundColor: colors.surface,
    bottom: 44,
    color: colors.primary,
    ...font.bold,
    fontSize: 10,
    paddingHorizontal: spacing.xs,
    position: 'absolute',
    right: 4,
  },
  chartWrap: {
    alignSelf: 'center',
    marginTop: 18,
    width: chartWidth,
  },
  chartWrapCompact: {
    marginTop: 34,
  },
  container: {
    paddingTop: spacing.xl,
  },
  healthRingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthText: {
    color: colors.accent,
    ...font.bold,
    fontSize: 10,
    position: 'absolute',
  },
  nutrientCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.lg,
    padding: 16,
  },
  nutrientFill: {
    borderRadius: 999,
    height: '100%',
  },
  nutrientIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  nutrientLabel: {
    color: colors.ink,
    ...font.bold,
    fontSize: 14,
  },
  nutrientList: {
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  nutrientMain: {
    flex: 1,
  },
  nutrientPercent: {
    color: colors.ink,
    ...font.semiBold,
    fontSize: 12,
  },
  nutrientTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientTrack: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    height: 6,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  pageSubtitle: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 16,
    marginTop: spacing.xs,
  },
  pageTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 30,
  },
  sectionTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 24,
    marginTop: 36,
  },
  segmented: {
    backgroundColor: '#F1F3FF',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 4,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 7,
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  segmentButtonActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 11,
  },
  segmentTextActive: {
    color: colors.primary,
  },
  weightDeltaBadge: {
    alignItems: 'center',
    backgroundColor: '#A9ECCC',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  weightDeltaText: {
    color: '#306D58',
    ...font.semiBold,
    fontSize: 14,
  },
  weightRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  weightValue: {
    color: colors.primary,
    ...font.bold,
    fontSize: 24,
  },
  weeklySuffix: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  weeklyValue: {
    color: colors.accent,
    ...font.bold,
    fontSize: 20,
    textAlign: 'right',
  },
  weeklyValueWrap: {
    alignItems: 'flex-end',
  },
});
