import { useRef, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { AddSnackScreen } from '../log/AddSnackScreen';
import { FoodNutritionDetail, FoodNutritionHeader } from '../log/FoodNutritionDetail';
import { LogScreen } from '../log/LogScreen';
import { MainIngredientsScreen } from '../log/MainIngredientsScreen';
import { ProgressScreen } from '../progress/ProgressScreen';
import { RecipesScreen } from '../recipes/RecipesScreen';
import { EditRecipeScreen } from '../recipes/EditRecipeScreen';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';
import { AppTab } from '../../types/navigation';
import { DailyLog, MealPlan, Recipe } from '../../services/api';

const lunchImage = require('../../../assets/lunch.png');
const waterGoalLiters = 2.5;
const waterCupLiters = 0.5;
const waterCups = Array.from({ length: waterGoalLiters / waterCupLiters }, (_, index) => index);
const nutritionColors = {
  CALS: '#006C49',
  FAT: '#F59E0B',
  PROTEIN: '#3B82F6',
} as const;
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
  black: {
    fontFamily: fontFamily.black,
    fontWeight: undefined,
  },
  manropeBold: {
    fontFamily: fontFamily.manropeBold,
    fontWeight: undefined,
  },
  manropeRegular: {
    fontFamily: fontFamily.manropeRegular,
    fontWeight: undefined,
  },
  manropeExtraBold: {
    fontFamily: fontFamily.manropeExtraBold,
    fontWeight: undefined,
  },
} as const;

