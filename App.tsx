import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { Manrope_400Regular, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import * as SecureStore from 'expo-secure-store';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from './src/screens/auth/AuthScreen';
import { HomeMetrics, HomeScreen } from './src/screens/home/HomeScreen';
import { ChooseGoalScreen } from './src/screens/onboarding/ChooseGoalScreen';
import { BodyProfileScreen } from './src/screens/onboarding/BodyProfileScreen';
import { SettingsProfileScreen } from './src/screens/profile/SettingsProfileScreen';
import { ApiClient, ApiError, ApiTokens, DailyLog, MealPlan, Recipe } from './src/services/api';
import { colors } from './src/theme/colors';
import { AppTab } from './src/types/navigation';

export type AppFlow = 'OnboardingGoal' | 'OnboardingProfile' | 'Auth' | 'MainApp' | 'SettingsProfile';

type UserProfile = {
  activityLevel: string;
  age: number;
  goal: string;
  height: number;
  tdee: number;
  weight: number;
  weightHistory: { date: string; weight: number }[];
};

const ACCESS_TOKEN_KEY = 'nutriPlanner.accessToken';
const REFRESH_TOKEN_KEY = 'nutriPlanner.refreshToken';
const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const tokenStorage = {
  async deleteItem(key: string) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return globalThis.localStorage?.getItem(key) ?? null;
    }

    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value);
  },
};

