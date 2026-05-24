export type ApiTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ApiUser = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  height: string | null;
  weight: string | null;
  gender: string | null;
  goal: string | null;
  calories: number | null;
  proteins: number | null;
  age: number | null;
  activityLevel: string | null;
  carbsGoal: number | null;
  fatsGoal: number | null;
  credit: number;
  subscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FoodNutritionItem = {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedFoodNutrition = {
  data: FoodNutritionItem[];
  total: number;
  page: number;
  limit: number;
};

export type DailyLog = {
  id: string;
  uid: string;
  logDate: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  waterMl: number;
  currentWeight: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MealPlan = {
  id: string;
  recipeId: string | null;
  recipe: Recipe | null;
  foodNutritionId: string | null;
  foodNutrition: FoodNutritionItem | null;
  servings: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  uid: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMealPlanInput = {
  recipeId?: string;
  foodNutritionId?: string;
  servings?: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

export type Recipe = {
  id: string;
  jsonData: {
    calories?: number;
    carbs?: number;
    category?: string[];
    cookTime?: number;
    description?: string;
    fats?: number;
    ingredients?: Array<{ icon?: string; ingredient: string; quantity?: string }>;
    mealType?: string;
    proteins?: number;
    recipeName?: string;
    serveTo?: number;
    steps?: string[];
  };
  imageUrl: string;
  isDefault: boolean;
  recipeName: string;
  uid: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertDailyLogInput = {
  logDate: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  waterMl?: number;
  currentWeight?: number;
  notes?: string;
};
