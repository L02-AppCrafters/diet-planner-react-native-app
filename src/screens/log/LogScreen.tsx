import { useEffect, useMemo, useRef } from 'react';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { DailyLog, MealPlan, Recipe } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const logBreakfastImage = require('../../../assets/log-breakfast-new.png');
const logLunchImage = require('../../../assets/log-lunch-new.png');
const logDinnerImage = require('../../../assets/log-dinner-new.png');
const dateCardStep = 84;
const hydrationGoalLiters = 2.5;
const hydrationCupLiters = 0.5;

const nutritionColors = {
  CALS: '#006C49',
  CARBS: '#F59E0B',
  FAT: '#3B82F6',
  PROTEIN: '#006C49',
} as const;

const font = {
  medium: { fontFamily: fontFamily.medium, fontWeight: undefined },
  semiBold: { fontFamily: fontFamily.semiBold, fontWeight: undefined },
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  black: { fontFamily: fontFamily.black, fontWeight: undefined },
  manropeBold: { fontFamily: fontFamily.manropeBold, fontWeight: undefined },
  manropeRegular: { fontFamily: fontFamily.manropeRegular, fontWeight: undefined },
  manropeExtraBold: { fontFamily: fontFamily.manropeExtraBold, fontWeight: undefined },
} as const;

type LogScreenProps = {
  calorieGoal: number;
  dailyLog: DailyLog | null;
  goal: 'lose_weight' | 'gain_muscle' | 'healthy_lifestyle' | string;
  mealPlans: MealPlan[];
  onAddSnack: () => void;
  onOpenRecipe: (recipe: NonNullable<MealPlan['recipe']>) => void;
  onSelectDate: (date: string) => void | Promise<void>;
  selectedDate: string;
};

