import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const font = {
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  manropeBold: { fontFamily: fontFamily.manropeBold, fontWeight: undefined },
} as const;

export function RecipesScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Recipes</Text>
        <Text style={styles.copy}>Browse meal ideas and saved recipes from this tab.</Text>
        <View style={styles.row}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>High Protein</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Quick Meals</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xxl,
  },
  copy: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  pill: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pillText: {
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  screen: {
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 28,
  },
});
