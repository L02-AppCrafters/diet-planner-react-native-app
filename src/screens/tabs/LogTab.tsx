import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { useApp } from '../../context/AppContext';
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

function getMealLayoutProps(type: string) {
    switch (type.toLowerCase()) {
        case 'breakfast':
            return {
                iconBg: '#FFF0DC',
                iconHeight: 17,
                iconWidth: 17,
                iconSource: svgIcons.breakfast,
            };
        case 'lunch':
            return {
                iconBg: '#D8FFE9',
                iconHeight: 15,
                iconWidth: 12,
                iconSource: svgIcons.lunch,
            };
        case 'dinner':
            return {
                iconBg: '#E2E1FF',
                iconHeight: 15,
                iconWidth: 17,
                iconSource: svgIcons.dinner,
            };
        default: // Snack
            return {
                iconBg: '#BFDAFF',
                iconHeight: 15,
                iconWidth: 15,
                iconSource: svgIcons.recipes,
            };
    }
}

type LogTabProps = {
    onAddSnack: () => void;
};

type MealLogItem = {
    id: string;
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

export function LogTab({ onAddSnack }: LogTabProps) {
    const { loggedMeals } = useApp();
    const [selectedMeal, setSelectedMeal] = useState<any | null>(null);

    if (selectedMeal) {
        return <MealDetail meal={selectedMeal} onBack={() => setSelectedMeal(null)} />;
    }

    return (
        <View style={styles.logContent}>
            <EnergyCard />
            <OptimizationCard />
            <DatePicker />
            {loggedMeals.map((meal) => {
                const layoutProps = getMealLayoutProps(meal.type);
                return (
                    <MealLogCard key={meal.id} {...meal} {...layoutProps} onPress={() => setSelectedMeal(meal)} />
                );
            })}
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

function EnergyCard() {
    const { consumedCalories, caloriesGoal } = useApp();
    const plannedPercent = Math.min(100, Math.round((consumedCalories / caloriesGoal) * 100));

    return (
        <View style={styles.energyCard}>
            <Text style={styles.energyLabel}>Energy Budget</Text>
            <View style={styles.energyRow}>
                <Text style={styles.energyValue}>{consumedCalories.toLocaleString()}</Text>
                <Text style={styles.energyGoal}>/ {caloriesGoal.toLocaleString()}</Text>
            </View>
            <View style={styles.energyMetaRow}>
                <Text style={styles.energyUnit}>kcal</Text>
                <Text style={styles.plannedBadge}>{plannedPercent}% Planned</Text>
            </View>
            <View style={styles.energyTrack}>
                <View style={[styles.energyFill, { width: `${plannedPercent}%` }]} />
            </View>
        </View>
    );
}

function OptimizationCard() {
    return (
        <View style={styles.optimizationCard}>
            <Text style={styles.optimizationTitle}>AI Optimization</Text>
            <Text style={styles.optimizationCopy}>
                Your plan is low in Fiber today. We suggest adding Chia Seeds to your afternoon snack.
            </Text>
        </View>
    );
}

function DatePicker() {
    return (
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
    );
}

type MealLogCardProps = {
    iconBg: string;
    iconHeight: number;
    iconSource: string;
    iconWidth: number;
    image: number;
    description: string;
    macros: Array<{ label: string; value: string }>;
    time: string;
    title: string;
    type: string;
    onPress?: () => void;
};

function MealLogCard({
    description,
    iconBg,
    iconHeight,
    iconSource,
    iconWidth,
    image,
    macros,
    onPress,
    time,
    title,
    type,
}: MealLogCardProps) {
    return (
        <Pressable onPress={onPress} style={styles.dinnerCard}>
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
        </Pressable>
    );
}

function MealDetail({ meal, onBack }: { meal: any; onBack: () => void }) {
    const { loggedMeals, addMealLog, removeMealLog, addIngredientsToShoppingList } = useApp();
    const isAdded = loggedMeals.some((m) => m.id === meal.id);
    const meta = getMealDetailMeta(meal.id);
    const ingredients = getMealIngredients(meal.id);
    const breakdown = getMealBreakdown(meal.id);
    const steps = getMealSteps(meal.id);

    return (
        <View style={styles.detailPage}>
            <View style={styles.detailHero}>
                <Image source={meal.image} style={styles.detailHeroImage} />
                <View style={styles.detailHeroOverlay} />
                <Pressable accessibilityLabel="Back to log" onPress={onBack} style={styles.detailBackButton}>
                    <Text style={styles.detailBackText}>←</Text>
                </Pressable>
                <View style={styles.detailHeroContent}>
                    <View style={styles.detailTag}>
                        <Text style={styles.detailTagText}>{meta.tag}</Text>
                    </View>
                    <Text style={styles.detailHeroTitle}>{meal.title}</Text>
                    <Text style={styles.detailHeroSubtitle}>{meta.subtitle}</Text>
                    <View style={styles.detailStatsRow}>
                        {meta.stats.map((item) => (
                            <View key={item.label} style={styles.detailStatPill}>
                                <Text style={styles.detailStatValue}>{item.value}</Text>
                                <Text style={styles.detailStatLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.detailSectionHeader}>
                <Text style={styles.detailSectionTitle}>Ingredients</Text>
                <Pressable onPress={() => {
                    const ingList = ingredients.map(ing => ({
                        title: ing.title,
                        amount: ing.amount,
                        note: ing.note
                    }));
                    addIngredientsToShoppingList(ingList);
                    Alert.alert(
                        "Shopping List",
                        "All ingredients have been added to your Automated Shopping List!",
                        [{ text: "OK" }]
                    );
                }}>
                    <Text style={styles.detailSectionAction}>Add all to list</Text>
                </Pressable>
            </View>
            <View style={styles.detailSectionCard}>
                {ingredients.map((item) => (
                    <View key={item.title} style={styles.detailIngredientRow}>
                        <View style={styles.detailCheckbox}>
                            {item.checked ? <Text style={styles.detailCheckboxTick}>✓</Text> : null}
                        </View>
                        <View style={styles.detailIngredientCopy}>
                            <Text style={styles.detailRowTitle}>{item.title}</Text>
                            <Text style={styles.detailRowMeta}>{item.note}</Text>
                        </View>
                        <Text style={styles.detailRowValue}>{item.amount}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.detailSectionCard}>
                <Text style={styles.detailSectionTitle}>Nutritional Info</Text>
                {breakdown.map((item) => (
                    <View key={item.label} style={styles.detailNutritionRow}>
                        <View style={styles.detailNutritionHeader}>
                            <Text style={styles.detailRowTitle}>{item.label}</Text>
                            <Text style={styles.detailRowValue}>{item.value}</Text>
                        </View>
                        <View style={styles.detailNutritionTrack}>
                            <View style={[styles.detailNutritionFill, { width: item.progress as any, backgroundColor: item.color }]} />
                        </View>
                    </View>
                ))}
            </View>

            <Text style={styles.detailStepsTitle}>Step-by-Step Instructions</Text>
            {steps.map((step, index) => (
                <View key={step.title} style={styles.detailStepCard}>
                    <View style={styles.detailStepBadge}>
                        <Text style={styles.detailStepNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.detailStepTitle}>{step.title}</Text>
                    <Text style={styles.detailStepText}>{step.text}</Text>
                    {step.image ? (
                        <View style={styles.detailStepImageFrame}>
                            <Image source={step.image} style={styles.detailStepImage} />
                        </View>
                    ) : null}
                </View>
            ))}

            <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isAdded }}
                onPress={() => {
                    if (isAdded) {
                        removeMealLog(meal.id);
                        Alert.alert("Meal Plan", "Meal removed from today's plan.");
                    } else {
                        addMealLog({
                            type: meal.type,
                            title: meal.title,
                            time: meal.time,
                            image: meal.image,
                            description: meal.description,
                            macros: meal.macros,
                            calories: meal.calories,
                            protein: meal.protein,
                            carbs: meal.carbs,
                            fat: meal.fat,
                        });
                        Alert.alert("Meal Plan", "Meal added to today's plan!");
                    }
                    onBack();
                }}
                style={[styles.detailActionPrimary, isAdded && styles.detailActionPrimaryActive]}
            >
                <Text style={styles.detailActionPrimaryText}>{isAdded ? 'Remove from Meal Plan' : 'Add to Meal Plan'}</Text>
            </Pressable>
        </View>
    );
}

function getMealDetailMeta(mealId: string) {
    if (mealId === 'breakfast') {
        return {
            tag: 'HIGH PROTEIN',
            subtitle: 'Traditional breakfast bowl with creamy avocado and soft eggs.',
            stats: [
                { label: 'kcal', value: '420' },
                { label: 'mins', value: '10' },
                { label: 'servings', value: '1' },
            ],
        };
    }

    if (mealId === 'lunch') {
        return {
            tag: 'BALANCED',
            subtitle: 'Mediterranean bowl with lean protein and fresh greens.',
            stats: [
                { label: 'kcal', value: '650' },
                { label: 'mins', value: '20' },
                { label: 'servings', value: '1' },
            ],
        };
    }

    return {
        tag: 'OMEGA-3',
        subtitle: 'Flaky salmon with roasted vegetables and quinoa.',
        stats: [
            { label: 'kcal', value: '520' },
            { label: 'mins', value: '25' },
            { label: 'servings', value: '1' },
        ],
    };
}

function getMealIngredients(mealId: string) {
    if (mealId === 'breakfast') {
        return [
            { title: 'Avocado', note: 'Ripe, sliced', amount: '80g', checked: false },
            { title: 'Poached eggs', note: 'Free-range', amount: '100g', checked: false },
            { title: 'Sourdough toast', note: 'Lightly toasted', amount: '60g', checked: false },
            { title: 'Chili flakes', note: 'Optional', amount: '1g', checked: true },
        ];
    }

    if (mealId === 'lunch') {
        return [
            { title: 'Grilled chicken', note: 'Skinless', amount: '140g', checked: false },
            { title: 'Chickpeas', note: 'Cooked', amount: '90g', checked: false },
            { title: 'Cucumber', note: 'Sliced', amount: '80g', checked: false },
            { title: 'Rice', note: 'Cooked', amount: '120g', checked: true },
        ];
    }

    return [
        { title: 'Atlantic salmon', note: 'Seared', amount: '180g', checked: false },
        { title: 'Asparagus', note: 'Blanched', amount: '120g', checked: false },
        { title: 'Quinoa', note: 'Cooked', amount: '110g', checked: false },
        { title: 'Roasted almonds', note: 'Crushed', amount: '10g', checked: true },
    ];
}

function getMealSteps(mealId: string) {
    if (mealId === 'breakfast') {
        return [
            {
                title: 'Toast the bread',
                text: 'Lightly toast the sourdough until crisp and golden.',
                image: logBreakfastImage,
            },
            {
                title: 'Poach eggs',
                text: 'Poach eggs in simmering water for 3-4 minutes.',
                image: logDinnerImage,
            },
            {
                title: 'Assemble',
                text: 'Layer avocado slices, eggs, and finish with chili flakes.',
                image: logLunchImage,
            },
        ];
    }

    if (mealId === 'lunch') {
        return [
            {
                title: 'Grill chicken',
                text: 'Season and grill chicken until cooked through.',
                image: logLunchImage,
            },
            {
                title: 'Prep bowl',
                text: 'Combine chickpeas, cucumber, and rice in a bowl.',
                image: logBreakfastImage,
            },
            {
                title: 'Finish',
                text: 'Slice chicken and top with a light herb dressing.',
                image: logDinnerImage,
            },
        ];
    }

    return [
        {
            title: 'Sear salmon',
            text: 'Sear salmon 3-4 minutes per side until flaky.',
            image: logDinnerImage,
        },
        {
            title: 'Roast vegetables',
            text: 'Roast asparagus and almonds with olive oil.',
            image: logLunchImage,
        },
        {
            title: 'Plate',
            text: 'Serve salmon over quinoa with roasted sides.',
            image: logBreakfastImage,
        },
    ];
}

function getMealBreakdown(mealId: string) {
    if (mealId === 'breakfast') {
        return [
            { label: 'Protein', value: '18g', progress: '55%', color: '#0F766E' },
            { label: 'Carbs', value: '35g', progress: '38%', color: '#2563EB' },
            { label: 'Fats', value: '22g', progress: '32%', color: '#16A34A' },
        ];
    }

    if (mealId === 'lunch') {
        return [
            { label: 'Protein', value: '32g', progress: '62%', color: '#0F766E' },
            { label: 'Carbs', value: '68g', progress: '52%', color: '#2563EB' },
            { label: 'Fats', value: '18g', progress: '24%', color: '#16A34A' },
        ];
    }

    return [
        { label: 'Protein', value: '38g', progress: '70%', color: '#0F766E' },
        { label: 'Carbs', value: '24g', progress: '28%', color: '#2563EB' },
        { label: 'Fats', value: '24g', progress: '35%', color: '#16A34A' },
    ];
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
    const { waterConsumedLiters, waterGoalLiters } = useApp();
    const activeDotsCount = Math.round((waterConsumedLiters / waterGoalLiters) * 5);

    return (
        <View style={styles.hydrationCard}>
            <View style={styles.logMealHeader}>
                <View style={[styles.mealIconCircle, { backgroundColor: '#BFDAFF' }]}>
                    <SvgIcon color="#1D7BE3" height={15} source={svgIcons.water} width={12} />
                </View>
                <Text style={styles.hydrationTitle}>Hydration</Text>
            </View>
            <Text style={styles.hydrationValue}>
                {waterConsumedLiters.toFixed(1)} <Text style={styles.hydrationGoal}>/ {waterGoalLiters.toFixed(1)}L</Text>
            </Text>
            <View style={styles.hydrationDots}>
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} style={[styles.hydrationDot, item <= activeDotsCount && styles.hydrationDotActive]} />
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
        fontWeight: undefined,
        fontSize: 12,
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
        resizeMode: 'contain',
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
    detailActionPrimary: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 999,
        marginTop: spacing.xl,
        paddingVertical: spacing.md,
    },
    detailActionPrimaryActive: {
        backgroundColor: colors.primaryDark,
    },
    detailActionPrimaryText: {
        color: colors.surface,
        ...font.bold,
        fontSize: 16,
    },
    detailBackButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(17,24,39,0.4)',
        borderRadius: 999,
        height: 36,
        justifyContent: 'center',
        left: 16,
        position: 'absolute',
        top: 18,
        width: 36,
        zIndex: 2,
    },
    detailBack: {
        alignSelf: 'flex-start',
        marginBottom: spacing.lg,
    },
    detailBackText: {
        color: colors.surface,
        ...font.bold,
        fontSize: 18,
    },
    detailHero: {
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        height: 260,
        marginHorizontal: -25,
        overflow: 'hidden',
    },
    detailHeroContent: {
        bottom: 16,
        left: 20,
        position: 'absolute',
        right: 20,
    },
    detailHeroImage: {
        height: '100%',
        width: '100%',
    },
    detailHeroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15,23,42,0.45)',
    },
    detailHeroSubtitle: {
        color: 'rgba(255,255,255,0.82)',
        fontFamily: fontFamily.regular,
        fontWeight: undefined,
        fontSize: 13,
        marginTop: spacing.xs,
    },
    detailHeroTitle: {
        color: colors.surface,
        ...font.manropeExtraBold,
        fontSize: 24,
        marginTop: spacing.sm,
    },
    detailSectionAction: {
        color: colors.primary,
        ...font.semiBold,
        fontSize: 12,
    },
    detailSectionHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
    },
    detailTag: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primary,
        borderRadius: 999,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    detailTagText: {
        color: colors.surface,
        ...font.bold,
        fontSize: 10,
        letterSpacing: 1,
    },
    detailStatsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    detailStatPill: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 16,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    detailStatValue: {
        color: colors.ink,
        ...font.bold,
        fontSize: 16,
    },
    detailStatLabel: {
        color: colors.inkMuted,
        ...font.semiBold,
        fontSize: 10,
        letterSpacing: 1,
        marginTop: spacing.xxs,
        textTransform: 'uppercase',
    },
    detailIngredientRow: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: spacing.md,
    },
    detailIngredientCopy: {
        flex: 1,
        marginRight: spacing.md,
    },
    detailCheckbox: {
        alignItems: 'center',
        borderColor: colors.primary,
        borderRadius: 999,
        borderWidth: 1.5,
        height: 22,
        justifyContent: 'center',
        marginRight: spacing.md,
        width: 22,
    },
    detailCheckboxTick: {
        color: colors.primary,
        ...font.bold,
        fontSize: 12,
    },
    detailNutritionRow: {
        marginTop: spacing.md,
    },
    detailNutritionHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailNutritionTrack: {
        backgroundColor: colors.accentSoft,
        borderRadius: 999,
        height: 8,
        marginTop: spacing.sm,
        overflow: 'hidden',
    },
    detailNutritionFill: {
        borderRadius: 999,
        height: '100%',
    },
    detailCopy: {
        color: colors.inkMuted,
        fontFamily: fontFamily.regular,
        fontWeight: undefined,
        fontSize: 16,
        lineHeight: 24,
        marginTop: spacing.sm,
    },
    detailHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: spacing.lg,
    },
    detailImage: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    detailImageFrame: {
        borderRadius: 18,
        height: 220,
        overflow: 'hidden',
    },
    detailPage: {
        paddingTop: spacing.lg,
    },
    detailRowMeta: {
        color: colors.inkSoft,
        fontFamily: fontFamily.regular,
        fontWeight: undefined,
        fontSize: 12,
        marginTop: spacing.xxs,
    },
    detailRowSplit: {
        alignItems: 'center',
        borderColor: '#E9EEF9',
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    detailRowTitle: {
        color: colors.ink,
        ...font.semiBold,
        fontSize: 14,
    },
    detailRowValue: {
        color: colors.primary,
        ...font.bold,
        fontSize: 14,
    },
    detailSectionCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        marginTop: spacing.lg,
        padding: spacing.lg,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    detailSectionTitle: {
        color: colors.ink,
        ...font.manropeBold,
        fontSize: 18,
    },
    detailStepCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        marginTop: spacing.lg,
        padding: spacing.lg,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    detailStepBadge: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 999,
        height: 30,
        justifyContent: 'center',
        width: 30,
    },
    detailStepNumber: {
        color: colors.surface,
        ...font.bold,
        fontSize: 12,
    },
    detailStepText: {
        color: colors.inkMuted,
        fontFamily: fontFamily.regular,
        fontWeight: undefined,
        fontSize: 13,
        lineHeight: 20,
        marginTop: spacing.xxs,
    },
    detailStepTitle: {
        color: colors.ink,
        ...font.semiBold,
        fontSize: 14,
    },
    detailStepImageFrame: {
        borderRadius: 16,
        height: 140,
        marginTop: spacing.md,
        overflow: 'hidden',
    },
    detailStepImage: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    detailStepsTitle: {
        color: colors.ink,
        ...font.manropeBold,
        fontSize: 20,
        marginTop: spacing.xl,
    },
    detailTitle: {
        color: colors.ink,
        ...font.manropeBold,
        fontSize: 24,
        marginTop: spacing.lg,
    },
    detailType: {
        color: colors.ink,
        ...font.manropeBold,
        flex: 1,
        fontSize: 18,
        marginLeft: spacing.sm,
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
        fontWeight: undefined,
        fontSize: 14,
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