export function LogScreen({
  calorieGoal,
  dailyLog,
  goal,
  mealPlans,
  onAddSnack,
  onOpenRecipe,
  onSelectDate,
  selectedDate,
}: LogScreenProps) {
  const dateScrollRef = useRef<ScrollView>(null);
  const dateCards = useMemo(() => buildDateCards(selectedDate), [selectedDate]);
  const visibleMealPlans = mealPlans.slice().sort(sortMealPlans);
  const normalizedCalorieGoal = Math.max(calorieGoal, 1);
  const calories = dailyLog?.calories ?? 0;
  const plannedPercent = Math.round((Math.max(calories, 0) / normalizedCalorieGoal) * 100);
  const plannedFillPercent = Math.min(plannedPercent, 100);
  const isOverLimit =
    (goal === 'lose_weight' && calories > normalizedCalorieGoal) ||
    (goal === 'healthy_lifestyle' && calories > normalizedCalorieGoal * 1.2);
  const energyActiveColor = isOverLimit ? '#DC2626' : colors.primaryMid;

  useEffect(() => {
    const activeIndex = dateCards.findIndex((item) => item.active);
    if (activeIndex >= 0) {
      requestAnimationFrame(() => {
        dateScrollRef.current?.scrollTo({ animated: false, x: Math.max(0, activeIndex * dateCardStep - 24) });
      });
    }
  }, [dateCards]);

  return (
    <View style={styles.logContent}>
      <View style={styles.energyCard}>
        <Text style={styles.energyLabel}>Energy Budget</Text>
        <View style={styles.energyRow}>
          <Text style={[styles.energyValue, isOverLimit && styles.energyValueOver]}>{calories.toLocaleString()}</Text>
          <Text style={styles.energyGoal}>/ {normalizedCalorieGoal.toLocaleString()}</Text>
        </View>
        <View style={styles.energyMetaRow}>
          <Text style={styles.energyUnit}>kcal</Text>
          <Text style={[styles.plannedBadge, isOverLimit && styles.plannedBadgeOver]}>{plannedPercent}% Planned</Text>
        </View>
        <View style={styles.energyTrack}>
          <View style={[styles.energyFill, { backgroundColor: energyActiveColor, width: `${plannedFillPercent}%` }]} />
        </View>
      </View>

      <View style={styles.optimizationCard}>
        <Text style={styles.optimizationTitle}>AI Optimization</Text>
        <Text style={styles.optimizationCopy}>
          Your plan is low in Fiber today. We suggest adding Chia Seeds to your afternoon snack.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.datePickerContent}
        horizontal
        ref={dateScrollRef}
        showsHorizontalScrollIndicator={false}
        style={styles.datePicker}
      >
        {dateCards.map(({ active, date, day, isoDate }) => {
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={isoDate}
              onPress={() => onSelectDate(isoDate)}
              style={[styles.dateCard, active && styles.dateCardActive]}
            >
              <Text style={[styles.dateDay, active && styles.dateTextActive]}>{day}</Text>
              <Text style={[styles.dateNumber, active && styles.dateTextActive]}>{date}</Text>
              {active ? <View style={styles.dateDot} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable accessibilityRole="button" onPress={onAddSnack} style={styles.addSnackCard}>
        <View style={styles.addSnackCircle}>
          <SvgIcon height={14} source={svgIcons.add} width={14} />
        </View>
        <Text style={styles.addSnackTitle}>Add Snack</Text>
        <Text style={styles.addSnackCopy}>Keep your metabolism active</Text>
      </Pressable>

      {visibleMealPlans.map((mealPlan) => {
        const card = buildMealLogCard(mealPlan);
        const detailRecipe = buildMealPlanDetailRecipe(mealPlan);

        return (
          <MealLogCard
            key={mealPlan.id}
            {...card}
            onPress={detailRecipe ? () => onOpenRecipe(detailRecipe) : undefined}
          />
        );
      })}

      <HydrationLogCard waterMl={dailyLog?.waterMl ?? 0} />
    </View>
  );
}

type MealLogCardProps = {
  description: string;
  iconBg: string;
  iconHeight: number;
  iconSource: string;
  iconWidth: number;
  image: ImageSourcePropType;
  macros: Array<{ label: string; value: string }>;
  onPress?: () => void;
  time: string;
  title: string;
  type: string;
};

function MealLogCard({
  description,
  iconBg,
  iconHeight,
  iconSource,
  iconWidth,
  image,
  macros,
  onPress,
  time,
  title,
  type,
}: MealLogCardProps) {
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} disabled={!onPress} onPress={onPress} style={styles.dinnerCard}>
      <View style={styles.dinnerImageFrame}>
        <Image source={image} style={styles.dinnerImage} />
      </View>
      <View style={styles.logMealHeader}>
        <View style={[styles.mealIconCircle, { backgroundColor: iconBg }]}>
          <SvgIcon height={iconHeight} source={iconSource} width={iconWidth} />
        </View>
        <Text style={styles.dinnerMealType}>{type}</Text>
        <Text style={styles.timeBadge}>{time}</Text>
      </View>
      <Text style={styles.dinnerTitle}>{title}</Text>
      <Text style={styles.dinnerCopy}>{description}</Text>
      <View style={styles.dinnerMacroRow}>
        {macros.map((macro) => (
          <DinnerMacro key={macro.label} label={macro.label} value={macro.value} />
        ))}
      </View>
    </Pressable>
  );
}

function DinnerMacro({ label, value }: { label: string; value: string }) {
  const color = nutritionColors[label as keyof typeof nutritionColors] ?? colors.primary;

  return (
    <View style={styles.dinnerMacro}>
      <Text style={[styles.dinnerMacroLabel, { color }]}>{label}</Text>
      <Text style={[styles.dinnerMacroValue, { color }]}>{value}</Text>
    </View>
  );
}

function HydrationLogCard({ waterMl }: { waterMl: number }) {
  const consumedLiters = Math.min(waterMl / 1000, hydrationGoalLiters);
  const activeDots = Math.round(consumedLiters / hydrationCupLiters);

  return (
    <View style={styles.hydrationCard}>
      <View style={styles.logMealHeader}>
        <View style={[styles.mealIconCircle, { backgroundColor: '#BFDAFF' }]}>
          <SvgIcon color="#1D7BE3" height={15} source={svgIcons.water} width={12} />
        </View>
        <Text style={styles.hydrationTitle}>Hydration</Text>
      </View>
      <Text style={styles.hydrationValue}>
        {consumedLiters.toFixed(1)} <Text style={styles.hydrationGoal}>/ {hydrationGoalLiters.toFixed(1)}L</Text>
      </Text>
      <View style={styles.hydrationDots}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={[styles.hydrationDot, item <= activeDots && styles.hydrationDotActive]} />
        ))}
      </View>
    </View>
  );
}

