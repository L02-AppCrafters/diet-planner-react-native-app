import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { aiDiscovery } from '../../data/recipes';
import { Recipe } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const recipeFilters = ['All Recipes', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

const font = {
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  medium: { fontFamily: fontFamily.medium, fontWeight: undefined },
  semiBold: { fontFamily: fontFamily.semiBold, fontWeight: undefined },
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  manropeBold: { fontFamily: fontFamily.manropeBold, fontWeight: undefined },
  manropeExtraBold: { fontFamily: fontFamily.manropeExtraBold, fontWeight: undefined },
} as const;

type RecipesScreenProps = {
  onOpenRecipe?: (recipe: Recipe) => void;
  recipes: Recipe[];
};

type RecipeCardProps = {
  onPress?: () => void;
  recipe: Recipe;
};

export function RecipesScreen({ onOpenRecipe, recipes }: RecipesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(recipeFilters[0]);
  const [featuredRecipeId, setFeaturedRecipeId] = useState<string | null>(null);

  const defaultRecipes = useMemo(() => recipes.filter((recipe) => recipe.isDefault), [recipes]);
  const featuredRecipe = useMemo(
    () => defaultRecipes.find((recipe) => recipe.id === featuredRecipeId) ?? defaultRecipes[0] ?? recipes[0],
    [defaultRecipes, featuredRecipeId, recipes],
  );
  const visibleRecipes = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const activeMealType = activeFilter === 'All Recipes' ? null : activeFilter.toLowerCase();

    return recipes.filter((recipe) => {
      const title = getRecipeTitle(recipe).toLowerCase();
      const description = recipe.jsonData.description?.toLowerCase() ?? '';
      const categories = recipe.jsonData.category?.join(' ').toLowerCase() ?? '';
      const mealType = recipe.jsonData.mealType?.toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        categories.includes(normalizedSearch);
      const matchesFilter = !activeMealType || mealType === activeMealType;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, recipes, searchQuery]);

  useEffect(() => {
    if (defaultRecipes.length === 0) {
      setFeaturedRecipeId(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * defaultRecipes.length);
    setFeaturedRecipeId(defaultRecipes[randomIndex].id);
  }, [defaultRecipes]);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>
        Discover <Text style={styles.pageTitleAccent}>Fuel</Text>
      </Text>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <SvgIcon height={15} source={svgIcons.search} width={15} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchQuery}
            placeholder="Search recipes, ingredients, or cuisines..."
            placeholderTextColor="#6C7B6A"
            returnKeyType="search"
            style={styles.searchInput}
            underlineColorAndroid="transparent"
            value={searchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.filterRow} horizontal showsHorizontalScrollIndicator={false}>
        {recipeFilters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {featuredRecipe ? <FeaturedRecipe onPress={() => onOpenRecipe?.(featuredRecipe)} recipe={featuredRecipe} /> : <EmptyRecipeState />}

      {visibleRecipes.length > 0 ? (
        visibleRecipes.map((recipe, index) => (
          <View key={recipe.id}>
            {index === 1 ? <AiDiscoveryCard /> : null}
            <RecipeCard onPress={() => onOpenRecipe?.(recipe)} recipe={recipe} />
          </View>
        ))
      ) : (
        <EmptyRecipeState />
      )}
    </View>
  );
}

function FeaturedRecipe({ onPress, recipe }: RecipeCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.featuredCard}>
      <RecipeImage imageUrl={recipe.imageUrl} imageStyle={styles.featuredImage} />
      <View style={styles.featuredOverlay} />
      <Text style={styles.featuredTag}>EDITOR'S CHOICE</Text>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{getRecipeTitle(recipe)}</Text>
        <View style={styles.featuredMetaRow}>
          <FeaturedMeta icon={svgIcons.time} label={formatCookTime(recipe)} />
          <FeaturedMeta icon={svgIcons.calories} label={`${recipe.jsonData.calories ?? 0} kcal`} />
          <FeaturedMeta icon={svgIcons.proteinMetric} label={`${recipe.jsonData.proteins ?? 0}g Protein`} />
        </View>
      </View>
    </Pressable>
  );
}

function FeaturedMeta({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.featuredMetaItem}>
      <SvgIcon height={12} source={icon} width={12} />
      <Text style={styles.featuredMeta}>{label}</Text>
    </View>
  );
}

function RecipeCard({ onPress, recipe }: RecipeCardProps) {
  const mealType = recipe.jsonData.mealType ?? 'Recipe';

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.recipeCard}>
      <RecipeImage imageUrl={recipe.imageUrl} imageStyle={styles.recipeImage} />
      <View style={styles.recipeBody}>
        <Text style={styles.recipeTag}>{mealType}</Text>
        <Text style={styles.recipeTitle}>{getRecipeTitle(recipe)}</Text>
        <Text numberOfLines={2} style={styles.recipeDescription}>
          {recipe.jsonData.description}
        </Text>
        <View style={styles.recipeDivider} />
        <View style={styles.recipeMetaRow}>
          <RecipeMetric icon={svgIcons.time} label="TIME" value={formatCookTime(recipe)} />
          <RecipeMetric icon={svgIcons.calories} label="CALORIES" value={`${recipe.jsonData.calories ?? 0} kcal`} />
          <RecipeMetric icon={svgIcons.proteinMetric} label="PROTEIN" value={`${recipe.jsonData.proteins ?? 0}g`} />
        </View>
      </View>
    </Pressable>
  );
}

