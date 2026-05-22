import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const font = {
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  manropeBold: { fontFamily: fontFamily.manropeBold, fontWeight: undefined },
} as const;

export function ProgressScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.copy}>Track nutrition consistency, hydration, and weekly goal progress here.</Text>
        <View style={styles.metricRow}>
          <Metric label="Calories" value="78%" />
          <Metric label="Protein" value="62%" />
          <Metric label="Hydration" value="60%" />
        </View>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
  metric: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 18,
    flex: 1,
    paddingVertical: spacing.lg,
  },
  metricLabel: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 10,
    marginTop: spacing.xs,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  metricValue: {
    color: colors.primary,
    ...font.bold,
    fontSize: 18,
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
