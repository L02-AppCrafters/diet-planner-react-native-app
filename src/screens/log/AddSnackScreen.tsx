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

type MealTab = 'Breakfast' | 'Lunch' | 'Dinner';

export function AddSnackScreen({
  onLogMeal,
  onOpenDetail,
}: {
  onLogMeal?: () => void;
  onOpenDetail?: () => void;
}) {
  const [searchText, setSearchText] = useState('');
  const [activeMeal, setActiveMeal] = useState<MealTab>('Breakfast');

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
        {(['Breakfast', 'Lunch', 'Dinner'] as const).map((item) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: activeMeal === item }}
            key={item}
            onPress={() => setActiveMeal(item)}
            style={[styles.segmentItem, activeMeal === item && styles.segmentItemActive]}
          >
            <Text style={[styles.segmentText, activeMeal === item && styles.segmentTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <ImageBackground imageStyle={styles.scanImage} source={scanBarcodeBackground} style={styles.scanCard}>
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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Selections</Text>
        <Text style={styles.viewHistory}>View History</Text>
      </View>

      <Pressable onPress={onOpenDetail} style={styles.recentHeroCard}>
        <View style={styles.recentRail} />
        <Image source={avocadoToastImage} style={styles.recentImage} />
        <View style={styles.recentCopy}>
          <Text style={styles.recentTitle}>Avocado Toast</Text>
          <Text style={styles.recentMeta}>280 kcal {'\u2022'} Artisan Pantry</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onLogMeal} style={styles.recentAddButton}>
          <Text style={styles.recentAddText}>+</Text>
        </Pressable>
      </Pressable>

      <View style={styles.recentGrid}>
        <SmallRecentCard
          accent="#0B6BD3"
          calories="120 kcal"
          image={greekYogurtImage}
          onLogMeal={onLogMeal}
          onPress={onOpenDetail}
          title="Greek Yogurt"
        />
        <SmallRecentCard
          accent={colors.primaryMid}
          calories="45 kcal"
          image={matchaLatteImage}
          onLogMeal={onLogMeal}
          onPress={onOpenDetail}
          title="Matcha Latte"
        />
      </View>

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

function SmallRecentCard({
  accent,
  calories,
  image,
  onLogMeal,
  onPress,
  title,
}: {
  accent: string;
  calories: string;
  image: ImageSourcePropType;
  onLogMeal?: () => void;
  onPress?: () => void;
  title: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.smallRecentCard}>
      <View style={[styles.smallRecentRail, { backgroundColor: accent }]} />
      <Image source={image} style={styles.smallRecentImage} />
      <View style={styles.smallRecentCopy}>
        <Text style={styles.smallRecentTitle}>{title}</Text>
        <Text style={styles.smallRecentCalories}>{calories}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onLogMeal} style={styles.smallRecentButton}>
        <Text style={styles.smallRecentButtonText}>Log</Text>
      </Pressable>
    </Pressable>
  );
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
  recentGrid: {
    flexDirection: 'row',
    gap: 14,
    marginTop: spacing.xl,
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
    alignItems: 'center',
    borderRadius: 16,
    height: 224,
    justifyContent: 'center',
    marginTop: 44,
    overflow: 'hidden',
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
    fontSize: 14,
  },
  segmentTextActive: {
    color: '#006C49',
    ...font.semiBold,
  },
  smallRecentButton: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
  },
  smallRecentButtonText: {
    color: colors.primary,
    ...font.bold,
    fontSize: 14,
  },
  smallRecentCalories: {
    color: '#3C4A3C',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontWeight: undefined,
    marginTop: 6,
  },
  smallRecentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    flex: 1,
    height: 204,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingBottom: 14,
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  smallRecentCopy: {
    marginBottom: 0,
  },
  smallRecentImage: {
    borderRadius: 8,
    height: 56,
    width: 56,
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
    fontSize: 16,
    lineHeight: 20,
  },
  viewHistory: {
    color: '#006C49',
    ...font.semiBold,
    fontSize: 14,
  },
});
