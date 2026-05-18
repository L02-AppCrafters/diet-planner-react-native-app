export type MacroItem = {
  label: string;
  value: number;
  target: number;
  color: string;
};

export type MealItem = {
  id: string;
  title: string;
  time: string;
  calories: number;
  accent: string;
  items: string[];
};

export type HabitItem = {
  id: string;
  label: string;
  completed: boolean;
};
