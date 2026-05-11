import { ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { UserContext } from './../../context/UserContext';
import Colors from '../../shared/Colors';

import HomeHeader from '../../components/HomeHeader';
import TodayProgress from '../../components/TodayProgress';
import GenerateRecipeCard from '../../components/GenerateRecipeCard';
import TodaysMealPlan from '../../components/TodaysMealPlan';

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user?.weight) {
      router.replace('/preferences');
    }
  }, [user]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <HomeHeader />
      <TodayProgress />
      <GenerateRecipeCard />
      <TodaysMealPlan />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.BACKGROUND,
  }
});