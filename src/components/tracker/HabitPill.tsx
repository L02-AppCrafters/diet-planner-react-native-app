import { StyleSheet, Text, View } from 'react-native';
import { HabitItem } from '../../types/tracker';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type HabitPillProps = {
  habit: HabitItem;
};

export function HabitPill({ habit }: HabitPillProps) {
  return (
    <View style={[styles.pill, habit.completed ? styles.completed : styles.pending]}>
      <View style={[styles.dot, habit.completed ? styles.completedDot : styles.pendingDot]} />
      <Text style={styles.label}>{habit.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  completed: {
    backgroundColor: colors.primarySoft,
  },
  completedDot: {
    backgroundColor: colors.primary,
  },
  dot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  label: {
    ...typography.caption,
    color: colors.ink,
  },
  pending: {
    backgroundColor: colors.dangerSoft,
  },
  pendingDot: {
    backgroundColor: colors.danger,
  },
  pill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