function buildMealLogCard(mealPlan: MealPlan): MealLogCardProps {
  const recipe = mealPlan.recipe;
  const food = mealPlan.foodNutrition;
  const snapshotJson = mealPlan.snapshotJsonData;
  const snapshotName = mealPlan.snapshotRecipeName;
  const snapshotImageUrl = mealPlan.snapshotImageUrl;
  const mealMeta = getMealMeta(mealPlan.mealType);
  const servings = Number(mealPlan.servings) || 1;
  const calories = Math.round(((snapshotJson?.calories ?? recipe?.jsonData.calories ?? food?.calories ?? 0) * servings));
  const proteins = Math.round(((snapshotJson?.proteins ?? recipe?.jsonData.proteins ?? food?.proteins ?? 0) * servings));
  const carbs = Math.round(((snapshotJson?.carbs ?? recipe?.jsonData.carbs ?? food?.carbohydrates ?? 0) * servings));
  const fats = Math.round(((snapshotJson?.fats ?? recipe?.jsonData.fats ?? food?.fats ?? 0) * servings));

  return {
    description:
      snapshotJson?.description ??
      recipe?.jsonData.description ??
      (food ? `${food.servingSize} serving from your nutrition database.` : 'Logged meal from your meal plan.'),
    iconBg: mealMeta.iconBg,
    iconHeight: mealMeta.iconHeight,
    iconSource: mealMeta.iconSource,
    iconWidth: mealMeta.iconWidth,
    image: snapshotImageUrl || recipe?.imageUrl || food?.imageUrl ? { uri: snapshotImageUrl ?? recipe?.imageUrl ?? food?.imageUrl ?? '' } : mealMeta.fallbackImage,
    macros: [
      { label: 'CALS', value: String(calories) },
      { label: 'PROTEIN', value: `${proteins}g` },
      { label: 'CARBS', value: `${carbs}g` },
      { label: 'FAT', value: `${fats}g` },
    ],
    time: formatTime(mealPlan.createdAt),
    title: snapshotJson?.recipeName ?? snapshotName ?? recipe?.jsonData.recipeName ?? recipe?.recipeName ?? food?.name ?? 'Logged Meal',
    type: titleCase(mealPlan.mealType),
  };
}

function buildMealPlanDetailRecipe(mealPlan: MealPlan): Recipe | null {
  if (mealPlan.recipe) {
    return mealPlan.recipe;
  }

  if (!mealPlan.snapshotJsonData || !mealPlan.snapshotRecipeName || !mealPlan.snapshotImageUrl) {
    return null;
  }

  return {
    createdAt: mealPlan.createdAt,
    id: mealPlan.recipeId ?? mealPlan.id,
    imageUrl: mealPlan.snapshotImageUrl,
    isDeletedFromRecipes: true,
    isDefault: true,
    jsonData: mealPlan.snapshotJsonData,
    recipeName: mealPlan.snapshotJsonData.recipeName ?? mealPlan.snapshotRecipeName,
    uid: null,
    updatedAt: mealPlan.updatedAt,
  };
}

function getMealMeta(mealType: MealPlan['mealType']) {
  const meta = {
    breakfast: {
      fallbackImage: logBreakfastImage,
      iconBg: '#FFF0DC',
      iconHeight: 17,
      iconSource: svgIcons.breakfast,
      iconWidth: 17,
      order: 0,
    },
    lunch: {
      fallbackImage: logLunchImage,
      iconBg: '#D8FFE9',
      iconHeight: 15,
      iconSource: svgIcons.lunch,
      iconWidth: 12,
      order: 1,
    },
    dinner: {
      fallbackImage: logDinnerImage,
      iconBg: '#E2E1FF',
      iconHeight: 15,
      iconSource: svgIcons.dinner,
      iconWidth: 17,
      order: 2,
    },
    snack: {
      fallbackImage: logLunchImage,
      iconBg: '#EAF1FF',
      iconHeight: 16,
      iconSource: svgIcons.restaurants,
      iconWidth: 12,
      order: 3,
    },
  } as const;

  return meta[mealType] ?? meta.snack;
}

