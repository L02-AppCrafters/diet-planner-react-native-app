import { StyleSheet, Text, View } from 'react-native';
import { MacroItem } from '../../types/tracker';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type MacroCardProps = {
  macro: MacroItem;
};

export function MacroCard({ macro }: MacroCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{macro.value}g</Text>
      <Text style={styles.label}>{macro.label}</Text>
      <View style={[styles.line, { backgroundColor: macro.color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.inkMuted,
    marginTop: spacing.xs,
  },
  line: {
    borderRadius: 999,
    height: 3,
    marginTop: spacing.sm,
    width: 28,
  },
  value: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
});