function parseStoredNumber(value: string | null, fallback: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapUserToProfile(user: Awaited<ReturnType<ApiClient['me']>>, fallback: UserProfile): UserProfile {
  return {
    ...fallback,
    activityLevel: user.activityLevel ?? fallback.activityLevel,
    age: user.age ?? fallback.age,
    goal: user.goal ?? fallback.goal,
    height: parseStoredNumber(user.height, fallback.height),
    tdee: user.calories ?? fallback.tdee,
    weight: parseStoredNumber(user.weight, fallback.weight),
  };
}

export default function App() {
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('OnboardingGoal');
  const [activeTab, setActiveTab] = useState<AppTab>('Home');
  const accessTokenRef = useRef<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<DailyLog[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [weeklyMealPlans, setWeeklyMealPlans] = useState<MealPlan[]>([]);
  const [selectedLogDate, setSelectedLogDate] = useState(() => formatDate(new Date()));
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [waterTargetLiters, setWaterTargetLiters] = useState(2.5);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    goal: 'lose_weight',
    height: 175,
    weight: 70,
    age: 28,
    activityLevel: 'sedentary',
    tdee: 2450,
    weightHistory: [
      { date: '2026-05-22', weight: 70.2 },
      { date: '2026-05-23', weight: 70.0 }
    ] as { date: string; weight: number }[]
  });

  const api = useMemo(
    () =>
      new ApiClient({
        baseUrl: process.env.EXPO_PUBLIC_API_URL,
        getAccessToken: () => accessTokenRef.current,
        onTokensRefreshed: async (tokens: ApiTokens) => {
          accessTokenRef.current = tokens.accessToken;
          await tokenStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
          await tokenStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        },
        onUnauthorized: async () => {
          accessTokenRef.current = null;
          await tokenStorage.deleteItem(ACCESS_TOKEN_KEY);
          await tokenStorage.deleteItem(REFRESH_TOKEN_KEY);
          setCurrentFlow('Auth');
        },
      }),
    [],
  );

  const showSuccessToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
      toastTimerRef.current = null;
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStoredTokens = async () => {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          tokenStorage.getItem(ACCESS_TOKEN_KEY),
          tokenStorage.getItem(REFRESH_TOKEN_KEY),
        ]);

        if (!isMounted) {
          return;
        }

        accessTokenRef.current = accessToken;
        api.setRefreshToken(refreshToken);

        if (accessToken || refreshToken) {
          const user = await api.me();

          if (!isMounted) {
            return;
          }

          setProfile((prev) => mapUserToProfile(user, prev));
          setCurrentFlow('MainApp');
        }
      } catch {
        accessTokenRef.current = null;
        api.setRefreshToken(null);
        await Promise.all([
          tokenStorage.deleteItem(ACCESS_TOKEN_KEY),
          tokenStorage.deleteItem(REFRESH_TOKEN_KEY),
        ]);
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    loadStoredTokens();

    return () => {
      isMounted = false;
    };
  }, [api]);

  useEffect(() => {
    if (currentFlow !== 'MainApp' || !accessTokenRef.current) {
      return;
    }

    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const today = new Date();
        const startDate = formatDate(startOfWeek(today));
        const endDate = formatDate(endOfWeek(today));
        const todayDate = formatDate(today);
        const [currentLog, rangeLogs, recipeRows, mealPlanRows, weekMealPlanRows] = await Promise.all([
          api.getDailyLog(todayDate),
          api.getDailyLogs(startDate, endDate),
          api.getRecipes(),
          api.getMealPlans(selectedLogDate),
          api.getMealPlans({ endDate, startDate }),
        ]);

        if (!isMounted) {
          return;
        }

        setTodayLog(currentLog);
        setWeeklyLogs(rangeLogs);
        setRecipes(recipeRows);
        setMealPlans(mealPlanRows);
        setWeeklyMealPlans(weekMealPlanRows);
      } catch {
        if (isMounted) {
          setTodayLog(null);
          setWeeklyLogs([]);
          setMealPlans([]);
          setWeeklyMealPlans([]);
          setRecipes([]);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, [api, currentFlow, selectedLogDate]);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Manrope_400Regular,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded || isCheckingSession) {
    return <SafeAreaView style={styles.safeArea} />;
  }

  const buildInitialWeightHistory = (weight: number) => [
    { date: '2026-05-22', weight: Math.round((weight + 0.2) * 10) / 10 },
    { date: '2026-05-23', weight },
  ];

  const syncProfileToBackend = async (profileToSync = profile) => {
    const proteinGoal = Math.round((profileToSync.weight * 1.8) / 5) * 5;
    const fatsGoal = Math.round((profileToSync.tdee * 0.25) / 9);
    const carbsGoal = Math.max(0, Math.round((profileToSync.tdee - proteinGoal * 4 - fatsGoal * 9) / 4));

    await api.updateMe({
      activityLevel: profileToSync.activityLevel,
      age: profileToSync.age,
      calories: profileToSync.tdee,
      carbsGoal,
      fatsGoal,
      goal: profileToSync.goal,
      height: String(profileToSync.height),
      proteins: proteinGoal,
      weight: String(profileToSync.weight),
    });
  };

  const finishLogin = async (email: string, password: string) => {
    setAuthError('');
    setIsAuthSubmitting(true);

    try {
      await api.login(email, password);
      await refreshProfileFromBackend();
      setCurrentFlow('MainApp');
    } catch (error) {
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError('Could not connect to the server. Please check that the backend is running.');
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const finishRegistration = async (email: string, password: string) => {
    setAuthError('');
    setIsAuthSubmitting(true);

    try {
      await api.register(email, password);
      await syncProfileToBackend();
      setCurrentFlow('MainApp');
    } catch (error) {
      if (error instanceof ApiError) {
        setAuthError(error.message);
      } else {
        setAuthError('Could not connect to the server. Please check that the backend is running.');
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Local logout should still complete if the server is unavailable.
    }

    accessTokenRef.current = null;
    api.setRefreshToken(null);
    await Promise.all([
      tokenStorage.deleteItem(ACCESS_TOKEN_KEY),
      tokenStorage.deleteItem(REFRESH_TOKEN_KEY),
    ]);
    setTodayLog(null);
    setWeeklyLogs([]);
    setMealPlans([]);
    setWeeklyMealPlans([]);
    setRecipes([]);
    setActiveTab('Home');
    setCurrentFlow('Auth');
  };

  const selectedDailyLog = weeklyLogs.find((log) => log.logDate === selectedLogDate) ?? null;
  const homeMetrics = buildHomeMetrics(profile, todayLog, weeklyLogs);
  const refreshProfileFromBackend = async () => {
    const user = await api.me();
    let nextProfile = profile;

    setProfile((prev) => {
      nextProfile = mapUserToProfile(user, prev);
      return nextProfile;
    });

    return nextProfile;
  };
  const openBodyProfileSettings = async () => {
    if (accessTokenRef.current) {
      try {
        await refreshProfileFromBackend();
      } catch {
        // Keep the in-memory profile if a refresh fails; the editor still opens.
      }
    }

    setCurrentFlow('OnboardingProfile');
  };
  const selectLogDate = async (date: string) => {
    setSelectedLogDate(date);
    setMealPlans(await api.getMealPlans(date));
  };
  const addWater = async () => {
    const logDate = formatDate(new Date());
    const nextWaterMl = Math.min((todayLog?.waterMl ?? 0) + 500, Math.round(waterTargetLiters * 1000));
    const updatedLog = await api.upsertDailyLog({
      logDate,
      calories: todayLog?.calories ?? 0,
      proteins: todayLog?.proteins ?? 0,
      carbs: todayLog?.carbs ?? 0,
      fats: todayLog?.fats ?? 0,
      waterMl: nextWaterMl,
      currentWeight: todayLog?.currentWeight ?? undefined,
      notes: todayLog?.notes ?? undefined,
    });
    const latestWeeklyLogs = await api.getDailyLogs(formatDate(startOfWeek(new Date())), formatDate(endOfWeek(new Date())));

    setTodayLog(updatedLog);
    setWeeklyLogs(latestWeeklyLogs);
    showSuccessToast('Water logged successfully');
  };
  const addRecipeToLog = async (
    recipe: Recipe,
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack',
  ) => {
    const logDate = formatDate(new Date());
    const normalizedMealType = mealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack';
    const calories = recipe.jsonData.calories ?? 0;
    const proteins = recipe.jsonData.proteins ?? 0;
    const carbs = recipe.jsonData.carbs ?? 0;
    const fats = recipe.jsonData.fats ?? 0;

    await api.createMealPlan({
      date: logDate,
      mealType: normalizedMealType,
      recipeId: recipe.id,
      servings: 1,
    });

    const updatedLog = await api.upsertDailyLog({
      logDate,
      calories: (todayLog?.calories ?? 0) + calories,
      proteins: (todayLog?.proteins ?? 0) + proteins,
      carbs: (todayLog?.carbs ?? 0) + carbs,
      fats: (todayLog?.fats ?? 0) + fats,
      waterMl: todayLog?.waterMl ?? 0,
      currentWeight: todayLog?.currentWeight ?? undefined,
      notes: todayLog?.notes ?? undefined,
    });
    const [latestMealPlans, latestWeeklyLogs] = await Promise.all([
      api.getMealPlans(logDate),
      api.getDailyLogs(formatDate(startOfWeek(new Date())), formatDate(endOfWeek(new Date()))),
    ]);
    const latestWeeklyMealPlans = await api.getMealPlans({
      startDate: formatDate(startOfWeek(new Date())),
      endDate: formatDate(endOfWeek(new Date())),
    });

    setSelectedLogDate(logDate);
    setTodayLog(updatedLog);
    setWeeklyLogs(latestWeeklyLogs);
    setMealPlans(latestMealPlans);
    setWeeklyMealPlans(latestWeeklyMealPlans);
    showSuccessToast('Meal added to log');
  };
  const updateUserRecipe = async (recipe: Recipe) => {
    const input = {
      imageUrl: recipe.imageUrl,
      jsonData: recipe.jsonData,
      recipeName: recipe.recipeName,
    };
    const updatedRecipe = recipe.isDefault
      ? await api.createRecipe(input)
      : await api.updateRecipe(recipe.id, input);
    const recipeRows = await api.getRecipes();

    setRecipes(recipeRows);
    showSuccessToast(recipe.isDefault ? 'Private recipe copy created' : 'Recipe updated');
    return updatedRecipe;
  };
  const deleteUserRecipe = async (recipe: Recipe) => {
    if (recipe.isDefault) {
      showSuccessToast('Default recipes cannot be deleted');
      return;
    }

    await api.deleteRecipe(recipe.id);
    setRecipes(await api.getRecipes());
    showSuccessToast('Recipe deleted');
  };

  // 1. Luồng chọn Goal Onboarding
  if (currentFlow === 'OnboardingGoal') {
    return (
      <ChooseGoalScreen
        onSelectGoal={(selectedGoal) => {
          setProfile((prev) => ({ ...prev, goal: selectedGoal }));
          setCurrentFlow('OnboardingProfile');
        }}
      />
    );
  }

  // 2. Luồng Body Profile Onboarding
  if (currentFlow === 'OnboardingProfile') {
    const todayDate = formatDate(new Date());
    const isLoggedIn = Boolean(accessTokenRef.current);
    const hasLoggedRecipeToday = weeklyMealPlans.some((mealPlan) => mealPlan.date === todayDate);

    return (
      <BodyProfileScreen
        canEditBodyMetrics={!(isLoggedIn && hasLoggedRecipeToday)}
        key={`${profile.height}-${profile.weight}-${profile.age}-${profile.activityLevel}`}
        initialProfile={profile}
        onBack={() => setCurrentFlow(isLoggedIn ? 'MainApp' : 'OnboardingGoal')}
        onLogout={accessTokenRef.current ? handleLogout : undefined}
        onUpdateProfile={async (updatedProfile) => {
          const initialHistory = buildInitialWeightHistory(updatedProfile.weight);
          const nextProfile = {
            ...updatedProfile,
            weightHistory: initialHistory
          };

          setProfile(nextProfile);

          if (accessTokenRef.current) {
            setAuthError('');
            setIsAuthSubmitting(true);
            try {
              await syncProfileToBackend(nextProfile);
              setCurrentFlow('MainApp');
            } catch (error) {
              setAuthError(error instanceof ApiError ? error.message : 'Could not update your profile.');
              setCurrentFlow('Auth');
            } finally {
              setIsAuthSubmitting(false);
            }
            return;
          }

          setCurrentFlow('Auth');
        }}
      />
    );
  }

  if (currentFlow === 'Auth') {
    return (
      <AuthScreen
        error={authError}
        isSubmitting={isAuthSubmitting}
        onBack={() => setCurrentFlow('OnboardingProfile')}
        onLogin={finishLogin}
        onRegister={finishRegistration}
      />
    );
  }

  // 3. Luồng xem trang cá nhân / cài đặt (Alex Sterling)
  if (currentFlow === 'SettingsProfile') {
    const calculateTdee = (w: number, h: number, a: number, act: string) => {
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;
      let multiplier = 1.2;
      if (act === 'light') multiplier = 1.375;
      else if (act === 'active') multiplier = 1.55;
      else if (act === 'elite') multiplier = 1.725;
      return Math.round(bmr * multiplier);
    };

    return (
      <SettingsProfileScreen
        profile={profile}
        onBack={() => setCurrentFlow('MainApp')}
        onUpdateGoal={(newGoal) => {
          setProfile((prev) => ({ ...prev, goal: newGoal }));
        }}
        onUpdateStats={(newWeight, newHeight, newHistory) => {
          setProfile((prev) => {
            const calculatedTdee = calculateTdee(newWeight, newHeight, prev.age, prev.activityLevel);
            return {
              ...prev,
              weight: newWeight,
              height: newHeight,
              weightHistory: newHistory,
              tdee: calculatedTdee
            };
          });
        }}
      />
    );
  }

  // 4. Luồng ứng dụng chính (HomeScreen)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.header} hidden={false} translucent={false} />
      <HomeScreen
        activeTab={activeTab}
        dailyLog={selectedDailyLog}
        goal={profile.goal}
        mealPlans={mealPlans}
        metrics={homeMetrics}
        onAddRecipeToLog={addRecipeToLog}
        onAddWater={addWater}
        onUpdateWaterTarget={setWaterTargetLiters}
        onDeleteRecipe={deleteUserRecipe}
        onUpdateRecipe={updateUserRecipe}
        profileWeight={profile.weight}
        recipes={recipes}
        weeklyMealPlans={weeklyMealPlans}
        weeklyLogs={weeklyLogs}
        waterTargetLiters={waterTargetLiters}
        selectedLogDate={selectedLogDate}
        onSelectLogDate={selectLogDate}
        onTabChange={setActiveTab}
        onOpenSettings={openBodyProfileSettings}
      />
      {toastMessage ? <SuccessToast message={toastMessage} /> : null}
    </SafeAreaView>
  );
}

function SuccessToast({ message }: { message: string }) {
  return (
    <View pointerEvents="none" style={styles.toast}>
      <View style={styles.toastIcon}>
        <Text style={styles.toastIconText}>✓</Text>
      </View>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.header,
    flex: 1,
  },
  toast: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 18,
    bottom: 112,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    zIndex: 20,
  },
  toastIcon: {
    alignItems: 'center',
    backgroundColor: '#A7EBCF',
    borderRadius: 999,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  toastIconText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  toastText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
});

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  return addDays(date, -((date.getDay() + 6) % 7));
}

