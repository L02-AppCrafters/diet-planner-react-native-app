import React, { createContext, useContext, useState } from 'react';

export type MacroItem = {
  label: string;
  value: number;
  target: number;
  color: string;
};

export type MealLogItem = {
  id: string;
  type: string; // 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  title: string;
  time: string;
  image: any;
  description: string;
  macros: Array<{ label: string; value: string }>;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type ShoppingItem = {
  id: string;
  title: string;
  amount: string;
  note: string;
  checked: boolean;
};

type AppContextType = {
  caloriesGoal: number;
  consumedCalories: number;
  waterConsumedLiters: number;
  waterGoalLiters: number;
  macros: {
    PROTEIN: MacroItem;
    CARBS: MacroItem;
    FAT: MacroItem;
  };
  loggedMeals: MealLogItem[];
  shoppingList: ShoppingItem[];
  addWater: (amount: number) => void;
  addMealLog: (meal: Omit<MealLogItem, 'id'>) => void;
  removeMealLog: (id: string) => void;
  addIngredientsToShoppingList: (ingredients: Array<{ title: string; amount: string; note: string }>) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMeals: MealLogItem[] = [
  {
    id: 'breakfast',
    type: 'Breakfast',
    title: 'Avocado & Poached Egg',
    time: '08:30 AM',
    image: require('../../assets/log-breakfast-new.png'),
    description: 'Creamy avocado toast topped with poached eggs, herbs, and chili flakes for steady morning energy.',
    calories: 420,
    protein: 18,
    carbs: 35,
    fat: 22,
    macros: [
      { label: 'CALS', value: '420' },
      { label: 'PROTEIN', value: '18g' },
      { label: 'FAT', value: '22g' },
    ],
  },
  {
    id: 'lunch',
    type: 'Lunch',
    title: 'Mediterranean Power Bowl',
    time: '12:45 PM',
    image: require('../../assets/log-lunch-new.png'),
    description: 'A balanced bowl with grilled chicken, chickpeas, cucumber, and rice for a filling midday meal.',
    calories: 650,
    protein: 32,
    carbs: 68,
    fat: 18,
    macros: [
      { label: 'CALS', value: '650' },
      { label: 'PROTEIN', value: '32g' },
      { label: 'FAT', value: '18g' },
    ],
  },
  {
    id: 'dinner',
    type: 'Dinner',
    title: 'Atlantic Salmon & Asparagus',
    time: '07:15 PM',
    image: require('../../assets/log-dinner-new.png'),
    description: 'High in Omega-3 fatty acids. Served with a side of zesty quinoa and roasted almonds.',
    calories: 520,
    protein: 38,
    carbs: 24,
    fat: 24,
    macros: [
      { label: 'CALS', value: '520' },
      { label: 'PROTEIN', value: '38g' },
      { label: 'FAT', value: '24g' },
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [caloriesGoal] = useState<number>(2450);
  const [waterGoalLiters] = useState<number>(3.0);
  
  // States initialized to match the pixel-perfect mockup starting values
  const [waterConsumedLiters, setWaterConsumedLiters] = useState<number>(1.8);
  const [loggedMeals, setLoggedMeals] = useState<MealLogItem[]>(initialMeals);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  // Compute actual consumed calories and macros based on starting offsets (representing history) 
  // plus any newly added meals.
  // Breakfast (420), Lunch (650), Dinner (520) total = 1590.
  // The home screen mockup shows 1240 consumed (e.g. they ate breakfast and partially something else, 
  // but let's base it dynamically to be super clean! Or we can start with initial dynamic sums).
  // Let's use a nice baseline state:
  // Initial Consumed: 1240 kcal (matching Home Tab mockup). When a new meal is logged, we add it.
  const [consumedCalories, setConsumedCalories] = useState<number>(1240);
  const [proteinConsumed, setProteinConsumed] = useState<number>(112);
  const [carbsConsumed, setCarbsConsumed] = useState<number>(145);
  const [fatConsumed, setFatConsumed] = useState<number>(58);

  const addWater = (amount: number) => {
    setWaterConsumedLiters((prev) => Math.min(prev + amount, waterGoalLiters));
  };

  const addMealLog = (meal: Omit<MealLogItem, 'id'>) => {
    const newId = `${meal.type.toLowerCase()}-${Date.now()}`;
    const newMeal: MealLogItem = { ...meal, id: newId };
    
    setLoggedMeals((prev) => [...prev, newMeal]);
    
    // Add to daily calorie and macro consumed state
    setConsumedCalories((prev) => prev + meal.calories);
    setProteinConsumed((prev) => prev + meal.protein);
    setCarbsConsumed((prev) => prev + meal.carbs);
    setFatConsumed((prev) => prev + meal.fat);
  };

  const removeMealLog = (id: string) => {
    const mealToRemove = loggedMeals.find((m) => m.id === id);
    if (!mealToRemove) return;

    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
    setConsumedCalories((prev) => Math.max(0, prev - mealToRemove.calories));
    setProteinConsumed((prev) => Math.max(0, prev - mealToRemove.protein));
    setCarbsConsumed((prev) => Math.max(0, prev - mealToRemove.carbs));
    setFatConsumed((prev) => Math.max(0, prev - mealToRemove.fat));
  };

  const addIngredientsToShoppingList = (ingredients: Array<{ title: string; amount: string; note: string }>) => {
    setShoppingList((prev) => {
      const updatedList = [...prev];
      ingredients.forEach((ing) => {
        // Check if ingredient already exists (case-insensitive)
        const existingIndex = updatedList.findIndex(
          (item) => item.title.toLowerCase() === ing.title.toLowerCase()
        );
        if (existingIndex > -1) {
          // In a real app we might combine amounts, for prototype we can just append or keep existing
          // Let's just leave it if it exists or update note
        } else {
          updatedList.push({
            id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: ing.title,
            amount: ing.amount,
            note: ing.note,
            checked: false,
          });
        }
      });
      return updatedList;
    });
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearShoppingList = () => {
    setShoppingList([]);
  };

  const macros = {
    PROTEIN: { label: 'PROTEIN', value: proteinConsumed, target: 180, color: '#006C49' },
    CARBS: { label: 'CARBS', value: carbsConsumed, target: 300, color: '#2563EB' },
    FAT: { label: 'FAT', value: fatConsumed, target: 75, color: '#22C55E' },
  };

  return (
    <AppContext.Provider
      value={{
        caloriesGoal,
        consumedCalories,
        waterConsumedLiters,
        waterGoalLiters,
        macros,
        loggedMeals,
        shoppingList,
        addWater,
        addMealLog,
        removeMealLog,
        addIngredientsToShoppingList,
        toggleShoppingItem,
        removeShoppingItem,
        clearShoppingList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
