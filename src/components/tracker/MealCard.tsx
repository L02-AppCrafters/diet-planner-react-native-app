import { StyleSheet, Text, View } from 'react-native';
import { MealItem } from '../../types/tracker';
import { Card } from '../ui/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type MealCardProps = {
  meal: MealItem;
};

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.image}>
        <View style={[styles.plate, { borderColor: meal.accent }]}>
          <View style={styles.foodPrimary} />
          <View style={styles.foodSecondary} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{meal.title}</Text>
          <Text style={styles.kcal}>{meal.calories} kcal</Text>
        </View>
        <Text style={styles.time}>{meal.time}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  foodPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 22,
    left: 12,
    position: 'absolute',
    top: 13,
    width: 28,
  },
  foodSecondary: {
    backgroundColor: colors.warning,
    borderRadius: 999,
    height: 18,
    position: 'absolute',
    right: 12,
    top: 20,
    width: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    height: 68,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 82,
  },
  kcal: {
    ...typography.caption,
    color: colors.primary,
  },
  plate: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 3,
    height: 54,
    width: 64,
  },
  time: {
    ...typography.caption,
    color: colors.inkSoft,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
  },
});