type HomeScreenProps = {
  activeTab: AppTab;
  dailyLog: DailyLog | null;
  mealPlans: MealPlan[];
  metrics: HomeMetrics;
  onAddRecipeToLog: (recipe: Recipe, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => Promise<void>;
  onAddWater: () => void | Promise<void>;
  onDeleteRecipe: (recipe: Recipe) => Promise<void>;
  onSelectLogDate: (date: string) => void | Promise<void>;
  onUpdateRecipe: (recipe: Recipe) => Promise<Recipe>;
  recipes: Recipe[];
  selectedLogDate: string;
  onTabChange: (tab: AppTab) => void;
  onOpenSettings?: () => void;
  profileWeight: number;
  weeklyLogs: DailyLog[];
  weeklyMealPlans: MealPlan[];
};

export type HomeMetrics = {
  carbs: number;
  carbsGoal: number;
  calories: number;
  calorieGoal: number;
  fats: number;
  fatsGoal: number;
  proteins: number;
  proteinGoal: number;
  waterMl: number;
  weeklyCalories: Array<{ calories: number; day: string; isToday: boolean }>;
};

type CalorieSummary = {
  consumed: number;
  goal: number;
};

const tabs: Array<{ key: AppTab; icon: string; iconHeight: number; iconWidth: number }> = [
  { key: 'Home', icon: svgIcons.home, iconHeight: 18, iconWidth: 16 },
  { key: 'Log', icon: svgIcons.log, iconHeight: 20, iconWidth: 20 },
  { key: 'Recipes', icon: svgIcons.recipes, iconHeight: 18, iconWidth: 18 },
  { key: 'Progress', icon: svgIcons.progress, iconHeight: 17, iconWidth: 22 },
];

function getCalorieRingMetrics(summary: CalorieSummary) {
  const goal = Math.max(summary.goal, 1);
  const consumed = Math.max(summary.consumed, 0);
  const consumedProgress = consumed / goal;

  return {
    consumed,
    consumedPercent: Math.round(consumedProgress * 100),
    ringProgress: Math.min(consumedProgress, 1),
  };
}

export function HomeScreen({
  activeTab,
  dailyLog,
  mealPlans,
  metrics,
  onAddRecipeToLog,
  onAddWater,
  onDeleteRecipe,
  onOpenSettings,
  onSelectLogDate,
  onTabChange,
  onUpdateRecipe,
  profileWeight,
  recipes,
  selectedLogDate,
  weeklyLogs,
  weeklyMealPlans,
}: HomeScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [logRoute, setLogRoute] = useState<'log' | 'addSnack' | 'mainIngredients' | 'foodNutritionDetail'>('log');
  const [recipeRoute, setRecipeRoute] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const scrollToTop = () => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ animated: false, y: 0 });
    });
  };
  const logRecipeAndReturnToPlan = async (recipe: Recipe, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    await onAddRecipeToLog(recipe, mealType);
    setSelectedRecipe(null);
    setLogRoute('log');
    onTabChange('Log');
    scrollToTop();
  };
  const logMealAndReturnToPlan = async (mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    if (selectedRecipe && mealType) {
      await logRecipeAndReturnToPlan(selectedRecipe, mealType);
      return;
    }
    setSelectedRecipe(null);
    setLogRoute('log');
    onTabChange('Log');
    scrollToTop();
  };
  const openRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeRoute('detail');
    scrollToTop();
  };
  const isAddSnack = activeTab === 'Log' && logRoute === 'addSnack';
  const isMainIngredients = activeTab === 'Log' && logRoute === 'mainIngredients';
  const isFoodNutritionDetail = activeTab === 'Log' && logRoute === 'foodNutritionDetail';
  const isRecipeNutritionDetail = activeTab === 'Recipes' && recipeRoute === 'detail' && selectedRecipe !== null;
  const isEditRecipe = activeTab === 'Recipes' && recipeRoute === 'edit' && selectedRecipe !== null;
  const isNutritionDetail = isFoodNutritionDetail || isRecipeNutritionDetail;
  const headerTitle =
    isMainIngredients
      ? 'Main Ingredients'
      : isFoodNutritionDetail
      ? 'Food Nutrition Detail'
      : isAddSnack
      ? 'Add Snack'
      : activeTab === 'Log'
        ? 'Weekly Plan'
        : activeTab === 'Recipes'
          ? 'Recipes'
          : activeTab === 'Progress'
            ? 'Analytics'
            : 'Nutri Planner';

  return (
    <View style={styles.viewport}>
      <View style={styles.phone}>
        {isNutritionDetail ? (
          <FoodNutritionHeader
            onBack={() => {
              if (isRecipeNutritionDetail) {
                setSelectedRecipe(null);
                setRecipeRoute('list');
                return;
              }

              setLogRoute('addSnack');
            }}
            title={isRecipeNutritionDetail ? 'Recipes: Nutrition Detail' : 'Food Nutrition Detail'}
          />
        ) : (
          <Header
            onBack={isMainIngredients ? () => setLogRoute('addSnack') : isAddSnack ? () => setLogRoute('log') : undefined}
            onOpenSettings={onOpenSettings}
            title={headerTitle}
          />
        )}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, isNutritionDetail && styles.detailScrollContent]}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'Home' ? <HomeContent metrics={metrics} onAddWater={onAddWater} /> : null}
          {activeTab === 'Log' && logRoute === 'log' ? (
            <LogScreen
              calorieGoal={metrics.calorieGoal}
              dailyLog={dailyLog}
              mealPlans={mealPlans}
              onAddSnack={() => setLogRoute('addSnack')}
              onOpenRecipe={(recipe) => {
                setSelectedRecipe(recipe);
                setRecipeRoute('detail');
                onTabChange('Recipes');
                scrollToTop();
              }}
              onSelectDate={onSelectLogDate}
              selectedDate={selectedLogDate}
            />
          ) : null}
          {isAddSnack ? (
            <AddSnackScreen
              onLogMeal={logMealAndReturnToPlan}
              onOpenDetail={() => {
                setSelectedRecipe(null);
                setLogRoute('foodNutritionDetail');
                scrollToTop();
              }}
              onQuickLogRecipe={async (recipe, mealType) => {
                await logRecipeAndReturnToPlan(recipe, mealType);
              }}
              recentMealPlans={weeklyMealPlans}
            />
          ) : null}
          {isMainIngredients ? <MainIngredientsScreen /> : null}
          {isFoodNutritionDetail ? (
            <FoodNutritionDetail
              onAddToLog={logMealAndReturnToPlan}
              recipe={selectedRecipe ?? undefined}
            />
          ) : null}
          {isRecipeNutritionDetail ? (
            <FoodNutritionDetail
              onAddToLog={logMealAndReturnToPlan}
              onDeleteRecipe={async () => {
                if (!selectedRecipe) return;
                await onDeleteRecipe(selectedRecipe);
                setSelectedRecipe(null);
                setRecipeRoute('list');
              }}
              onEditRecipe={() => setRecipeRoute('edit')}
              recipe={selectedRecipe}
            />
          ) : null}
          {isEditRecipe && selectedRecipe ? (
            <EditRecipeScreen
              onCancel={() => setRecipeRoute('detail')}
              onSave={async (recipe) => {
                const updatedRecipe = await onUpdateRecipe(recipe);
                setSelectedRecipe(updatedRecipe);
                setRecipeRoute('detail');
              }}
              recipe={selectedRecipe}
            />
          ) : null}
          {activeTab === 'Recipes' && !isRecipeNutritionDetail && !isEditRecipe ? (
            <RecipesScreen onOpenRecipe={openRecipeDetail} recipes={recipes} />
          ) : null}
          {activeTab === 'Progress' ? (
            <ProgressScreen
              calorieGoal={metrics.calorieGoal}
              carbsGoal={metrics.carbsGoal}
              fatsGoal={metrics.fatsGoal}
              profileWeight={profileWeight}
              proteinGoal={metrics.proteinGoal}
              weeklyLogs={weeklyLogs}
            />
          ) : null}
        </ScrollView>
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedRecipe(null);
            setRecipeRoute('list');
            if (tab !== 'Log') {
              setLogRoute('log');
            }
            onTabChange(tab);
          }}
        />
      </View>
    </View>
  );
}

