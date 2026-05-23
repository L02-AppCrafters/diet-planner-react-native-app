import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
} as const;

type Ingredient = {
  checked?: boolean;
  detail: string;
  image?: number;
  name: string;
};

type IngredientSection = {
  count: string;
  icon: string;
  items: Ingredient[];
  title: string;
};

const ingredientSections: IngredientSection[] = [
  {
    count: '4 items',
    icon: svgIcons.produce,
    title: 'PRODUCE',
    items: [
      { name: 'Rau thom', detail: '2 bundles - Organic preferred' },
      { name: 'Ca chua bi', detail: '250g - Red, ripe' },
      { checked: true, name: 'Hanh tay', detail: '2 pieces - Medium size' },
    ],
  },
  {
    count: '1 item',
    icon: svgIcons.meatPoultry,
    title: 'MEAT & POULTRY',
    items: [{ name: 'Ga (Uc ga)', detail: '500g - Boneless, skinless' }],
  },
  {
    count: '2 items',
    icon: svgIcons.dairy,
    title: 'DAIRY',
    items: [
      { name: 'Sua chua Hy Lap', detail: '1 tub - Unsweetened' },
      { name: 'Pho mai Feta', detail: '200g - Block' },
    ],
  },
];

export function MainIngredientsScreen() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ingredientSections.forEach((section) => {
      section.items.forEach((item) => {
        initial[item.name] = Boolean(item.checked);
      });
    });
    return initial;
  });

  const toggleItem = (name: string) => {
    setCheckedItems((current) => ({ ...current, [name]: !current[name] }));
  };

  return (
    <View style={styles.screen}>
      <OptimizationCard />
      {ingredientSections.map((section) => (
        <IngredientSectionCard checkedItems={checkedItems} key={section.title} section={section} onToggle={toggleItem} />
      ))}
      <Pressable style={styles.addCustomButton}>
        <View style={styles.addCircle}>
          <Text style={styles.addIcon}>+</Text>
        </View>
        <Text style={styles.addCustomText}>Add Custom Item</Text>
      </Pressable>
    </View>
  );
}

function OptimizationCard() {
  return (
    <View style={styles.optimizationCard}>
      <View style={styles.optimizationRail} />
          <SvgIcon height={24} source={svgIcons.aiInsight} width={24} />
      <View style={styles.optimizationCopy}>
        <Text style={styles.optimizationTitle}>AI Optimization</Text>
        <Text style={styles.optimizationText}>
          Based on your meal plan for the next 4 days, I've consolidated ingredients to save you 15% on waste. Ensure
          the Rau thom is stored in a damp paper towel.
        </Text>
      </View>
    </View>
  );
}

function IngredientSectionCard({
  checkedItems,
  onToggle,
  section,
}: {
  checkedItems: Record<string, boolean>;
  onToggle: (name: string) => void;
  section: IngredientSection;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <SvgIcon height={18} source={section.icon} width={18} />
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{section.count}</Text>
        </View>
      </View>
      <View style={styles.ingredientList}>
        {section.items.map((item) => (
          <IngredientItem checked={checkedItems[item.name]} item={item} key={item.name} onToggle={onToggle} />
        ))}
      </View>
    </View>
  );
}

function IngredientItem({
  checked,
  item,
  onToggle,
}: {
  checked: boolean;
  item: Ingredient;
  onToggle: (name: string) => void;
}) {
  return (
    <Pressable onPress={() => onToggle(item.name)} style={styles.ingredientCard}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <View style={styles.ingredientCopy}>
        <Text style={[styles.ingredientName, checked && styles.checkedText]}>{item.name}</Text>
        <Text style={[styles.ingredientDetail, checked && styles.checkedText]}>{item.detail}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addCircle: {
    alignItems: 'center',
    borderColor: colors.inkMuted,
    borderRadius: 999,
    borderWidth: 3,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  addCustomButton: {
    alignItems: 'center',
    borderColor: '#B9CDBA',
    borderRadius: 28,
    borderStyle: 'dashed',
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 18,
  },
  addCustomText: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 16,
  },
  addIcon: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 18,
    includeFontPadding: false,
    lineHeight: 18,
  },
  checkMark: {
    color: colors.surface,
    ...font.bold,
    fontSize: 13,
    includeFontPadding: false,
    lineHeight: 13,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#C6D2C6',
    borderRadius: 999,
    borderWidth: 3,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkedText: {
    color: '#A8AEA8',
    textDecorationLine: 'line-through',
  },
  countBadge: {
    backgroundColor: '#A9ECCC',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  countText: {
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
  },
  ingredientCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 26,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 76,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  ingredientCopy: {
    flex: 1,
  },
  ingredientDetail: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 14,
    marginTop: 4,
  },
  ingredientList: {
    gap: 18,
    marginTop: spacing.lg,
  },
  ingredientName: {
    color: colors.ink,
    ...font.bold,
    fontSize: 17,
  },
  optimizationCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: 28,
    overflow: 'hidden',
    paddingHorizontal: 28,
    paddingVertical: 28,
  },
  optimizationCopy: {
    flex: 1,
  },
  optimizationRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    bottom: 24,
    left: 0,
    position: 'absolute',
    top: 24,
    width: 4,
  },
  optimizationText: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 15,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  optimizationTitle: {
    color: colors.ink,
    ...font.bold,
    fontSize: 20,
  },
  screen: {
    paddingTop: spacing.xl,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 16,
    letterSpacing: 2,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
