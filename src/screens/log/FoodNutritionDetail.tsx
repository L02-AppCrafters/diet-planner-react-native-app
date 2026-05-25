import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { Recipe } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const fallbackImage = require('../../../assets/pho-bo-background-image.png');

const font = {
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  medium: { fontFamily: fontFamily.medium, fontWeight: undefined },
  semiBold: { fontFamily: fontFamily.semiBold, fontWeight: undefined },
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
} as const;

const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
type MealOption = (typeof mealOptions)[number];

type FoodNutritionDetailProps = {
  onAddToLog?: (mealType: MealOption) => void;
  onDeleteRecipe?: () => void;
  onEditRecipe?: () => void;
  recipe?: Recipe;
};

export function FoodNutritionDetail({ onAddToLog, onDeleteRecipe, onEditRecipe, recipe }: FoodNutritionDetailProps) {
  const [currentMeal] = useState<MealOption>(() => getCurrentMealOption(new Date()));
  const [selectedMeal, setSelectedMeal] = useState<MealOption>(currentMeal);
  const [isMealDropdownOpen, setIsMealDropdownOpen] = useState(false);
  const detail = buildRecipeDetail(recipe);
  const mealLabel = formatMealLabel(selectedMeal, currentMeal);
  const isUserRecipe = Boolean(recipe && !recipe.isDefault && recipe.uid);
  const isRecipeDeleted = Boolean(recipe?.isDeletedFromRecipes);
  const [isAddingToLog, setIsAddingToLog] = useState(false);
  const [isSubmittingQuickAction, setIsSubmittingQuickAction] = useState(false);

  const handleEditPress = async () => {
    if (!onEditRecipe || isSubmittingQuickAction || isRecipeDeleted) {
      return;
    }
    setIsSubmittingQuickAction(true);
    try {
      await Promise.resolve(onEditRecipe());
    } finally {
      setIsSubmittingQuickAction(false);
    }
  };

  const handleDeletePress = async () => {
    if (!onDeleteRecipe || isSubmittingQuickAction || isRecipeDeleted) {
      return;
    }
    setIsSubmittingQuickAction(true);
    try {
      await Promise.resolve(onDeleteRecipe());
    } finally {
      setIsSubmittingQuickAction(false);
    }
  };

  const handleAddToLogPress = async () => {
    if (!onAddToLog || isRecipeDeleted || isAddingToLog) {
      return;
    }

    setIsAddingToLog(true);
    try {
      await Promise.resolve(onAddToLog(selectedMeal));
    } finally {
      setIsAddingToLog(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ImageBackground imageStyle={styles.heroImage} source={detail.imageSource} style={styles.hero}>
        <Svg height="100%" style={styles.heroShade} width="100%">
          <Defs>
            <LinearGradient id="heroBlackGradient" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor="#000000" stopOpacity="0.08" />
              <Stop offset="0.5" stopColor="#000000" stopOpacity="0.28" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0.68" />
            </LinearGradient>
          </Defs>
          <Rect fill="url(#heroBlackGradient)" height="100%" width="100%" />
        </Svg>
        <View style={styles.heroCopy}>
          <Text style={styles.cuisineBadge}>{detail.badge}</Text>
          <Text style={styles.foodTitle}>{detail.title}</Text>
          <Text style={styles.foodSubtitle}>{detail.subtitle}</Text>
        </View>
      </ImageBackground>

      <View style={[styles.card, styles.calorieCard]}>
        <Text style={styles.overline}>TOTAL CALORIES</Text>
        <Text style={styles.calorieValue}>{detail.calories}</Text>
        <Text style={styles.calorieUnit}>kcal per serving</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macronutrient Breakdown</Text>
          <View style={styles.nutrientList}>
            {detail.macros.map((macro) => (
              <View key={macro.label} style={styles.nutrientCard}>
                <View style={[styles.nutrientIcon, { backgroundColor: macro.backgroundColor }]}>
                  <SvgIcon source={macro.icon} size={22} />
                </View>
                <View style={styles.nutrientMain}>
                  <View style={styles.nutrientTopRow}>
                    <Text style={styles.nutrientLabel}>{macro.label}</Text>
                    <Text style={styles.nutrientPercent}>
                      {macro.value} • {macro.percent}%
                    </Text>
                  </View>
                  <View style={styles.nutrientTrack}>
                    <View
                      style={[
                        styles.nutrientFill,
                        { backgroundColor: macro.color, width: `${Math.min(macro.percent, 100)}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightRail} />
          <View style={styles.insightInner}>
            <SvgIcon height={26} source={svgIcons.aiInsight} width={26} />
            <View style={styles.insightCopy}>
              <Text style={styles.insightTitle}>Recipe Summary</Text>
              <Text style={styles.insightText}>{detail.description}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.microCard]}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.sectionHint}>Ingredients used for this recipe</Text>
          <View style={styles.microList}>
            {detail.ingredients.map((ingredient) => (
              <View key={`${ingredient.ingredient}-${ingredient.quantity ?? ''}`} style={styles.microRow}>
                <Text style={styles.microLabel}>{ingredient.ingredient}</Text>
                <Text style={styles.microValue}>{ingredient.quantity ?? 'To taste'}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.card, styles.microCard]}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <Text style={styles.sectionHint}>How to cook this recipe</Text>
          <View style={styles.stepsList}>
            {detail.steps.map((step, index) => (
              <View key={`${index}-${step}`} style={styles.stepRow}>
                <View style={styles.stepIndexWrap}>
                  <Text style={styles.stepIndex}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.logCard}>
          {isRecipeDeleted ? (
            <View style={styles.deletedInfoCard}>
              <View style={styles.deletedInfoIconWrap}>
                <Text style={styles.deletedInfoIcon}>i</Text>
              </View>
              <Text style={styles.deletedInfoText}>
                This recipe has been deleted from Recipes. You can no longer add it to Log.
              </Text>
            </View>
          ) : null}
          <Text style={styles.logHeading}>LOG THIS MEAL</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isMealDropdownOpen }}
            onPress={() => !isRecipeDeleted && setIsMealDropdownOpen((current) => !current)}
            style={[styles.mealSelect, isRecipeDeleted && styles.disabledControl]}
          >
            <SvgIcon height={20} source={svgIcons.timeRound} width={20} />
            <Text style={styles.mealSelectText}>{mealLabel}</Text>
            <Text style={[styles.chevron, isMealDropdownOpen && styles.chevronOpen]}>⌄</Text>
          </Pressable>
          {isMealDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              {mealOptions.map((option) => (
                <Pressable
                  accessibilityRole="menuitem"
                  key={option}
                  onPress={() => {
                    setSelectedMeal(option);
                    setIsMealDropdownOpen(false);
                  }}
                  style={[styles.dropdownOption, selectedMeal === option && styles.dropdownOptionActive]}
                >
                  <Text style={[styles.dropdownText, selectedMeal === option && styles.dropdownTextActive]}>
                    {formatMealLabel(option, currentMeal)}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <Pressable
            accessibilityRole="button"
            disabled={isRecipeDeleted || isAddingToLog}
            onPress={() => void handleAddToLogPress()}
            style={[styles.addButton, (isRecipeDeleted || isAddingToLog) && styles.disabledControl]}
          >
            <Svg height="100%" style={styles.addButtonGradient} width="100%">
              <Defs>
                <LinearGradient id="addButtonBlackGradient" x1="0" x2="1" y1="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity="0.02" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="0.18" />
                </LinearGradient>
              </Defs>
              <Rect fill="url(#addButtonBlackGradient)" height="100%" width="100%" />
            </Svg>
            {isAddingToLog ? <Text style={styles.addButtonLoadingIcon}>◌</Text> : <SvgIcon height={20} source={svgIcons.plusRound} width={20} />}
            <Text style={styles.addButtonText}>{isAddingToLog ? 'Adding...' : 'Add to Log'}</Text>
          </Pressable>
          {recipe ? (
            <>
              <Text style={styles.quickHeading}>QUICK ACTIONS</Text>
              <View style={styles.quickActions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={isRecipeDeleted || isSubmittingQuickAction}
                  onPress={() => void handleEditPress()}
                  style={[styles.actionPill, styles.editPill, (isRecipeDeleted || isSubmittingQuickAction) && styles.disabledControl]}
                >
                  {isSubmittingQuickAction ? <Text style={styles.actionLoadingIcon}>◌</Text> : null}
                  <Text style={styles.editText}>{isSubmittingQuickAction ? 'Loading...' : recipe.isDefault ? 'Copy & Edit' : 'Edit'}</Text>
                </Pressable>
                {isUserRecipe && !isRecipeDeleted ? (
                  <Pressable
                    accessibilityRole="button"
                    disabled={isSubmittingQuickAction}
                    onPress={() => void handleDeletePress()}
                    style={[styles.actionPill, styles.deletePill, isSubmittingQuickAction && styles.disabledControl]}
                  >
                    {isSubmittingQuickAction ? <Text style={styles.actionLoadingIcon}>◌</Text> : null}
                    <Text style={styles.deleteText}>{isSubmittingQuickAction ? 'Loading...' : 'Delete'}</Text>
                  </Pressable>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function FoodNutritionHeader({ onBack, title = 'Food Nutrition Detail' }: { onBack: () => void; title?: string }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Back" onPress={onBack} style={styles.headerButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <Pressable accessibilityLabel="Save recipe as favorite" style={styles.headerButton}>
        <SvgIcon height={19} source={svgIcons.favoriteDetail} width={20} />
      </Pressable>
    </View>
  );
}

function buildRecipeDetail(recipe?: Recipe) {
  const json = recipe?.jsonData;
  const calories = json?.calories ?? 450;
  const proteins = json?.proteins ?? 28;
  const carbs = json?.carbs ?? 52;
  const fats = json?.fats ?? 14;
  const macroTotal = Math.max(proteins * 4 + carbs * 4 + fats * 9, 1);
  const categories = json?.category ?? ['Vietnamese Cuisine'];
  const serveTo = json?.serveTo ?? 1;
  const cookTime = json?.cookTime ? ` • ${json.cookTime}m` : '';
  const title = json?.recipeName ?? recipe?.recipeName ?? 'Pho Bo Beef Noodle Soup';
  const mealType = titleCase(json?.mealType ?? 'lunch');

  return {
    badge: categories[0] ?? 'Recipe',
    calories,
    description: json?.description ?? 'Traditional Vietnamese beef noodle soup with a balanced serving of protein, carbohydrates, and fats.',
    imageSource: recipe?.imageUrl ? { uri: recipe.imageUrl } : fallbackImage,
    ingredients:
      json?.ingredients && json.ingredients.length > 0
        ? json.ingredients
        : [{ ingredient: 'Ingredients are not available yet', quantity: 'Recipe data' }],
    steps:
      json?.steps && json.steps.length > 0
        ? json.steps
        : ['Steps are not available yet for this recipe.'],
    macros: [
      {
        backgroundColor: '#CFFBE4',
        color: colors.primary,
        icon: svgIcons.proteinLarge,
        label: 'Protein',
        percent: Math.round((proteins * 4 * 100) / macroTotal),
        value: `${proteins}g`,
      },
      {
        backgroundColor: '#FEF3C7',
        color: colors.accent,
        icon: svgIcons.caloriesLarge,
        label: 'Carbs',
        percent: Math.round((carbs * 4 * 100) / macroTotal),
        value: `${carbs}g`,
      },
      {
        backgroundColor: '#DBEAFE',
        color: '#3B82F6',
        icon: svgIcons.waterLarge,
        label: 'Fats',
        percent: Math.round((fats * 9 * 100) / macroTotal),
        value: `${fats}g`,
      },
    ],
    subtitle: `${mealType} • ${serveTo} serving${serveTo === 1 ? '' : 's'}${cookTime}`,
    title,
  };
}

function titleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function getCurrentMealOption(date: Date): MealOption {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) {
    return 'Breakfast';
  }

  if (hour >= 11 && hour < 15) {
    return 'Lunch';
  }

  if (hour >= 17 && hour < 22) {
    return 'Dinner';
  }

  return 'Snack';
}

function formatMealLabel(meal: MealOption, currentMeal: MealOption) {
  return meal === currentMeal ? `${meal} (Now)` : meal;
}

const styles = StyleSheet.create({
  actionPill: {
    alignItems: 'center',
    backgroundColor: '#E9EDFB',
    borderRadius: 999,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minWidth: 112,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  actionLoadingIcon: {
    color: colors.surface,
    ...font.bold,
    fontSize: 14,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primaryMid,
    borderRadius: 24,
    flexDirection: 'row',
    gap: spacing.md,
    height: 64,
    justifyContent: 'center',
    marginTop: 18,
    overflow: 'hidden',
  },
  addButtonGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  addButtonText: {
    color: colors.surface,
    ...font.bold,
    fontSize: 16,
    zIndex: 1,
  },
  addButtonLoadingIcon: {
    color: colors.surface,
    ...font.bold,
    fontSize: 16,
    zIndex: 1,
  },
  deletedInfoCard: {
    alignItems: 'center',
    backgroundColor: '#ECFDF3',
    borderColor: '#86EFAC',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deletedInfoIcon: {
    color: '#166534',
    ...font.bold,
    fontSize: 13,
    lineHeight: 16,
  },
  deletedInfoIconWrap: {
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  deletedInfoText: {
    color: '#166534',
    flex: 1,
    ...font.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  disabledControl: {
    opacity: 0.45,
  },
  backIcon: {
    color: colors.primary,
    ...font.bold,
    fontSize: 34,
    includeFontPadding: false,
    lineHeight: 34,
  },
  calorieCard: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 28,
    height: 174,
    justifyContent: 'center',
    marginTop: -42,
    width: '84%',
    zIndex: 2,
  },
  calorieUnit: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 14,
    marginTop: 4,
  },
  calorieValue: {
    color: '#006C49',
    fontFamily: fontFamily.manropeExtraBold,
    fontSize: 60,
    fontWeight: undefined,
    lineHeight: 70,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 32,
  },
  chevron: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 24,
    lineHeight: 24,
    marginLeft: 'auto',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    gap: 32,
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  cuisineBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#006C49',
    borderRadius: 999,
    color: '#FFFFFF',
    ...font.bold,
    fontSize: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderColor: '#E3E8F8',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  dropdownOptionActive: {
    backgroundColor: '#E9F8F1',
  },
  dropdownText: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 15,
  },
  dropdownTextActive: {
    color: '#006C49',
  },
  foodSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    ...font.medium,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  foodTitle: {
    color: '#FFFFFF',
    fontFamily: fontFamily.manropeExtraBold,
    fontSize: 36,
    fontWeight: undefined,
    lineHeight: 44,
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.header,
    flexDirection: 'row',
    height: 74,
    paddingHorizontal: 24,
  },
  headerButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  headerTitle: {
    color: colors.primary,
    flex: 1,
    ...font.bold,
    fontSize: 20,
    marginLeft: 4,
  },
  hero: {
    height: 352,
    justifyContent: 'flex-end',
  },
  heroCopy: {
    paddingBottom: 58,
    paddingHorizontal: 32,
    zIndex: 1,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
  },
  deletePill: {
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    color: '#B91C1C',
    ...font.bold,
    fontSize: 12,
  },
  editPill: {
    backgroundColor: '#CFFBE4',
  },
  editText: {
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
  },
  insightCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    flexDirection: 'row',
    minHeight: 172,
    overflow: 'hidden',
  },
  insightCopy: {
    flex: 1,
    marginLeft: spacing.md,
  },
  insightInner: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingVertical: 28,
  },
  insightRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    marginVertical: 16,
    width: 4,
  },
  insightText: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
  },
  insightTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 17,
  },
  logCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    marginBottom: 4,
    padding: 24,
  },
  logHeading: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 13,
    letterSpacing: 1,
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
  mealSelect: {
    alignItems: 'center',
    backgroundColor: '#DDE5FF',
    borderRadius: 22,
    flexDirection: 'row',
    gap: spacing.md,
    height: 56,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  mealSelectText: {
    color: colors.ink,
    ...font.bold,
    fontSize: 16,
  },
  microCard: {
    backgroundColor: '#EFF2FF',
  },
  microLabel: {
    color: colors.inkMuted,
    ...font.regular,
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    paddingRight: 16,
  },
  microList: {
    marginTop: 16,
  },
  microRow: {
    alignItems: 'center',
    borderBottomColor: '#E4E8F6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  microValue: {
    color: colors.ink,
    ...font.bold,
    flexShrink: 1,
    fontSize: 15,
    textAlign: 'right',
  },
  overline: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 16,
  },
  quickHeading: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 34,
  },
  screen: {
    paddingBottom: 2,
  },
  sectionHint: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 14,
    marginTop: 6,
  },
  sectionTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 19,
    lineHeight: 25,
  },
  stepIndex: {
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
  },
  stepIndexWrap: {
    alignItems: 'center',
    backgroundColor: '#E6F4EE',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    marginTop: 1,
    width: 24,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: 8,
  },
  stepText: {
    color: colors.ink,
    flex: 1,
    ...font.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  stepsList: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
});