function RecipeImage({ imageStyle, imageUrl }: { imageStyle: object; imageUrl: string }) {
  const svg = getSvgFromDataUri(imageUrl);

  if (svg) {
    return (
      <View style={imageStyle}>
        <SvgXml height="100%" width="100%" xml={svg} />
      </View>
    );
  }

  return <Image source={{ uri: imageUrl }} style={imageStyle} />;
}

function RecipeMetric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.recipeMetric}>
      <Text style={styles.recipeMetaLabel}>{label}</Text>
      <View style={styles.recipeMetaValueRow}>
        <SvgIcon color={colors.ink} height={12} source={icon} width={12} />
        <Text style={styles.recipeMetaValue}>{value}</Text>
      </View>
    </View>
  );
}

function AiDiscoveryCard() {
  return (
    <View style={styles.discoveryCard}>
      <View style={styles.discoveryRail} />
      <View style={styles.discoveryInner}>
        <View style={styles.discoveryTitleRow}>
          <SvgIcon height={22} source={svgIcons.aiInsight} width={22} />
          <Text style={styles.discoveryTitle}>{aiDiscovery.title}</Text>
        </View>
        <Text style={styles.discoveryText}>{aiDiscovery.message}</Text>
        <View style={styles.discoveryGoalBox}>
          <View style={styles.discoveryProgressRow}>
            <Text style={styles.discoveryLabel}>{aiDiscovery.goalLabel}</Text>
            <Text style={styles.discoveryPercent}>{aiDiscovery.goalPercent}%</Text>
          </View>
          <View style={styles.discoveryTrack}>
            <View style={[styles.discoveryFill, { width: `${aiDiscovery.goalPercent}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

function EmptyRecipeState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No recipes found</Text>
      <Text style={styles.emptyCopy}>Try another search term or refresh after seeding default recipes.</Text>
    </View>
  );
}

function getRecipeTitle(recipe: Recipe) {
  return recipe.jsonData.recipeName ?? recipe.recipeName;
}

function formatCookTime(recipe: Recipe) {
  const cookTime = recipe.jsonData.cookTime;
  return cookTime ? `${cookTime}m` : 'Any';
}

function getSvgFromDataUri(uri: string) {
  if (!uri.startsWith('data:image/svg+xml')) {
    return null;
  }

  const [, payload] = uri.split(',', 2);
  if (!payload) {
    return null;
  }

  return decodeURIComponent(payload);
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  discoveryCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 24,
    overflow: 'hidden',
  },
  discoveryFill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: '100%',
  },
  discoveryGoalBox: {
    backgroundColor: '#EAF6F1',
    borderRadius: 8,
    marginTop: 22,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  discoveryInner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 22,
  },
  discoveryLabel: {
    color: colors.primary,
    ...font.semiBold,
    fontSize: 12,
  },
  discoveryPercent: {
    color: colors.primary,
    ...font.semiBold,
    fontSize: 12,
  },
  discoveryProgressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discoveryRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    width: 4,
  },
  discoveryText: {
    color: colors.ink,
    ...font.regular,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  discoveryTitle: {
    color: colors.primary,
    ...font.bold,
    fontSize: 14,
  },
  discoveryTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  discoveryTrack: {
    backgroundColor: '#BFD8CC',
    borderRadius: 999,
    height: 6,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  emptyCopy: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 24,
    padding: 24,
  },
  emptyTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 18,
  },
  featuredCard: {
    borderRadius: 12,
    height: 420,
    justifyContent: 'space-between',
    marginTop: 36,
    overflow: 'hidden',
    padding: 18,
  },
  featuredContent: {
    zIndex: 1,
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  featuredMeta: {
    color: colors.surface,
    ...font.semiBold,
    fontSize: 12,
  },
  featuredMetaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  featuredMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 16,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,18,27,0.28)',
  },
  featuredTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 999,
    color: colors.surface,
    ...font.bold,
    fontSize: 10,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    zIndex: 1,
  },
  featuredTitle: {
    color: colors.surface,
    ...font.manropeExtraBold,
    fontSize: 30,
    lineHeight: 38,
  },
  filterPill: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    minWidth: 74,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 32,
    paddingRight: spacing.xl,
  },
  filterText: {
    color: '#3C4A3C',
    ...font.medium,
    fontSize: 14,
  },
  filterTextActive: {
    color: colors.surface,
    ...font.semiBold,
  },
  pageTitle: {
    color: colors.ink,
    ...font.manropeExtraBold,
    fontSize: 36,
    lineHeight: 44,
  },
  pageTitleAccent: {
    color: colors.primary,
  },
  recipeBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 24,
    overflow: 'hidden',
  },
  recipeDescription: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  recipeDivider: {
    backgroundColor: '#EEF2F1',
    height: 1,
    marginTop: 20,
  },
  recipeImage: {
    height: 178,
    resizeMode: 'cover',
    width: '100%',
  },
  recipeMetaLabel: {
    color: '#3C4A3C',
    ...font.medium,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  recipeMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  recipeMetaValue: {
    color: colors.ink,
    ...font.semiBold,
    fontSize: 14,
  },
  recipeMetaValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: spacing.xs,
  },
  recipeMetric: {
    minWidth: 72,
  },
  recipeTag: {
    color: colors.primary,
    ...font.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  recipeTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 18,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    height: 68,
    paddingHorizontal: spacing.lg,
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    ...font.regular,
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 0,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 24,
  },
});