function endOfWeek(date: Date) {
  return addDays(startOfWeek(date), 6);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildHomeMetrics(profile: UserProfile, todayLog: DailyLog | null, weeklyLogs: DailyLog[]): HomeMetrics {
  const proteinGoal = Math.round((profile.weight * 1.8) / 5) * 5;
  const fatsGoal = Math.round((profile.tdee * 0.25) / 9);
  const today = new Date();
  const logsByDate = new Map(weeklyLogs.map((log) => [log.logDate, log]));
  const weekStart = startOfWeek(today);

  return {
    carbs: todayLog?.carbs ?? 0,
    carbsGoal: Math.max(0, Math.round((profile.tdee - proteinGoal * 4 - fatsGoal * 9) / 4)),
    calories: todayLog?.calories ?? 0,
    calorieGoal: profile.tdee,
    fats: todayLog?.fats ?? 0,
    fatsGoal,
    proteins: todayLog?.proteins ?? 0,
    proteinGoal,
    waterMl: todayLog?.waterMl ?? 0,
    weeklyCalories: Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const dateKey = formatDate(date);
      const log = logsByDate.get(formatDate(date));

      return {
        calories: log?.calories ?? 0,
        day: DAY_LABELS[date.getDay()],
        isToday: dateKey === formatDate(today),
      };
    }),
  };
}
