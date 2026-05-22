import { Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { featuredRecipe, recipeCards, recipeFilters, aiDiscovery } from '../../data/recipes';
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

export function RecipesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Discover Fuel</Text>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>Search</Text>
          <TextInput
            editable={false}
            placeholder="Search recipes, ingredients, or cuisines..."
            placeholderTextColor={colors.inkSoft}
            style={styles.searchInput}
          />
        </View>
        <Pressable style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>
      <View style={styles.filterRow}>
        {recipeFilters.map((filter, index) => (
          <View key={filter} style={[styles.filterPill, index === 0 && styles.filterPillActive]}>
            <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</Text>
          </View>
        ))}
      </View>
      <FeaturedRecipe />
      {recipeCards.map((recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
      <AiDiscoveryCard />
    </View>
  );
}

function FeaturedRecipe() {
  return (
    <View style={styles.featuredCard}>
      <ImageBackground source={featuredRecipe.image} style={styles.featuredImage}>
        <View style={styles.featuredOverlay} />
        <Text style={styles.featuredTag}>{featuredRecipe.tag}</Text>
        <Text style={styles.featuredTitle}>{featuredRecipe.title}</Text>
        <View style={styles.featuredMetaRow}>
          <Text style={styles.featuredMeta}>{featuredRecipe.time}</Text>
          <Text style={styles.featuredMeta}>{featuredRecipe.calories}</Text>
          <Text style={styles.featuredMeta}>{featuredRecipe.protein}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

type RecipeCardProps = {
  tag: string;
  title: string;
  time: string;
  protein: string;
  image: number;
};

function RecipeCard({ tag, title, time, protein, image }: RecipeCardProps) {
  return (
    <View style={styles.recipeCard}>
      <Image source={image} style={styles.recipeImage} />
      <Text style={styles.recipeTag}>{tag}</Text>
      <Text style={styles.recipeTitle}>{title}</Text>
      <View style={styles.recipeMetaRow}>
        <View>
          <Text style={styles.recipeMetaLabel}>TIME</Text>
          <Text style={styles.recipeMetaValue}>{time}</Text>
        </View>
        <View>
          <Text style={styles.recipeMetaLabel}>PROTEIN</Text>
          <Text style={styles.recipeMetaValue}>{protein}</Text>
        </View>
      </View>
    </View>
  );
}

function AiDiscoveryCard() {
  return (
    <View style={styles.discoveryCard}>
      <View style={styles.discoveryRail} />
      <View style={styles.discoveryInner}>
        <Text style={styles.discoveryTitle}>{aiDiscovery.title}</Text>
        <Text style={styles.discoveryText}>{aiDiscovery.message}</Text>
        <View style={styles.discoveryProgressRow}>
          <Text style={styles.discoveryLabel}>{aiDiscovery.goalLabel}</Text>
          <Text style={styles.discoveryPercent}>{aiDiscovery.goalPercent}%</Text>
        </View>
        <View style={styles.discoveryTrack}>
          <View style={[styles.discoveryFill, { width: `${aiDiscovery.goalPercent}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  discoveryCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 28,
    overflow: 'hidden',
  },
  discoveryFill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: '100%',
  },
  discoveryInner: {
    flex: 1,
    padding: 24,
  },
  discoveryLabel: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 12,
  },
  discoveryPercent: {
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
  },
  discoveryProgressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  discoveryRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    width: 4,
  },
  discoveryText: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontWeight: undefined,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  discoveryTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 16,
  },
  discoveryTrack: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    height: 8,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  featuredCard: {
    borderRadius: 20,
    marginTop: 24,
    overflow: 'hidden',
  },
  featuredImage: {
    height: 240,
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredMeta: {
    color: colors.surface,
    ...font.semiBold,
    fontSize: 12,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.35)',
  },
  featuredTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 999,
    color: colors.surface,
    ...font.bold,
    fontSize: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  featuredTitle: {
    color: colors.surface,
    ...font.extraBold,
    fontSize: 20,
    marginTop: spacing.lg,
  },
  filterPill: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  filterText: {
    color: colors.inkMuted,
    ...font.semiBold,
    fontSize: 12,
  },
  filterTextActive: {
    color: colors.surface,
  },
  pageTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 32,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginTop: 24,
    overflow: 'hidden',
  },
  recipeImage: {
    height: 180,
    width: '100%',
  },
  recipeMetaLabel: {
    color: colors.inkSoft,
    ...font.semiBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  recipeMetaValue: {
    color: colors.ink,
    ...font.bold,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  recipeTag: {
    color: colors.primary,
    ...font.bold,
    fontSize: 11,
    letterSpacing: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  recipeTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 18,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    flexDirection: 'row',
    flex: 1,
    height: 54,
    paddingHorizontal: spacing.lg,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  searchButtonText: {
    color: colors.surface,
    ...font.bold,
    fontSize: 14,
  },
  searchIcon: {
    color: colors.inkSoft,
    ...font.semiBold,
    fontSize: 12,
    marginRight: spacing.sm,
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: undefined,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
});
