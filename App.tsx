import { useState } from 'react';
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
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { ChooseGoalScreen } from './src/screens/onboarding/ChooseGoalScreen';
import { BodyProfileScreen } from './src/screens/onboarding/BodyProfileScreen';
import { SettingsProfileScreen } from './src/screens/profile/SettingsProfileScreen';
import { colors } from './src/theme/colors';
import { AppTab } from './src/types/navigation';

export type AppFlow = 'OnboardingGoal' | 'OnboardingProfile' | 'MainApp' | 'SettingsProfile';

export default function App() {
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('OnboardingGoal');
  const [activeTab, setActiveTab] = useState<AppTab>('Home');
  const [profile, setProfile] = useState({
    goal: 'healthy_lifestyle',
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

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.safeArea} />;
  }

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
    return (
      <BodyProfileScreen
        initialProfile={profile}
        onUpdateProfile={(updatedProfile) => {
          // Khởi tạo lịch sử cân nặng ban đầu khi onboarding thành công
          const initialHistory = [
            { date: '2026-05-22', weight: Math.round((updatedProfile.weight + 0.2) * 10) / 10 },
            { date: '2026-05-23', weight: updatedProfile.weight }
          ];
          setProfile({
            ...updatedProfile,
            weightHistory: initialHistory
          });
          setCurrentFlow('MainApp');
        }}
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.header} />
      <HomeScreen
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setCurrentFlow('OnboardingProfile')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.header,
    flex: 1,
  },
});
