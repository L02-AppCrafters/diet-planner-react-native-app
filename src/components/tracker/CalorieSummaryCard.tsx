import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type CalorieSummaryCardProps = {
  calories: number;
};

export function CalorieSummaryCard({ calories }: CalorieSummaryCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.arcBack}>
        <View style={styles.arcMask} />
      </View>
      <View style={styles.valueWrap}>
        <Text style={styles.value}>{calories.toLocaleString()}</Text>
        <Text style={styles.label}>Calories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arcBack: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 86,
    borderWidth: 12,
    height: 172,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 172,
  },
  arcMask: {
    backgroundColor: colors.background,
    bottom: -14,
    height: 74,
    position: 'absolute',
    width: 190,
  },
  label: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: spacing.xs,
  },
  value: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
  },
  valueWrap: {
    alignItems: 'center',
    bottom: 42,
    position: 'absolute',
  },
  wrapper: {
    alignItems: 'center',
    height: 146,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
});
