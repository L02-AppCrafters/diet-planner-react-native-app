import { colors } from '../theme/colors';
import { MacroItem, MealItem } from '../types/tracker';

export const macros: MacroItem[] = [
  { label: 'CALORIES', value: 1240, target: 2450, color: '#006C49' },
  { label: 'PROTEIN', value: 112, target: 180, color: '#3B82F6' },
  { label: 'FATS', value: 58, target: 75, color: '#F59E0B' },
];

export const meals: MealItem[] = [
  {
    id: 'salad',
    title: 'Grilled Chicken Salad',
    time: '12:30 PM',
    calories: 427,
    accent: colors.primary,
    items: ['Chicken', 'Avocado', 'Greens'],
  },
];

export const weeklyCalories = [1280, 1470, 1320, 1210, 1560, 1425, 1500];
