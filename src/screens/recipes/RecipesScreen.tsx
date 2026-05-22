import { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { aiDiscovery, featuredRecipe, recipeCards, recipeFilters } from '../../data/recipes';
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

type RecipeCardProps = {
  calories: string;
  id: string;
  image: number;
  protein: string;
  tag: string;
  time: string;
  title: string;
};

export function RecipesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(recipeFilters[0]);

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

      <FeaturedRecipe />
      <RecipeCard {...recipeCards[0]} />
      <AiDiscoveryCard />
      {recipeCards.slice(1).map((recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </View>
  );
}

function FeaturedRecipe() {
  return (
    <ImageBackground imageStyle={styles.featuredImage} source={featuredRecipe.image} style={styles.featuredCard}>
      <View style={styles.featuredOverlay} />
      <Text style={styles.featuredTag}>{featuredRecipe.tag}</Text>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{featuredRecipe.title}</Text>
        <View style={styles.featuredMetaRow}>
          <FeaturedMeta icon={svgIcons.time} label={featuredRecipe.time} />
          <FeaturedMeta icon={svgIcons.calories} label={featuredRecipe.calories} />
          <FeaturedMeta icon={svgIcons.proteinMetric} label={featuredRecipe.protein} />
        </View>
      </View>
    </ImageBackground>
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

function RecipeCard({ calories, image, protein, tag, time, title }: RecipeCardProps) {
  return (
    <View style={styles.recipeCard}>
      <Image source={image} style={styles.recipeImage} />
      <View style={styles.recipeBody}>
        <Text style={[styles.recipeTag, tag === 'KETO' && styles.ketoTag]}>{tag}</Text>
        <Text style={styles.recipeTitle}>{title}</Text>
        <View style={styles.recipeDivider} />
        <View style={styles.recipeMetaRow}>
          <RecipeMetric label="TIME" value={time} />
          <RecipeMetric label="CALORIES" value={calories} />
          <RecipeMetric label="PROTEIN" value={protein} />
        </View>
      </View>
    </View>
  );
}

function RecipeMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.recipeMetric}>
      <Text style={styles.recipeMetaLabel}>{label}</Text>
      <Text style={styles.recipeMetaValue}>{value}</Text>
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
    gap: 18,
    marginTop: 16,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,18,27,0.26)',
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
  ketoTag: {
    color: '#2563EB',
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
