import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const logBreakfastImage = require('../../../assets/log-breakfast-new.png');
const logLunchImage = require('../../../assets/log-lunch-new.png');
const logDinnerImage = require('../../../assets/log-dinner-new.png');

const nutritionColors = {
  CALS: '#006C49',
  FAT: '#F59E0B',
  PROTEIN: '#3B82F6',
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
  onAddSnack: () => void;
};

export function LogScreen({ onAddSnack }: LogScreenProps) {
  return (
    <View style={styles.logContent}>
      <View style={styles.energyCard}>
        <Text style={styles.energyLabel}>Energy Budget</Text>
        <View style={styles.energyRow}>
          <Text style={styles.energyValue}>1,420</Text>
          <Text style={styles.energyGoal}>/ 2,100</Text>
        </View>
        <View style={styles.energyMetaRow}>
          <Text style={styles.energyUnit}>kcal</Text>
          <Text style={styles.plannedBadge}>67% Planned</Text>
        </View>
        <View style={styles.energyTrack}>
          <View style={styles.energyFill} />
        </View>
      </View>

      <View style={styles.optimizationCard}>
        <Text style={styles.optimizationTitle}>AI Optimization</Text>
        <Text style={styles.optimizationCopy}>
          Your plan is low in Fiber today. We suggest adding Chia Seeds to your afternoon snack.
        </Text>
      </View>

      <View style={styles.datePicker}>
        {[
          ['MON', '12'],
          ['TUE', '13'],
          ['WED', '14'],
          ['THU', '15'],
        ].map(([day, date]) => {
          const active = day === 'WED';
          return (
            <View key={day} style={[styles.dateCard, active && styles.dateCardActive]}>
              <Text style={[styles.dateDay, active && styles.dateTextActive]}>{day}</Text>
              <Text style={[styles.dateNumber, active && styles.dateTextActive]}>{date}</Text>
              {active ? <View style={styles.dateDot} /> : null}
            </View>
          );
        })}
      </View>

      <MealLogCard
        description="Creamy avocado toast topped with poached eggs, herbs, and chili flakes for steady morning energy."
        iconBg="#FFF0DC"
        iconHeight={17}
        iconSource={svgIcons.breakfast}
        iconWidth={17}
        image={logBreakfastImage}
        macros={[
          { label: 'CALS', value: '420' },
          { label: 'PROTEIN', value: '18g' },
          { label: 'FAT', value: '22g' },
        ]}
        time="08:30 AM"
        title="Avocado & Poached Egg"
        type="Breakfast"
      />

      <MealLogCard
        description="A balanced bowl with grilled chicken, chickpeas, cucumber, and rice for a filling midday meal."
        iconBg="#D8FFE9"
        iconHeight={15}
        iconSource={svgIcons.lunch}
        iconWidth={12}
        image={logLunchImage}
        macros={[
          { label: 'CALS', value: '650' },
          { label: 'PROTEIN', value: '32g' },
          { label: 'FAT', value: '18g' },
        ]}
        time="12:45 PM"
        title="Mediterranean Power Bowl"
        type="Lunch"
      />

      <MealLogCard
        description="High in Omega-3 fatty acids. Served with a side of zesty quinoa and roasted almonds."
        iconBg="#E2E1FF"
        iconHeight={15}
        iconSource={svgIcons.dinner}
        iconWidth={17}
        image={logDinnerImage}
        macros={[
          { label: 'CALS', value: '520' },
          { label: 'PROTEIN', value: '38g' },
          { label: 'FAT', value: '24g' },
        ]}
        time="07:15 PM"
        title="Atlantic Salmon & Asparagus"
        type="Dinner"
      />

      <Pressable accessibilityRole="button" onPress={onAddSnack} style={styles.addSnackCard}>
        <View style={styles.addSnackCircle}>
          <SvgIcon height={14} source={svgIcons.add} width={14} />
        </View>
        <Text style={styles.addSnackTitle}>Add Snack</Text>
        <Text style={styles.addSnackCopy}>Keep your metabolism active</Text>
      </Pressable>

      <HydrationLogCard />
    </View>
  );
}

type MealLogCardProps = {
  description: string;
  iconBg: string;
  iconHeight: number;
  iconSource: string;
  iconWidth: number;
  image: number;
  macros: Array<{ label: string; value: string }>;
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
  time,
  title,
  type,
}: MealLogCardProps) {
  return (
    <View style={styles.dinnerCard}>
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
    </View>
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

function HydrationLogCard() {
  return (
    <View style={styles.hydrationCard}>
      <View style={styles.logMealHeader}>
        <View style={[styles.mealIconCircle, { backgroundColor: '#BFDAFF' }]}>
          <SvgIcon color="#1D7BE3" height={15} source={svgIcons.water} width={12} />
        </View>
        <Text style={styles.hydrationTitle}>Hydration</Text>
      </View>
      <Text style={styles.hydrationValue}>
        1.8 <Text style={styles.hydrationGoal}>/ 3.0L</Text>
      </Text>
      <View style={styles.hydrationDots}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={[styles.hydrationDot, item <= 3 && styles.hydrationDotActive]} />
        ))}
      </View>
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