function Header({
  onBack,
  title,
  onOpenSettings,
}: {
  onBack?: () => void;
  title: string;
  onOpenSettings?: () => void;
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable accessibilityLabel="Back to Log Page" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      ) : null}
      {!onBack ? (
        <View style={styles.avatar}>
          <View style={styles.avatarHead} />
          <View style={styles.avatarBody} />
        </View>
      ) : null}
      <Text style={styles.logo}>{title}</Text>
      <Pressable accessibilityLabel="Open settings" onPress={onOpenSettings} style={styles.gearButton}>
        <SvgIcon height={20} source={svgIcons.settings} width={21} />
      </Pressable>
    </View>
  );
}

function HomeContent({ metrics, onAddWater }: { metrics: HomeMetrics; onAddWater: () => void | Promise<void> }) {
  const calorieGoal = Math.max(metrics.calorieGoal, 1);
  const macroItems = [
    { label: 'CALORIES', value: metrics.calories, target: calorieGoal, color: '#006C49', suffix: '' },
    { label: 'PROTEIN', value: metrics.proteins, target: metrics.proteinGoal, color: '#3B82F6', suffix: 'g' },
    { label: 'CARBS', value: metrics.carbs, target: metrics.carbsGoal, color: '#8B5CF6', suffix: 'g' },
    { label: 'FATS', value: metrics.fats, target: metrics.fatsGoal, color: '#F59E0B', suffix: 'g' },
  ];

  return (
    <>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Fuel your <Text style={styles.heroAccent}>Potential.</Text>
        </Text>
        <Text style={styles.heroCopy}>
          You've consumed {metrics.calories.toLocaleString()} kcal today.{'\n'}Stay on track for your{' '}
          {calorieGoal.toLocaleString()} kcal daily{'\n'}goal.
        </Text>
      </View>

      <View style={styles.macroRow}>
        {macroItems.map((macro) => (
          <View key={macro.label} style={styles.macroCard}>
            <Text style={styles.macroLabel}>{macro.label}</Text>
            <View style={styles.macroTrack}>
              <View
                style={[
                  styles.macroFill,
                  {
                    backgroundColor: macro.color,
                    width: `${Math.min(macro.value / Math.max(macro.target, 1), 1) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.macroValue}>
              {macro.value}
              {macro.suffix} /
            </Text>
            <Text style={styles.macroValue}>
              {macro.target}
              {macro.suffix}
            </Text>
          </View>
        ))}
      </View>

      <CalorieRing summary={{ consumed: metrics.calories, goal: calorieGoal }} />
      <WaterTrackerCard onAddWater={onAddWater} waterMl={metrics.waterMl} />
      <MealCard />
      <InsightCard />
      <WeeklyOverview calorieGoal={calorieGoal} weeklyCalories={metrics.weeklyCalories} />
    </>
  );
}

function CalorieRing({ summary }: { summary: CalorieSummary }) {
  const size = 270;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const { consumed, consumedPercent, ringProgress } = getCalorieRingMetrics(summary);
  const strokeDashoffset = circumference * (1 - ringProgress);

  return (
    <View style={styles.ringWrap}>
      <Svg height={size} style={styles.ringSvg} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke="#EDF1FF"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          originX={size / 2}
          originY={size / 2}
          r={radius}
          rotation="-90"
          stroke={colors.primaryMid}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={styles.ringNumber}>{consumed.toLocaleString()}</Text>
        <Text style={styles.ringLabel}>KCAL EATEN</Text>
        <Text style={styles.ringPercent}>{consumedPercent}% consumed</Text>
      </View>
    </View>
  );
}

function WaterTrackerCard({ onAddWater, waterMl }: { onAddWater: () => void | Promise<void>; waterMl: number }) {
  const waterConsumedLiters = waterMl / 1000;
  const isGoalReached = waterMl >= waterGoalLiters * 1000;

  return (
    <View style={styles.waterCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Water Tracker</Text>
          <Text style={styles.cardSubtitle}>Stay hydrated, stay sharp</Text>
        </View>
        <SvgIcon height={25} source={svgIcons.water} width={20} />
      </View>
      <View style={styles.waterGrid}>
        {waterCups.map((cup) => {
          const fillLevel = Math.max(
            0,
            Math.min((waterConsumedLiters - cup * waterCupLiters) / waterCupLiters, 1),
          );

          return <WaterCup fillLevel={fillLevel} key={cup} />;
        })}
      </View>
      <View style={styles.waterFooter}>
        <Text style={styles.waterAmount}>
          {waterConsumedLiters.toFixed(1)}L / {waterGoalLiters.toFixed(1)}L
        </Text>
        <Pressable
          accessibilityLabel="Add 0.5 liters of water"
          accessibilityState={{ disabled: isGoalReached }}
          disabled={isGoalReached}
          onPress={onAddWater}
          style={[styles.addWaterButton, isGoalReached && styles.addWaterButtonDisabled]}
        >
          <Text style={styles.addWaterText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function WaterCup({ fillLevel }: { fillLevel: number }) {
  return (
    <View style={styles.cup}>
      <View style={[styles.cupFill, { height: `${fillLevel * 100}%` }]} />
    </View>
  );
}

function MealCard() {
  return (
    <View style={styles.mealCard}>
      <ImageBackground source={lunchImage} resizeMode="cover" style={styles.mealImage}>
        <View style={styles.mealShade} />
        <Text style={styles.mealType}>Lunch</Text>
      </ImageBackground>
      <View style={styles.mealBody}>
        <View style={styles.mealTitleRow}>
          <Text numberOfLines={1} style={styles.mealTitle}>
            Grilled Chicken Salad
          </Text>
          <Text style={styles.mealCalories}>420 kcal</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={[styles.nutritionPill, { color: nutritionColors.PROTEIN }]}>P: 35G</Text>
          <Text style={[styles.nutritionPill, { color: nutritionColors.FAT }]}>F: 18G</Text>
        </View>
      </View>
    </View>
  );
}

function InsightCard() {
  return (
    <View style={styles.insightCard}>
      <View style={styles.insightRail} />
      <View style={styles.insightInner}>
        <View style={styles.insightHeadingRow}>
          <SvgIcon height={22} source={svgIcons.aiInsight} width={22} />
          <Text style={styles.insightHeading}>AI INSIGHT</Text>
        </View>
        <Text style={styles.insightText}>
          "Your protein intake is excellent today! Consider a light carb-focused snack before your workout to maintain
          peak energy levels."
        </Text>
        <View style={styles.divider} />
        <Pressable accessibilityLabel="View recommendations">
          <Text style={styles.recommendation}>View Recommendations →</Text>
        </Pressable>
      </View>
    </View>
  );
}

function WeeklyOverview({
  calorieGoal,
  weeklyCalories,
}: {
  calorieGoal: number;
  weeklyCalories: HomeMetrics['weeklyCalories'];
}) {
  const maxWeeklyCalories = Math.max(calorieGoal, 1);
  const chartHeight = 132;

  return (
    <View style={styles.weeklyCard}>
      <View style={styles.weeklyHeader}>
        <Text style={styles.weeklyTitle}>Weekly Overview</Text>
        <Text style={styles.more}>•••</Text>
      </View>
      <View style={styles.weeklyChart}>
        {weeklyCalories.map((item) => {
          const barHeight = item.calories === 0 ? 0 : Math.max(8, (item.calories / maxWeeklyCalories) * chartHeight);

          return (
            <View key={item.day} style={styles.weekColumn}>
              <Text style={[styles.weekValue, item.isToday && styles.weekValueActive]}>{item.calories}</Text>
              <View style={styles.weekBarTrack}>
                {barHeight > 0 ? (
                  <View style={[styles.weekBar, item.isToday && styles.weekBarActive, { height: barHeight }]} />
                ) : null}
              </View>
              <Text style={[styles.weekDay, item.isToday && styles.weekDayActive]}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function BottomNavigation({ activeTab, onTabChange }: Pick<HomeScreenProps, 'activeTab' | 'onTabChange'>) {
  return (
    <View style={styles.navShell}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[styles.navItem, isActive && styles.navItemActive]}
          >
            <SvgIcon
              color={isActive ? colors.primary : colors.inkSoft}
              height={tab.iconHeight}
              source={tab.icon}
              width={tab.iconWidth}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{tab.key}</Text>
          </Pressable>
        );
      })}
    </View>
  );
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
    fontWeight: undefined,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  addSnackTitle: {
    color: colors.inkMuted,
    ...font.manropeBold,
    fontSize: 16,
    marginTop: spacing.md,
  },
  addSnackPage: {
    paddingTop: spacing.xl,
  },
  addSnackRecommendationText: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 20,
    fontWeight: undefined,
    lineHeight: 30,
    marginTop: spacing.md,
  },
  addSnackRecommendationTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 22,
  },
  addSnackSectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 34,
  },
  addSnackSectionTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 26,
  },
  addWaterButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    width: 42,
  },
  addWaterButtonDisabled: {
    backgroundColor: colors.inkSoft,
    shadowOpacity: 0,
  },
  addWaterText: {
    color: colors.surface,
    ...font.medium,
    fontSize: 28,
    lineHeight: 32,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderColor: colors.primaryMid,
    borderRadius: 999,
    borderWidth: 3,
    height: 42,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 42,
  },
  avatarBody: {
    backgroundColor: '#F1E6D9',
    borderRadius: 5,
    height: 14,
    marginTop: 1,
    width: 18,
  },
  avatarHead: {
    backgroundColor: '#E2B48D',
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 28,
  },
  backIcon: {
    color: colors.primary,
    ...font.bold,
    fontSize: 34,
    lineHeight: 36,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardSubtitle: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontWeight: undefined,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  cardTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 20,
  },
  cup: {
    backgroundColor: colors.accentSoft,
    borderColor: '#DDE4F3',
    borderRadius: 15,
    borderWidth: 2,
    height: 56,
    overflow: 'hidden',
    width: 42,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
  discoverCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    height: 112,
    justifyContent: 'center',
    minWidth: 118,
    paddingHorizontal: spacing.lg,
  },
  discoverIcon: {
    color: colors.primary,
    ...font.bold,
    fontSize: 24,
  },
  discoverIconCircle: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 54,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 54,
  },
  discoverLabel: {
    color: colors.ink,
    ...font.bold,
    fontSize: 15,
  },
  discoverRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  discoverTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 24,
    marginTop: 34,
  },
  gearButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  cupFill: {
    backgroundColor: colors.accent,
    bottom: 0,
    position: 'absolute',
    width: '100%',
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
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginTop: 34,
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
  dinnerTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 20,
    marginTop: spacing.lg,
  },
  dinnerMealType: {
    color: colors.ink,
    ...font.manropeBold,
    flex: 1,
    fontSize: 18,
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
  header: {
    alignItems: 'center',
    backgroundColor: colors.header,
    flexDirection: 'row',
    height: 74,
    paddingHorizontal: 25,
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
  hero: {
    alignItems: 'center',
    paddingTop: 20,
  },
  heroAccent: {
    color: colors.primary,
  },
  heroCopy: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontWeight: undefined,
    fontSize: 18,
    lineHeight: 30,
    marginTop: 12,
    textAlign: 'center',
  },
  heroTitle: {
    color: colors.ink,
    ...font.manropeExtraBold,
    fontSize: 36,
    lineHeight: 43,
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: colors.surface,
    borderRadius: 27,
    flexDirection: 'row',
    marginTop: 28,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  insightHeading: {
    color: colors.primary,
    ...font.bold,
    fontSize: 14,
    letterSpacing: 2,
  },
  insightHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  insightInner: {
    flex: 1,
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  insightRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    width: 4,
  },
  insightText: {
    color: colors.ink,
    ...font.medium,
    fontSize: 16,
    lineHeight: 28,
    marginTop: spacing.md,
  },
  logo: {
    color: colors.primary,
    flex: 1,
    ...font.bold,
    fontSize: 20,
    marginLeft: spacing.md,
  },
  logContent: {
    paddingTop: spacing.lg,
  },
  logMealHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  macroCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 19,
    height: 123,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    width: 82,
  },
  macroFill: {
    borderRadius: 999,
    height: '100%',
  },
  macroLabel: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 40,
  },
  macroTrack: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    height: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
    width: 54,
  },
  macroValue: {
    color: colors.ink,
    ...font.bold,
    fontSize: 12,
    lineHeight: 18,
  },
  mealBody: {
    paddingHorizontal: 22,
    paddingVertical: 23,
  },
  mealCalories: {
    color: colors.primary,
    ...font.bold,
    fontSize: 16,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginTop: 26,
    overflow: 'hidden',
  },
  mealIconCircle: {
    alignItems: 'center',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 28,
  },
  mealIconText: {
    color: colors.primary,
    ...font.bold,
    fontSize: 14,
  },
  mealImage: {
    height: 132,
    justifyContent: 'flex-end',
  },
  mealShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  mealTitle: {
    color: colors.ink,
    flex: 1,
    ...font.bold,
    fontSize: 16,
  },
  mealTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  mealType: {
    color: colors.surface,
    ...font.bold,
    fontSize: 18,
    paddingBottom: 14,
    paddingLeft: 18,
  },
  more: {
    color: colors.inkMuted,
    ...font.black,
    fontSize: 22,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    minWidth: 74,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  navItemActive: {
    backgroundColor: colors.primarySoft,
  },
  navShell: {
    alignItems: 'center',
    backgroundColor: colors.nav,
    borderColor: '#E9F4EF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-around',
    left: 0,
    paddingHorizontal: 18,
    position: 'absolute',
    right: 0,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 26,
  },
  navText: {
    color: colors.inkSoft,
    ...font.semiBold,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  navTextActive: {
    color: colors.primary,
  },
  nutritionPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 10,
    minWidth: 76,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'center',
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 25,
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
    fontWeight: undefined,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.sm,
    maxWidth: 255,
  },
  optimizationTitle: {
    color: colors.surface,
    ...font.manropeBold,
    fontSize: 18,
  },
  phone: {
    backgroundColor: colors.background,
    flex: 1,
    maxWidth: 430,
    overflow: 'hidden',
    width: '100%',
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 28,
    marginTop: 42,
    padding: 30,
  },
  placeholderCopy: {
    color: colors.inkMuted,
    ...font.medium,
    fontSize: 17,
    lineHeight: 25,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  placeholderTitle: {
    color: colors.primary,
    ...font.black,
    fontSize: 34,
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
  viewHistory: {
    color: colors.primary,
    ...font.bold,
    fontSize: 18,
  },
  recommendation: {
    color: colors.primary,
    ...font.bold,
    fontSize: 14,
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  ringLabel: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 14,
    letterSpacing: 2,
    marginTop: -2,
  },
  ringNumber: {
    color: colors.ink,
    ...font.bold,
    fontSize: 48,
    lineHeight: 56,
  },
  ringPercent: {
    color: colors.primary,
    ...font.black,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  ringSvg: {
    position: 'absolute',
  },
  ringWrap: {
    alignItems: 'center',
    height: 330,
    justifyContent: 'center',
    marginTop: 38,
  },
  recentAddButton: {
    alignItems: 'center',
    backgroundColor: '#A7EBCF',
    borderRadius: 999,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  recentAddText: {
    color: colors.primary,
    ...font.medium,
    fontSize: 34,
    lineHeight: 38,
  },
  recentCopy: {
    flex: 1,
    marginLeft: spacing.xl,
  },
  recentGrid: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  recentHeroCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: spacing.xl,
    overflow: 'hidden',
    padding: 20,
  },
  recentImage: {
    backgroundColor: colors.ink,
    borderRadius: 10,
    height: 76,
    width: 76,
  },
  recentMeta: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: undefined,
    marginTop: spacing.xs,
  },
  recentRail: {
    backgroundColor: colors.primary,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  recentTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 22,
  },
  recommendationCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 32,
    overflow: 'hidden',
  },
  recommendationInner: {
    flex: 1,
    padding: 28,
  },
  scrollContent: {
    paddingBottom: 132,
    paddingHorizontal: 25,
  },
  detailScrollContent: {
    paddingHorizontal: 0,
  },
  scanCard: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 16,
    height: 240,
    justifyContent: 'center',
    marginTop: 44,
    overflow: 'hidden',
  },
  scanIcon: {
    color: colors.surface,
    ...font.bold,
    fontSize: 28,
  },
  scanIconCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,30,36,0.52)',
  },
  scanSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: fontFamily.regular,
    fontSize: 17,
    fontWeight: undefined,
    marginTop: spacing.xs,
  },
  scanTitle: {
    color: colors.surface,
    ...font.bold,
    fontSize: 24,
    marginTop: spacing.xl,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    flexDirection: 'row',
    height: 70,
    paddingHorizontal: 24,
  },
  searchIcon: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 28,
    marginRight: spacing.md,
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 21,
    fontWeight: undefined,
  },
  segmented: {
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    flexDirection: 'row',
    marginTop: 24,
    padding: 5,
  },
  segmentItem: {
    alignItems: 'center',
    borderRadius: 11,
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    color: colors.inkMuted,
    ...font.medium,
    fontSize: 18,
  },
  segmentTextActive: {
    color: colors.primary,
    ...font.bold,
  },
  smallRecentButton: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  smallRecentButtonText: {
    color: colors.primary,
    ...font.bold,
    fontSize: 15,
  },
  smallRecentCalories: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: undefined,
    marginTop: spacing.xs,
  },
  smallRecentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    flex: 1,
    overflow: 'hidden',
    padding: 22,
  },
  smallRecentImage: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    height: 58,
    marginBottom: spacing.xl,
    width: 58,
  },
  smallRecentRail: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  smallRecentTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 18,
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
  viewport: {
    alignItems: 'center',
    backgroundColor: '#000000',
    flex: 1,
  },
  waterAmount: {
    color: colors.ink,
    ...font.black,
    fontSize: 19,
  },
  waterCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginTop: 10,
    padding: 24,
  },
  waterFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  waterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 26,
    width: 266,
  },
  weekDay: {
    color: colors.inkMuted,
    ...font.black,
    fontSize: 11,
  },
  weekDayActive: {
    color: colors.primary,
  },
  weekBar: {
    backgroundColor: '#C8D1E5',
    borderRadius: 999,
    bottom: 0,
    position: 'absolute',
    width: 18,
  },
  weekBarActive: {
    backgroundColor: colors.primaryMid,
    width: 22,
  },
  weekBarTrack: {
    alignItems: 'center',
    backgroundColor: '#F6F8FF',
    borderRadius: 999,
    height: 132,
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    overflow: 'hidden',
    width: 24,
  },
  weekColumn: {
    alignItems: 'center',
    flex: 1,
  },
  weekValue: {
    color: colors.inkSoft,
    ...font.bold,
    fontSize: 9,
  },
  weekValueActive: {
    color: colors.primary,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  weeklyCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 24,
    height: 304,
    marginTop: 28,
    paddingHorizontal: 28,
    paddingTop: 31,
  },
  weeklyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 20,
  },
});
