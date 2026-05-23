import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const phoBoImage = require('../../../assets/pho-bo-background-image.png');

const font = {
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  medium: { fontFamily: fontFamily.medium, fontWeight: undefined },
  semiBold: { fontFamily: fontFamily.semiBold, fontWeight: undefined },
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  extraBold: { fontFamily: fontFamily.extraBold, fontWeight: undefined },
  black: { fontFamily: fontFamily.black, fontWeight: undefined },
} as const;

const macros = [
  { color: colors.primary, label: 'Protein', percent: 35, value: '28g' },
  { color: colors.accent, label: 'Carbohydrates', percent: 50, value: '52g' },
  { color: '#2F7764', label: 'Fats', percent: 15, value: '14g' },
];

const micronutrients = [
  ['Vitamin A', '12% DV', colors.ink],
  ['Vitamin C', '8% DV', colors.ink],
  ['Calcium', '4% DV', colors.ink],
  ['Iron', '18% DV', colors.ink],
  ['Sodium', '980mg', '#D91F26'],
  ['Potassium', '420mg', colors.ink],
] as const;

const mealOptions = ['Breakfast', 'Lunch', 'Dinner'] as const;
type MealOption = (typeof mealOptions)[number];
const currentMeal: MealOption = 'Lunch';

type FoodNutritionDetailProps = {
  onAddToLog?: () => void;
  onEditIngredients?: () => void;
};

export function FoodNutritionDetail({ onAddToLog, onEditIngredients }: FoodNutritionDetailProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealOption>('Lunch');
  const [isMealDropdownOpen, setIsMealDropdownOpen] = useState(false);
  const mealLabel = selectedMeal === currentMeal ? `${selectedMeal} (Now)` : selectedMeal;

  return (
    <View style={styles.screen}>
      <ImageBackground imageStyle={styles.heroImage} source={phoBoImage} style={styles.hero}>
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
          <Text style={styles.cuisineBadge}>Vietnamese Cuisine</Text>
          <Text style={styles.foodTitle}>Phở Bò</Text>
          <Text style={styles.foodSubtitle}>Traditional Beef Noodle Soup • 1 standard bowl{'\n'}(500g)</Text>
        </View>
      </ImageBackground>

      <View style={[styles.card, styles.calorieCard]}>
        <Text style={styles.overline}>TOTAL CALORIES</Text>
        <Text style={styles.calorieValue}>450</Text>
        <Text style={styles.calorieUnit}>kcal per serving</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macronutrient Breakdown</Text>
          <View style={styles.macroList}>
            {macros.map((macro) => (
              <View key={macro.label}>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>{macro.label}</Text>
                  <Text style={[styles.macroValue, { color: macro.color }]}>
                    {macro.value} <Text style={styles.macroPercent}>({macro.percent}%)</Text>
                  </Text>
                </View>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { backgroundColor: macro.color, width: `${macro.percent}%` }]} />
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
              <Text style={styles.insightTitle}>AI Nutritional Insight</Text>
              <Text style={styles.insightText}>
                Phở Bò is an excellent source of lean protein and collagen from bone broth. To optimize your glycemic
                response, consider adding extra bean sprouts for fiber.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.microCard]}>
          <Text style={styles.sectionTitle}>Micronutrients & Minerals</Text>
          <View style={styles.microList}>
            {micronutrients.map(([label, value, color]) => (
              <View key={label} style={styles.microRow}>
                <Text style={styles.microLabel}>{label}</Text>
                <Text style={[styles.microValue, { color }]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.logCard}>
          <Text style={styles.logHeading}>LOG THIS MEAL</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isMealDropdownOpen }}
            onPress={() => setIsMealDropdownOpen((current) => !current)}
            style={styles.mealSelect}
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
                  <Text style={[styles.dropdownText, selectedMeal === option && styles.dropdownTextActive]}>{option}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <Pressable accessibilityRole="button" onPress={onAddToLog} style={styles.addButton}>
            <Svg height="100%" style={styles.addButtonGradient} width="100%">
              <Defs>
                <LinearGradient id="addButtonBlackGradient" x1="0" x2="1" y1="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity="0.02" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="0.18" />
                </LinearGradient>
              </Defs>
              <Rect fill="url(#addButtonBlackGradient)" height="100%" width="100%" />
            </Svg>
            <SvgIcon height={20} source={svgIcons.plusRound} width={20} />
            <Text style={styles.addButtonText}>Add to Log</Text>
          </Pressable>
          <Text style={styles.quickHeading}>QUICK ACTIONS</Text>
          <View style={styles.quickActions}>
            <Pressable accessibilityRole="button" onPress={onEditIngredients} style={[styles.actionPill, styles.ingredientsPill]}>
              <Text style={styles.ingredientsText}>Edit Ingredients</Text>
            </Pressable>
            <Pressable style={styles.actionPill}>
              <Text style={styles.saveText}>Save Recipe</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export function FoodNutritionHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Back to Add Snack" onPress={onBack} style={styles.headerButton}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle}>Food Nutrition Detail</Text>
      <Pressable accessibilityLabel="Save recipe as favorite" style={styles.headerButton}>
        <SvgIcon height={19} source={svgIcons.favoriteDetail} width={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionPill: {
    alignItems: 'center',
    backgroundColor: '#E9EDFB',
    borderRadius: 999,
    justifyContent: 'center',
    minWidth: 112,
    paddingHorizontal: 16,
    paddingVertical: 11,
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
    fontWeight: undefined,
    fontSize: 60,
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
    fontWeight: undefined,
    fontSize: 36,
    lineHeight: 44,
    marginTop: 8,
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
  ingredientsPill: {
    backgroundColor: '#A7EBCF',
  },
  ingredientsText: {
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
  macroFill: {
    borderRadius: 999,
    height: '100%',
  },
  macroLabel: {
    color: colors.ink,
    ...font.bold,
    fontSize: 14,
  },
  macroList: {
    gap: 22,
    marginTop: 28,
  },
  macroPercent: {
    color: colors.inkMuted,
    ...font.medium,
  },
  macroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macroTrack: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    height: 12,
    overflow: 'hidden',
  },
  macroValue: {
    ...font.bold,
    fontSize: 14,
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
    fontSize: 16,
  },
  microList: {
    marginTop: 22,
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
    ...font.bold,
    fontSize: 16,
  },
  overline: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  quickActions: {
    flexDirection: 'row',
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
  saveText: {
    color: colors.ink,
    ...font.bold,
    fontSize: 12,
  },
  screen: {
    paddingBottom: 2,
  },
  sectionTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 19,
    lineHeight: 25,
  },
});
