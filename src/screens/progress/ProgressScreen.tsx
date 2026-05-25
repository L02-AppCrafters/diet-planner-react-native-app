import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { DailyLog } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const font = {
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  semiBold: { fontFamily: fontFamily.semiBold, fontWeight: undefined },
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  manropeBold: { fontFamily: fontFamily.manropeBold, fontWeight: undefined },
  manropeExtraBold: { fontFamily: fontFamily.manropeExtraBold, fontWeight: undefined },
} as const;

const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const compactDayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const chartWidth = 300;
const chartHeight = 160;
const waterGoalMl = 2500;

type ProgressScreenProps = {
  calorieGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  goal: 'lose_weight' | 'gain_muscle' | 'healthy_lifestyle' | string;
  profileWeight: number;
  proteinGoal: number;
  weeklyLogs: DailyLog[];
};

type WeekDayMetric = {
  date: string;
  log: DailyLog | null;
};

type NutrientItem = {
  color: string;
  label: 'Protein' | 'Carbs' | 'Fats';
  percent: number;
};

export function ProgressScreen({
  calorieGoal,
  carbsGoal,
  fatsGoal,
  goal,
  profileWeight,
  proteinGoal,
  weeklyLogs,
}: ProgressScreenProps) {
  const analytics = buildAnalytics({
    calorieGoal,
    carbsGoal,
    fatsGoal,
    goal,
    profileWeight,
    proteinGoal,
    weeklyLogs,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Analytics</Text>
      <Text style={styles.pageSubtitle}>Weekly stats are calculated from Monday to Sunday.</Text>
      <WeightCard analytics={analytics} />
      <ActivityCard analytics={analytics} />
      <WeeklyCaloriesCard analytics={analytics} />
      <WaterCard analytics={analytics} />
      <Text style={styles.sectionTitle}>Nutrient Adherence</Text>
      <NutrientAdherenceCard items={analytics.nutrients} />
    </View>
  );
}

function WeightCard({ analytics }: { analytics: ReturnType<typeof buildAnalytics> }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Weight Over Time</Text>
        <Text style={styles.weekLabel}>THIS WEEK</Text>
      </View>
      <View style={styles.weightRow}>
        <Text style={styles.weightValue}>{analytics.currentWeight.toFixed(1)} kg</Text>
        <View style={styles.weightDeltaBadge}>
          <SvgIcon height={10} source={svgIcons.downArrow} width={10} />
          <Text style={styles.weightDeltaText}>{Math.abs(analytics.weightDelta).toFixed(1)} kg</Text>
        </View>
      </View>
      <LineChart targetLabel={`TARGET ${analytics.targetWeight.toFixed(0)}KG`} values={analytics.weightValues} />
      <View style={styles.chartDays}>
        {dayLabels.map((day) => (
          <Text key={day} style={styles.chartDay}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

function LineChart({ compact, targetLabel, values }: { compact?: boolean; targetLabel?: string; values: number[] }) {
  const width = chartWidth;
  const height = compact ? 122 : chartHeight;
  const safeValues = values.length > 1 ? values : [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...safeValues, 1);
  const min = Math.min(...safeValues);
  const range = Math.max(1, max - min);
  const points = safeValues.map((value, index) => {
    const x = 16 + ((width - 32) / Math.max(safeValues.length - 1, 1)) * index;
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
          ? points.map((point, index) => (
              <Circle key={`dot-${index}`} cx={point.x} cy={point.y} fill={colors.primary} r={4.5} stroke={colors.surface} strokeWidth="2" />
            ))
          : null}
      </Svg>
      {!compact && targetLabel ? <Text style={styles.chartTarget}>{targetLabel}</Text> : null}
    </View>
  );
}

function ActivityCard({ analytics }: { analytics: ReturnType<typeof buildAnalytics> }) {
  return (
    <View style={[styles.card, styles.activityCard]}>
      <View style={styles.activityRail} />
      <View style={styles.activityBackgroundIcon}>
        <SvgIcon height={96} source={svgIcons.activityStreak} width={86} />
      </View>
      <Text style={styles.activityTitle}>ACTIVITY STREAK</Text>
      <View style={styles.activityValueRow}>
        <Text style={styles.activityValue}>{analytics.activityStreak}</Text>
        <Text style={styles.activityUnit}>Days</Text>
      </View>
      <View style={styles.activityBars}>
        {analytics.weekDays.map((item) => (
          <View
            key={item.date}
            style={[
              styles.activityBar,
              item.status === 'completed' && styles.activityBarCompleted,
              item.status === 'missed' && styles.activityBarMissed,
              item.status === 'pending' && styles.activityBarMuted,
            ]}
          />
        ))}
      </View>
      <Text style={styles.activityNote}>
        {analytics.activityStreak > 0
          ? `${Math.max(0, 7 - analytics.activityStreak)} days left to complete this week.`
          : 'Log meals and meet your calorie goal to start a streak.'}
      </Text>
    </View>
  );
}

function WeeklyCaloriesCard({ analytics }: { analytics: ReturnType<typeof buildAnalytics> }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Weekly Calorie Average</Text>
        <View style={styles.weeklyValueWrap}>
          <Text style={styles.weeklyValue}>{analytics.averageCalories.toLocaleString()}</Text>
          <Text style={styles.weeklySuffix}>AVG KCAL/DAY</Text>
        </View>
      </View>
      <LineChart compact values={analytics.calorieValues} />
      <View style={styles.chartDays}>
        {compactDayLabels.map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.chartDay}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

function WaterCard({ analytics }: { analytics: ReturnType<typeof buildAnalytics> }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Water Intake %</Text>
        <SvgIcon color={colors.accent} height={18} source={svgIcons.water} width={14} />
      </View>
      <View style={styles.bodyFatRow}>
        <View>
          <Text style={styles.bodyFatValue}>{analytics.averageWaterPercent}%</Text>
          <View style={styles.bodyFatDeltaRow}>
            <SvgIcon color={colors.accent} height={12} source={svgIcons.water} width={10} />
            <Text style={styles.bodyFatDelta}>{analytics.averageWaterLiters.toFixed(1)}L avg/day</Text>
          </View>
        </View>
        <HealthRing percent={analytics.averageWaterPercent} />
      </View>
      <Text style={styles.bodyFatNote}>
        Average hydration from Monday to Sunday. Daily target: {(waterGoalMl / 1000).toFixed(1)}L.
      </Text>
    </View>
  );
}

function HealthRing({ percent }: { percent: number }) {
  const size = 112;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(percent, 100) / 100);

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
      <Text style={styles.healthText}>{Math.min(percent, 100)}%</Text>
    </View>
  );
}

function NutrientAdherenceCard({ items }: { items: NutrientItem[] }) {
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
      {items.map((item) => (
        <View key={item.label} style={styles.nutrientCard}>
          <View style={[styles.nutrientIcon, { backgroundColor: backgrounds[item.label] }]}>
            <SvgIcon source={icons[item.label]} size={22} />
          </View>
          <View style={styles.nutrientMain}>
            <View style={styles.nutrientTopRow}>
              <Text style={styles.nutrientLabel}>{item.label}</Text>
              <Text style={styles.nutrientPercent}>{item.percent}% avg/day</Text>
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

function buildAnalytics({
  calorieGoal,
  carbsGoal,
  fatsGoal,
  goal,
  profileWeight,
  proteinGoal,
  weeklyLogs,
}: ProgressScreenProps) {
  const safeCalorieGoal = Math.max(calorieGoal, 1);
  const weekDays = buildWeekDays(weeklyLogs);
  const calorieValues = weekDays.map((item) => item.log?.calories ?? 0);
  const weightValues = buildWeightValues(weekDays, profileWeight);
  const waterValues = weekDays.map((item) => item.log?.waterMl ?? 0);
  const totalCalories = calorieValues.reduce((sum, value) => sum + value, 0);
  const totalWater = waterValues.reduce((sum, value) => sum + value, 0);
  const currentWeight = weightValues[weightValues.length - 1] ?? profileWeight;
  const firstWeight = weightValues[0] ?? currentWeight;

  return {
    activityStreak: getCurrentStreak(weekDays, goal, safeCalorieGoal),
    averageCalories: Math.round(totalCalories / 7),
    averageWaterLiters: totalWater / 7 / 1000,
    averageWaterPercent: Math.round((totalWater / (waterGoalMl * 7)) * 100),
    calorieGoal: safeCalorieGoal,
    calorieValues,
    currentWeight,
    nutrients: [
      {
        color: '#16A34A',
        label: 'Protein',
        percent: getNutrientPercent(weekDays, 'proteins', proteinGoal),
      },
      {
        color: '#F59E0B',
        label: 'Carbs',
        percent: getNutrientPercent(weekDays, 'carbs', carbsGoal),
      },
      {
        color: '#2563EB',
        label: 'Fats',
        percent: getNutrientPercent(weekDays, 'fats', fatsGoal),
      },
    ] satisfies NutrientItem[],
    targetWeight: profileWeight,
    weekDays: weekDays.map((item) => ({
      ...item,
      status: getWeekDayStatus(item, goal, safeCalorieGoal),
    })),
    weightDelta: currentWeight - firstWeight,
    weightValues,
  };
}

function buildWeekDays(weeklyLogs: DailyLog[]): WeekDayMetric[] {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const logsByDate = new Map(weeklyLogs.map((log) => [log.logDate, log]));

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const dateKey = formatDate(date);

    return {
      date: dateKey,
      log: logsByDate.get(dateKey) ?? null,
    };
  });
}

function buildWeightValues(weekDays: WeekDayMetric[], profileWeight: number) {
  let lastWeight = profileWeight;

  return weekDays.map((item) => {
    if (item.log?.currentWeight) {
      lastWeight = item.log.currentWeight;
    }

    return lastWeight;
  });
}

function getCurrentStreak(weekDays: WeekDayMetric[], goal: ProgressScreenProps['goal'], calorieGoal: number) {
  const todayKey = formatDate(new Date());
  const todayIndex = Math.max(
    0,
    weekDays.findIndex((item) => item.date === todayKey),
  );
  let streak = 0;

  for (let index = todayIndex; index >= 0; index -= 1) {
    if (!isGoalCompleted(weekDays[index].log?.calories ?? null, goal, calorieGoal)) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function getWeekDayStatus(
  day: WeekDayMetric,
  goal: ProgressScreenProps['goal'],
  calorieGoal: number,
): 'completed' | 'missed' | 'pending' {
  const todayKey = formatDate(new Date());

  if (day.date > todayKey || !day.log) {
    return 'pending';
  }

  return isGoalCompleted(day.log.calories, goal, calorieGoal) ? 'completed' : 'missed';
}

function isGoalCompleted(
  calories: number | null,
  goal: ProgressScreenProps['goal'],
  calorieGoal: number,
) {
  if (calories === null) {
    return false;
  }

  if (goal === 'gain_muscle') {
    return calories >= calorieGoal;
  }

  if (goal === 'healthy_lifestyle') {
    return calories >= calorieGoal * 0.8 && calories <= calorieGoal * 1.2;
  }

  return calories <= calorieGoal;
}

function getNutrientPercent(weekDays: WeekDayMetric[], key: 'proteins' | 'carbs' | 'fats', dailyGoal: number) {
  const goal = Math.max(dailyGoal, 1);
  const weeklyTotal = weekDays.reduce((sum, item) => sum + (item.log?.[key] ?? 0), 0);

  return Math.round((weeklyTotal / (goal * 7)) * 100);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  return addDays(date, -((date.getDay() + 6) % 7));
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  activityBackgroundIcon: {
    bottom: 26,
    opacity: 1,
    position: 'absolute',
    right: 20,
  },
  activityBar: {
    backgroundColor: '#CBD9F3',
    borderRadius: 999,
    flex: 1,
    height: 6,
  },
  activityBarCompleted: {
    backgroundColor: '#16A34A',
  },
  activityBarMissed: {
    backgroundColor: '#DC2626',
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
    color: colors.accent,
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
    fontSize: 16,
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
  weekLabel: {
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
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