function sortMealPlans(a: MealPlan, b: MealPlan) {
  const mealOrder = getMealMeta(a.mealType).order - getMealMeta(b.mealType).order;

  if (mealOrder !== 0) {
    return mealOrder;
  }

  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function buildDateCards(selectedDate: string) {
  const activeDate = parseLocalDate(selectedDate);
  const mondayOffset = (activeDate.getDay() + 6) % 7;
  const weekStart = addDays(activeDate, -mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const isoDate = formatDate(date);

    return {
      active: isoDate === selectedDate,
      date: String(date.getDate()).padStart(2, '0'),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      isoDate,
    };
  });
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

const styles = StyleSheet.create({
  addSnackCard: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderColor: '#DCE4F5',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 210,
    justifyContent: 'center',
    marginTop: 24,
  },
  addSnackCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  addSnackCopy: {
    color: colors.inkSoft,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontWeight: undefined,
    marginTop: spacing.xs,
  },
  addSnackTitle: {
    color: colors.inkMuted,
    ...font.manropeBold,
    fontSize: 16,
    marginTop: spacing.md,
  },
  dateCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    height: 95,
    justifyContent: 'center',
    width: 68,
  },
  dateCardActive: {
    backgroundColor: colors.primaryMid,
    height: 118,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    width: 88,
  },
  dateDay: {
    color: colors.inkSoft,
    ...font.bold,
    fontSize: 11,
    letterSpacing: 1,
  },
  dateDot: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 5,
    marginTop: spacing.md,
    width: 5,
  },
  dateNumber: {
    color: '#708095',
    ...font.bold,
    fontSize: 18,
    marginTop: spacing.md,
  },
  datePicker: {
    marginTop: 34,
  },
  datePickerContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  dateTextActive: {
    color: colors.surface,
  },
  dinnerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginTop: 24,
    padding: 20,
  },
  dinnerCopy: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: undefined,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  dinnerImage: {
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  dinnerImageFrame: {
    alignItems: 'center',
    backgroundColor: '#EEF2F7',
    borderRadius: 12,
    height: 160,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  dinnerMacro: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    minWidth: 58,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  dinnerMacroLabel: {
    color: colors.inkSoft,
    ...font.bold,
    fontSize: 10,
    letterSpacing: 1,
  },
  dinnerMacroRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  dinnerMacroValue: {
    color: colors.primary,
    ...font.bold,
    fontSize: 16,
    marginTop: spacing.xxs,
  },
  dinnerMealType: {
    color: colors.ink,
    ...font.manropeBold,
    flex: 1,
    fontSize: 18,
  },
  dinnerTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 20,
    marginTop: spacing.lg,
  },
  energyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
  },
  energyFill: {
    backgroundColor: colors.primaryMid,
    borderRadius: 999,
    height: '100%',
    width: '67%',
  },
  energyGoal: {
    color: colors.inkSoft,
    ...font.manropeRegular,
    fontSize: 18,
    marginLeft: spacing.sm,
    marginTop: 12,
  },
  energyLabel: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 14,
  },
  energyMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  energyRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  energyTrack: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    height: 10,
    marginTop: spacing.xl,
    overflow: 'hidden',
  },
  energyUnit: {
    color: colors.inkSoft,
    ...font.manropeRegular,
    fontSize: 18,
  },
  energyValue: {
    color: colors.primary,
    ...font.manropeExtraBold,
    fontSize: 36,
    lineHeight: 42,
  },
  energyValueOver: {
    color: '#DC2626',
  },
  hydrationCard: {
    backgroundColor: '#EAF1FF',
    borderColor: '#D8E5FF',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 24,
    padding: 20,
  },
  hydrationDot: {
    backgroundColor: '#BBD3F3',
    borderRadius: 999,
    height: 30,
    width: 13,
  },
  hydrationDotActive: {
    backgroundColor: colors.accent,
  },
  hydrationDots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  hydrationGoal: {
    color: colors.inkSoft,
    ...font.manropeRegular,
    fontSize: 18,
  },
  hydrationTitle: {
    color: colors.ink,
    ...font.manropeBold,
    flex: 1,
    fontSize: 18,
  },
  hydrationValue: {
    color: colors.accent,
    ...font.manropeExtraBold,
    fontSize: 30,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  logContent: {
    paddingTop: spacing.lg,
  },
  logMealHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  mealIconCircle: {
    alignItems: 'center',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 28,
  },
  optimizationCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    marginTop: 24,
    minHeight: 140,
    overflow: 'hidden',
    padding: 28,
  },
  optimizationCopy: {
    color: '#D5F2E7',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: undefined,
    lineHeight: 22,
    marginTop: spacing.sm,
    maxWidth: 255,
  },
  optimizationTitle: {
    color: colors.surface,
    ...font.manropeBold,
    fontSize: 18,
  },
  plannedBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    color: colors.primary,
    ...font.bold,
    fontSize: 14,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  plannedBadgeOver: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
  },
  timeBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 12,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
