import { useRef, useState } from 'react';
import { Animated, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const lunchImage = require('../../../assets/lunch.png');

const rowCapacityLiters = 2.5;
const waterCupLiters = 0.5;
const waterCupMl = 500;
const cupsPerRow = rowCapacityLiters / waterCupLiters;
const weeklyCalories = [1980, 2140, 1240, 2360, 1840, 2210, 1680];
const weekLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const nutritionColors = {
    PROTEIN: '#22C55E',
    CARBS: '#2563EB',
    FAT: '#16A34A',
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

export function HomeTab() {
    const { waterConsumedLiters, waterGoalLiters, addWater } = useApp();
    const [activeMacro, setActiveMacro] = useState('PROTEIN');
    const [activeWeekIndex, setActiveWeekIndex] = useState(2);
    const addWaterScale = usePressScale(0.92);

    const maxWaterRows = Math.ceil(waterGoalLiters / rowCapacityLiters);
    const waterCups = Array.from({ length: cupsPerRow * maxWaterRows }, (_, index) => index);
    const visibleRows = Math.min(maxWaterRows, Math.max(1, Math.floor(waterConsumedLiters / rowCapacityLiters) + 1));
    const visibleCups = waterCups.slice(0, visibleRows * cupsPerRow);

    const handleAddWater = () => {
        triggerPressScale(addWaterScale);
        addWater(0.25);
    };

    return (
        <>
            <HeroSection />
            <MacroSummary activeMacro={activeMacro} onMacroPress={setActiveMacro} />
            <MacroDetail activeMacro={activeMacro} />
            <CalorieRing />
            <WaterTrackerCard
                onAddWater={handleAddWater}
                scale={addWaterScale}
                visibleCups={visibleCups}
                waterConsumedLiters={waterConsumedLiters}
                waterGoalLiters={waterGoalLiters}
            />
            <MealHighlightCard />
            <InsightCard />
            <WeeklyOverview activeIndex={activeWeekIndex} onDayPress={setActiveWeekIndex} />
        </>
    );
}

function HeroSection() {
    const { consumedCalories, caloriesGoal } = useApp();
    return (
        <View style={styles.hero}>
            <Text style={styles.heroTitle}>
                Fuel your <Text style={styles.heroAccent}>Potential.</Text>
            </Text>
            <Text style={styles.heroCopy}>
                You've consumed {consumedCalories.toLocaleString()} kcal today.{"\n"}Stay on track for your {caloriesGoal.toLocaleString()} kcal daily{"\n"}goal.
            </Text>
        </View>
    );
}

function MacroSummary({
    activeMacro,
    onMacroPress,
}: {
    activeMacro: string;
    onMacroPress: (label: string) => void;
}) {
    const { macros } = useApp();
    const homeMacros = [macros.PROTEIN, macros.CARBS, macros.FAT];

    return (
        <View style={styles.macroRow}>
            {homeMacros.map((macro) => (
                <Pressable
                    key={macro.label}
                    onPress={() => onMacroPress(macro.label)}
                    style={[styles.macroCard, macro.label === activeMacro && styles.macroCardActive]}
                >
                    <Text style={styles.macroLabel}>{macro.label}</Text>
                    <View style={styles.macroTrack}>
                        <View
                            style={[
                                styles.macroFill,
                                {
                                    backgroundColor: macro.color,
                                    width: `${Math.min(macro.value / macro.target, 1) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.macroValue}>{macro.value}g</Text>
                    <Text style={styles.macroTarget}>/ {macro.target}g</Text>
                </Pressable>
            ))}
        </View>
    );
}

function MacroDetail({ activeMacro }: { activeMacro: string }) {
    const { macros } = useApp();
    const homeMacros = [macros.PROTEIN, macros.CARBS, macros.FAT];
    const macro = homeMacros.find((item) => item.label === activeMacro) ?? homeMacros[0];

    return (
        <View style={styles.macroDetail}>
            <Text style={styles.macroDetailLabel}>Selected macro</Text>
            <Text style={styles.macroDetailValue}>
                {macro.label} - {macro.value}g / {macro.target}g
            </Text>
        </View>
    );
}

function CalorieRing() {
    const { consumedCalories, caloriesGoal } = useApp();
    const caloriesLeft = Math.max(0, caloriesGoal - consumedCalories);
    const calorieProgress = consumedCalories / caloriesGoal;
    const consumedPercent = Math.round(calorieProgress * 100);
    const progressDegrees = calorieProgress * 360;
    const webRingStyle =
        Platform.OS === 'web'
            ? ({
                backgroundImage: `conic-gradient(${colors.primaryMid} 0deg ${progressDegrees}deg, #EDF1FF ${progressDegrees}deg 360deg)`,
            } as object)
            : null;

    return (
        <View style={styles.ringWrap}>
            <View style={[styles.ringProgress, webRingStyle]}>
                <View style={styles.ringHole} />
            </View>
            <View style={styles.ringCenter}>
                <Text style={styles.ringNumber}>{caloriesLeft.toLocaleString()}</Text>
                <Text style={styles.ringLabel}>KCAL LEFT</Text>
                <Text style={styles.ringPercent}>{consumedPercent}% consumed</Text>
            </View>
        </View>
    );
}

function WaterTrackerCard({
    onAddWater,
    scale,
    visibleCups,
    waterConsumedLiters,
    waterGoalLiters,
}: {
    onAddWater: () => void;
    scale: Animated.Value;
    visibleCups: number[];
    waterConsumedLiters: number;
    waterGoalLiters: number;
}) {
    return (
        <View style={styles.waterCard}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>Water Tracker</Text>
                    <Text style={styles.cardSubtitle}>Stay hydrated, stay sharp</Text>
                </View>
                <SvgIcon height={22} source={svgIcons.water} width={18} />
            </View>
            <View style={styles.waterGrid}>
                {visibleCups.map((cup) => {
                    const fillLevel = Math.max(
                        0,
                        Math.min((waterConsumedLiters - cup * waterCupLiters) / waterCupLiters, 1),
                    );

                    return <WaterCup fillLevel={fillLevel} key={cup} />;
                })}
            </View>
            <Text style={styles.waterCupMeta}>{waterCupMl} ml each</Text>
            <View style={styles.waterFooter}>
                <Text style={styles.waterAmount}>
                    {waterConsumedLiters.toFixed(2)}L / {waterGoalLiters.toFixed(2)}L
                </Text>
                <Pressable accessibilityLabel="Add water" onPress={onAddWater}>
                    <Animated.View style={[styles.addWaterButton, { transform: [{ scale }] }]}
                    >
                        <Text style={styles.addWaterText}>+</Text>
                    </Animated.View>
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

function MealHighlightCard() {
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
                    <Text style={[styles.nutritionPill, { color: nutritionColors.CARBS }]}>C: 12G</Text>
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
    activeIndex,
    onDayPress,
}: {
    activeIndex: number;
    onDayPress: (index: number) => void;
}) {
    const maxWeeklyCalories = Math.max(...weeklyCalories);

    return (
        <View style={styles.weeklyCard}>
            <View style={styles.weeklyHeader}>
                <Text style={styles.weeklyTitle}>Weekly Overview</Text>
                <Text style={styles.more}>•••</Text>
            </View>
            <View style={styles.weeklyChart}>
                {weeklyCalories.map((calories, index) => {
                    const isActive = index === activeIndex;
                    const barHeight = Math.max(34, (calories / maxWeeklyCalories) * 128);

                    return (
                        <Pressable key={`${calories}-${index}`} onPress={() => onDayPress(index)} style={styles.weekColumn}>
                            <Text style={[styles.weekValue, isActive && styles.weekValueActive]}>{calories}</Text>
                            <View style={styles.weekBarTrack}>
                                <View style={[styles.weekBar, isActive && styles.weekBarActive, { height: barHeight }]} />
                            </View>
                            <Text style={[styles.weekDay, isActive && styles.weekDayActive]}>{weekLabels[index]}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function usePressScale(activeScale: number) {
    const scale = useRef(new Animated.Value(1)).current;

    return Object.assign(scale, { activeScale });
}

function triggerPressScale(scale: Animated.Value & { activeScale?: number }) {
    const activeScale = scale.activeScale ?? 0.95;

    Animated.sequence([
        Animated.spring(scale, { toValue: activeScale, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
}

const styles = StyleSheet.create({
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
    addWaterText: {
        color: colors.surface,
        ...font.medium,
        fontSize: 28,
        lineHeight: 32,
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
        backgroundColor: '#EEF2FF',
        borderColor: '#D7E0F2',
        borderRadius: 18,
        borderWidth: 1.5,
        flexBasis: '20%',
        height: 70,
        marginBottom: 12,
        maxWidth: '20%',
        overflow: 'hidden',
    },
    cupFill: {
        backgroundColor: colors.accent,
        bottom: 0,
        position: 'absolute',
        width: '100%',
    },
    divider: {
        backgroundColor: colors.border,
        height: 1,
        marginBottom: spacing.lg,
        marginTop: spacing.xl,
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
    macroCard: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 22,
        height: 128,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        width: 110,
    },
    macroCardActive: {
        borderColor: colors.primary,
        borderWidth: 1,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
    },
    macroDetail: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    macroDetailLabel: {
        color: colors.inkSoft,
        ...font.semiBold,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    macroDetailValue: {
        color: colors.ink,
        ...font.bold,
        fontSize: 16,
        marginTop: spacing.xs,
    },
    macroFill: {
        borderRadius: 999,
        height: '100%',
    },
    macroLabel: {
        color: colors.inkMuted,
        ...font.semiBold,
        fontSize: 11,
        letterSpacing: 1,
        marginBottom: spacing.sm,
    },
    macroRow: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
        marginTop: 32,
    },
    macroTarget: {
        color: colors.inkSoft,
        ...font.semiBold,
        fontSize: 12,
    },
    macroTrack: {
        backgroundColor: colors.accentSoft,
        borderRadius: 999,
        height: 8,
        marginBottom: spacing.md,
        overflow: 'hidden',
        width: 74,
    },
    macroValue: {
        color: colors.ink,
        ...font.bold,
        fontSize: 15,
        lineHeight: 20,
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
    nutritionPill: {
        backgroundColor: colors.accentSoft,
        borderRadius: 8,
        color: colors.inkMuted,
        ...font.bold,
        fontSize: 10,
        minWidth: 68,
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 8,
        textAlign: 'center',
    },
    nutritionRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: 25,
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
    ringHole: {
        backgroundColor: colors.background,
        borderRadius: 111,
        height: 222,
        width: 222,
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
    ringProgress: {
        alignItems: 'center',
        backgroundColor: colors.primaryMid,
        borderRadius: 135,
        height: 270,
        justifyContent: 'center',
        position: 'absolute',
        width: 270,
    },
    ringWrap: {
        alignItems: 'center',
        height: 330,
        justifyContent: 'center',
        marginTop: 38,
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
        justifyContent: 'space-between',
        marginTop: 18,
        width: '100%',
    },
    waterCupMeta: {
        color: colors.inkSoft,
        fontFamily: fontFamily.regular,
        fontWeight: undefined,
        fontSize: 12,
        marginTop: spacing.sm,
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
    weekDay: {
        color: colors.inkMuted,
        ...font.black,
        fontSize: 11,
    },
    weekDayActive: {
        color: colors.primary,
    },
    weekValue: {
        color: colors.inkSoft,
        ...font.bold,
        fontSize: 9,
    },
    weekValueActive: {
        color: colors.primary,
    },
    weeklyCard: {
        backgroundColor: colors.accentSoft,
        borderRadius: 24,
        height: 304,
        marginTop: 28,
        paddingHorizontal: 28,
        paddingTop: 31,
    },
    weeklyChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
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
