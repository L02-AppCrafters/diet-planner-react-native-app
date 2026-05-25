import { useState } from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { MealPlan, Recipe } from '../../services/api';
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

const avocadoToastImage = require('../../../assets/avocado-toast.png');
const greekYogurtImage = require('../../../assets/greek-yogurt.png');
const matchaLatteImage = require('../../../assets/matcha-latte.png');
const scanBarcodeBackground = require('../../../assets/scan-barcode-background.png');

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
type MealTab = 'All Recipes' | MealType;
type RecentRecipeItem = {
  calories: number;
  createdAt: string;
  image: ImageSourcePropType;
  mealType: MealType;
  recipe: Recipe;
  source: string;
  title: string;
};

export function AddSnackScreen({
  onLogMeal,
  onOpenDetail,
  onOpenCreateRecipe,
  onQuickLogRecipe,
  recentMealPlans,
}: {
  onLogMeal?: () => void;
  onOpenDetail?: () => void;
  onOpenCreateRecipe?: () => void;
  onQuickLogRecipe?: (recipe: Recipe, mealType: MealType) => void | Promise<void>;
  recentMealPlans: MealPlan[];
}) {
  const [searchText, setSearchText] = useState('');
  const [activeMeal, setActiveMeal] = useState<MealTab>('All Recipes');
  const recentRecipes = filterRecentRecipeItems(buildRecentRecipeItems(recentMealPlans), searchText, activeMeal);
  const recentSelections = recentRecipes.slice(0, 5);
  const historyItems = recentRecipes;

  return (
    <View style={styles.screen}>
      <View style={styles.searchBox}>
        <SvgIcon height={15} source={svgIcons.search} width={15} />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setSearchText}
          placeholder="Search food, brands, or recipes..."
          placeholderTextColor={colors.inkSoft}
          returnKeyType="search"
          style={styles.searchInput}
          underlineColorAndroid="transparent"
          value={searchText}
        />
      </View>

      <View style={styles.segmented}>
        <ScrollView contentContainerStyle={styles.segmentedScrollContent} horizontal showsHorizontalScrollIndicator={false}>
          {(['All Recipes', 'Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((item) => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeMeal === item }}
              key={item}
              onPress={() => setActiveMeal(item)}
              style={[styles.segmentItem, activeMeal === item && styles.segmentItemActive]}
            >
              <Text numberOfLines={1} style={[styles.segmentText, activeMeal === item && styles.segmentTextActive]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Pressable accessibilityRole="button" onPress={onOpenCreateRecipe} style={styles.scanCard}>
        <ImageBackground imageStyle={styles.scanImage} source={scanBarcodeBackground} style={styles.scanCardInner}>
        <Svg height="100%" style={styles.scanGradient} width="100%">
          <Defs>
            <LinearGradient id="scanGradient" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor="#07111A" stopOpacity="0.28" />
              <Stop offset="0.48" stopColor="#07111A" stopOpacity="0.5" />
              <Stop offset="1" stopColor="#07111A" stopOpacity="0.78" />
            </LinearGradient>
          </Defs>
          <Rect fill="url(#scanGradient)" height="100%" width="100%" />
        </Svg>
        <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
        <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
        <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
        <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
        <View style={styles.scanIconCircle}>
          <SvgIcon height={24} source={svgIcons.scanBarcode} width={30} />
        </View>
        <Text style={styles.scanTitle}>Scan Barcode</Text>
        <Text style={styles.scanSubtitle}>Instant nutrient extraction</Text>
        </ImageBackground>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Selections</Text>
      </View>

      {recentSelections.length > 0 ? (
        <View style={styles.historyList}>
          {recentSelections.map((item, index) => (
            <RecentMealCard
              item={item}
              key={`recent-${item.recipe.id}-${item.createdAt}-${index}`}
              onLogMeal={() => onQuickLogRecipe?.(item.recipe, activeMeal === 'All Recipes' ? item.mealType : activeMeal)}
              onPress={onOpenDetail}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyRecentCard}>
          <Text style={styles.emptyRecentTitle}>{searchText.trim() ? 'No matching foods' : 'No logged foods yet'}</Text>
          <Text style={styles.emptyRecentText}>
            {searchText.trim() ? 'Try another recipe name, meal type, or ingredient keyword.' : 'Meals you log this week will appear here for quick logging.'}
          </Text>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>History of this Week</Text>
      </View>

      {historyItems.length > 0 ? (
        <View style={styles.historyList}>
          {historyItems.map((item, index) => (
            <RecentMealCard
              item={item}
              key={`history-${item.recipe.id}-${item.createdAt}-${index}`}
              onLogMeal={() => onQuickLogRecipe?.(item.recipe, activeMeal === 'All Recipes' ? item.mealType : activeMeal)}
              onPress={onOpenDetail}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyRecentCard}>
          <Text style={styles.emptyRecentTitle}>{searchText.trim() ? 'No matching foods' : 'No logged foods yet'}</Text>
          <Text style={styles.emptyRecentText}>
            {searchText.trim() ? 'Try another recipe name, meal type, or ingredient keyword.' : 'Meals you log this week will appear in your history.'}
          </Text>
        </View>
      )}

      <View style={styles.recommendationCard}>
        <View style={styles.insightRail} />
        <View style={styles.recommendationInner}>
          <View style={styles.insightHeadingRow}>
            <SvgIcon height={22} source={svgIcons.aiInsight} width={22} />
            <Text style={styles.recommendationTitle}>AI Recommendation</Text>
          </View>
          <Text style={styles.recommendationText}>
            Based on your low fiber intake yesterday, scanning a leafy green salad or adding flax seeds to your breakfast
            would optimize your biome score today.
          </Text>
        </View>
      </View>

      <Text style={styles.discoverTitle}>Discover</Text>
      <ScrollView
        contentContainerStyle={styles.discoverRow}
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
      >
        <DiscoverCard
          icon={svgIcons.restaurants}
          iconBackgroundColor="#E7EFFF"
          iconHeight={20}
          iconWidth={15}
          label="Restaurants"
        />
        <DiscoverCard icon={svgIcons.discoverRecipes} iconHeight={16} iconWidth={22} label="Recipes" />
        <DiscoverCard icon={svgIcons.discoverFavorite} iconHeight={19} iconWidth={20} label="Favorites" />
      </ScrollView>
    </View>
  );
}

function RecentMealCard({
  item,
  onLogMeal,
  onPress,
}: {
  item: RecentRecipeItem;
  onLogMeal?: () => void;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.recentHeroCard}>
      <View style={styles.recentRail} />
      <Image source={item.image} style={styles.recentImage} />
      <View style={styles.recentCopy}>
        <Text style={styles.recentTitle}>{item.title}</Text>
        <Text style={styles.recentMeta}>
          {item.calories} kcal {'\u2022'} {item.source}
        </Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onLogMeal} style={styles.recentAddButton}>
        <Text style={styles.recentAddText}>+</Text>
      </Pressable>
    </Pressable>
  );
}

function filterRecentRecipeItems(items: RecentRecipeItem[], searchText: string, activeMeal: MealTab) {
  const query = normalizeSearchText(searchText);
  const mealFilteredItems = activeMeal === 'All Recipes' ? items : items.filter((item) => item.mealType === activeMeal);

  if (!query) {
    return mealFilteredItems;
  }

  return mealFilteredItems.filter((item) => {
    const recipe = item.recipe;
    const json = recipe.jsonData;
    const searchable = [
      item.title,
      item.source,
      json.description,
      json.mealType,
      ...(json.category ?? []),
      ...(json.ingredients ?? []).map((ingredient) => `${ingredient.ingredient} ${ingredient.quantity ?? ''}`),
    ].join(' ');

    return normalizeSearchText(searchable).includes(query);
  });
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function buildRecentRecipeItems(mealPlans: MealPlan[]): RecentRecipeItem[] {
  return mealPlans
    .filter((mealPlan) => mealPlan.recipe)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((mealPlan) => {
      const recipe = mealPlan.recipe as Recipe;

      return {
        calories: recipe.jsonData.calories ?? 0,
        createdAt: mealPlan.createdAt,
        image: recipe.imageUrl ? { uri: recipe.imageUrl } : avocadoToastImage,
        mealType: titleCase(mealPlan.mealType) as MealType,
        recipe,
        source: recipe.jsonData.category?.[0] ?? 'Recipe Log',
        title: recipe.jsonData.recipeName ?? recipe.recipeName,
      };
    });
}

function titleCase(value: string) {
  if (!value) {
    return 'Snack';
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
}

function DiscoverCard({
  icon,
  iconBackgroundColor = colors.primarySoft,
  iconHeight,
  iconWidth,
  label,
}: {
  icon: string;
  iconBackgroundColor?: string;
  iconHeight: number;
  iconWidth: number;
  label: string;
}) {
  return (
    <View style={styles.discoverCard}>
      <View style={[styles.discoverIconCircle, { backgroundColor: iconBackgroundColor }]}>
        <SvgIcon height={iconHeight} source={icon} width={iconWidth} />
      </View>
      <Text style={styles.discoverLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  discoverCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    height: 112,
    justifyContent: 'center',
    minWidth: 118,
    paddingHorizontal: spacing.lg,
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
    ...font.semiBold,
    fontSize: 12,
  },
  discoverRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
    paddingRight: spacing.xl,
  },
  discoverTitle: {
    color: colors.ink,
    ...font.manropeExtraBold,
    fontSize: 20,
    marginTop: 34,
  },
  insightHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  insightRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    width: 4,
  },
  historyList: {
    gap: spacing.md,
    marginTop: spacing.xl,
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
    fontSize: 32,
    includeFontPadding: false,
    lineHeight: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  recentCopy: {
    flex: 1,
    marginLeft: 20,
  },
  recentHeroCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    minHeight: 132,
    marginTop: spacing.xl,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  recentImage: {
    borderRadius: 10,
    height: 74,
    width: 74,
  },
  recentMeta: {
    color: '#3C4A3C',
    ...font.regular,
    fontSize: 12,
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
    fontSize: 16,
    lineHeight: 20,
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
  recommendationText: {
    color: '#3C4A3C',
    ...font.regular,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  recommendationTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 16,
  },
  scanCard: {
    borderRadius: 16,
    marginTop: 44,
    overflow: 'hidden',
  },
  scanCardInner: {
    alignItems: 'center',
    height: 224,
    justifyContent: 'center',
  },
  scanCorner: {
    borderColor: '#34D399',
    height: 38,
    position: 'absolute',
    width: 38,
  },
  scanCornerBottomLeft: {
    borderBottomLeftRadius: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    bottom: 50,
    left: 48,
  },
  scanCornerBottomRight: {
    borderBottomRightRadius: 8,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    bottom: 50,
    right: 48,
  },
  scanCornerTopLeft: {
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
    borderTopWidth: 3,
    left: 48,
    top: 42,
  },
  scanCornerTopRight: {
    borderRightWidth: 3,
    borderTopRightRadius: 8,
    borderTopWidth: 3,
    right: 48,
    top: 42,
  },
  scanIconCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,108,73,0.92)',
    borderRadius: 999,
    height: 72,
    justifyContent: 'center',
    width: 72,
    zIndex: 1,
  },
  scanImage: {
    borderRadius: 16,
    resizeMode: 'cover',
  },
  scanGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scanSubtitle: {
    color: 'rgba(255,255,255,0.74)',
    ...font.regular,
    fontSize: 12,
    marginTop: spacing.xs,
    zIndex: 1,
  },
  scanTitle: {
    color: colors.surface,
    ...font.manropeBold,
    fontSize: 18,
    marginTop: spacing.xl,
    zIndex: 1,
  },
  screen: {
    paddingTop: spacing.xl,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    flexDirection: 'row',
    gap: spacing.md,
    height: 70,
    paddingHorizontal: 24,
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    ...font.regular,
    fontSize: 16,
    paddingVertical: 0,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 34,
  },
  sectionTitle: {
    color: colors.ink,
    ...font.manropeExtraBold,
    fontSize: 20,
  },
  segmented: {
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    marginTop: 24,
    padding: 5,
  },
  segmentedScrollContent: {
    alignItems: 'center',
    columnGap: 6,
    paddingRight: 6,
  },
  segmentItem: {
    alignItems: 'center',
    borderRadius: 11,
    minWidth: 88,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  segmentItemActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    color: colors.inkMuted,
    ...font.medium,
    fontSize: 14,
  },
  segmentTextActive: {
    color: '#006C49',
    ...font.semiBold,
  },
  emptyRecentCard: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderColor: '#DCE4F5',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    marginTop: spacing.xl,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  emptyRecentText: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptyRecentTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 16,
  },
});
