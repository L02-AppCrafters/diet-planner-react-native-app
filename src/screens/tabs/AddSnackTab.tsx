import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const snackHeroImage = require('../../../assets/log-breakfast-new.png');
const snackCardImage = require('../../../assets/log-lunch-new.png');
const snackDrinkImage = require('../../../assets/log-dinner-new.png');

const font = {
  medium: {
    fontFamily: fontFamily.medium,
    fontWeight: undefined,
  },
  bold: {
    fontFamily: fontFamily.bold,
    fontWeight: undefined,
  },
  manropeBold: {
    fontFamily: fontFamily.manropeBold,
    fontWeight: undefined,
  },
} as const;

export function AddSnackTab() {
  const { addMealLog } = useApp();

  const logAvocadoToast = () => {
    addMealLog({
      type: 'Snack',
      title: 'Avocado Toast',
      time: '04:00 PM',
      image: snackHeroImage,
      description: 'Artisan avocado toast with premium virgin oil, herbs, and spices.',
      calories: 280,
      protein: 8,
      carbs: 28,
      fat: 14,
      macros: [
        { label: 'CALS', value: '280' },
        { label: 'PROTEIN', value: '8g' },
        { label: 'FAT', value: '14g' },
      ],
    });
    Alert.alert("Success", "Avocado Toast logged as afternoon snack!");
  };

  const logGreekYogurt = () => {
    addMealLog({
      type: 'Snack',
      title: 'Greek Yogurt',
      time: '04:30 PM',
      image: snackCardImage,
      description: 'Rich and creamy Greek yogurt, packed with high quality protein.',
      calories: 120,
      protein: 15,
      carbs: 6,
      fat: 3,
      macros: [
        { label: 'CALS', value: '120' },
        { label: 'PROTEIN', value: '15g' },
        { label: 'FAT', value: '3g' },
      ],
    });
    Alert.alert("Success", "Greek Yogurt logged as afternoon snack!");
  };

  const logMatchaLatte = () => {
    addMealLog({
      type: 'Snack',
      title: 'Matcha Latte',
      time: '05:00 PM',
      image: snackDrinkImage,
      description: 'Steamed milk with high-grade ceremonial matcha green tea.',
      calories: 45,
      protein: 2,
      carbs: 8,
      fat: 1,
      macros: [
        { label: 'CALS', value: '45' },
        { label: 'PROTEIN', value: '2g' },
        { label: 'FAT', value: '1g' },
      ],
    });
    Alert.alert("Success", "Matcha Latte logged as afternoon snack!");
  };

  return (
    <View style={styles.addSnackPage}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>Search</Text>
        <TextInput
          editable={false}
          placeholder="Search food, brands, or recipes..."
          placeholderTextColor={colors.inkSoft}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.segmented}>
        {['Breakfast', 'Lunch', 'Dinner'].map((item, index) => (
          <View key={item} style={[styles.segmentItem, index === 0 && styles.segmentItemActive]}>
            <Text style={[styles.segmentText, index === 0 && styles.segmentTextActive]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.scanCard}>
        <View style={styles.scanOverlay} />
        <View style={styles.scanIconCircle}>
          <Text style={styles.scanIcon}>SCAN</Text>
        </View>
        <Text style={styles.scanTitle}>Scan Barcode</Text>
        <Text style={styles.scanSubtitle}>Instant nutrient extraction</Text>
      </View>

      <View style={styles.addSnackSectionHeader}>
        <Text style={styles.addSnackSectionTitle}>Recent Selections</Text>
        <Text style={styles.viewHistory}>View History</Text>
      </View>

      <View style={styles.recentHeroCard}>
        <View style={styles.recentRail} />
        <Image source={snackHeroImage} style={styles.recentImage} />
        <View style={styles.recentCopy}>
          <Text style={styles.recentTitle}>Avocado Toast</Text>
          <Text style={styles.recentMeta}>280 kcal - Artisan Pantry</Text>
        </View>
        <Pressable onPress={logAvocadoToast} style={styles.recentAddButton}>
          <Text style={styles.recentAddText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.recentGrid}>
        <SmallRecentCard accent="#0B6BD3" calories="120 kcal" image={snackCardImage} title="Greek Yogurt" onLog={logGreekYogurt} />
        <SmallRecentCard
          accent={colors.primaryMid}
          calories="45 kcal"
          image={snackDrinkImage}
          title="Matcha Latte"
          onLog={logMatchaLatte}
        />
      </View>

      <View style={styles.recommendationCard}>
        <View style={styles.insightRail} />
        <View style={styles.recommendationInner}>
          <View style={styles.insightHeadingRow}>
            <SvgIcon height={22} source={svgIcons.aiInsight} width={22} />
            <Text style={styles.addSnackRecommendationTitle}>AI Recommendation</Text>
          </View>
          <Text style={styles.addSnackRecommendationText}>
            Based on your low fiber intake yesterday, scanning a leafy green salad or adding flax seeds to your breakfast
            would optimize your biome score today.
          </Text>
        </View>
      </View>

      <Text style={styles.discoverTitle}>Discover</Text>
      <View style={styles.discoverRow}>
        <DiscoverCard label="Restaurants" symbol="R" />
        <DiscoverCard label="Recipes" symbol="C" />
        <DiscoverCard label="Favorites" symbol="F" />
      </View>
    </View>
  );
}

function SmallRecentCard({
  accent,
  calories,
  image,
  title,
  onLog,
}: {
  accent: string;
  calories: string;
  image: number;
  title: string;
  onLog?: () => void;
}) {
  return (
    <View style={styles.smallRecentCard}>
      <View style={[styles.smallRecentRail, { backgroundColor: accent }]} />
      <Image source={image} style={styles.smallRecentImage} />
      <Text style={styles.smallRecentTitle}>{title}</Text>
      <Text style={styles.smallRecentCalories}>{calories}</Text>
      <Pressable onPress={onLog} style={styles.smallRecentButton}>
        <Text style={styles.smallRecentButtonText}>Log</Text>
      </Pressable>
    </View>
  );
}

function DiscoverCard({ label, symbol }: { label: string; symbol: string }) {
  return (
    <View style={styles.discoverCard}>
      <View style={styles.discoverIconCircle}>
        <Text style={styles.discoverIcon}>{symbol}</Text>
      </View>
      <Text style={styles.discoverLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
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
    fontSize: 14,
    marginRight: spacing.md,
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 18,
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
  viewHistory: {
    color: colors.primary,
    ...font.bold,
    fontSize: 18,
  },
});
