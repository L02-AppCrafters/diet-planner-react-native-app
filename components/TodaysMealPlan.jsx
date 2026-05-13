import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../convex/_generated/api';
import moment from 'moment/moment';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CalendarAdd01Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';

import { UserContext } from '../context/UserContext';
import Colors from '../shared/Colors';
import Button from './../components/shared/Button'
import MealPlanCard from './MealPlanCard';

export default function TodaysMealPlan() {
  const [mealPlan, setMealPlan] = useState('');

  const { user } = useContext(UserContext);
  const convex = useConvex();

  useEffect(() => {
    if (user?._id) {
      getTodaysMealPlan();
    }
  }, [user])

  const getTodaysMealPlan = async () => {
    if (!user?._id) {
      return;
    }

    const result = await convex.query(api.MealPlan.GetTodaysMealPlan, {
      date: moment().format('DD/MM/YYYY'),
      uid: user._id
    });
    setMealPlan(result);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Today's Meal Plan</Text>
        <HugeiconsIcon icon={MoreHorizontalIcon} size={24} color={Colors.ON_SURFACE_VARIANT} />
      </View>

      {!mealPlan || mealPlan.length === 0 ?
        <View style={styles.emptyStateContainer}>
          <View style={styles.iconContainer}>
            <HugeiconsIcon icon={CalendarAdd01Icon} size={40} color={Colors.PRIMARY} />
          </View>
          <Text style={styles.emptyStateTitle}>No meals planned</Text>
          <Text style={styles.emptyStateText}>
            You don't have any meal plan for today. Let's create one to stay on track!
          </Text>
          <View style={styles.buttonWrapper}>
            <Button title={'Create New Plan'} />
          </View>
        </View>
        :
        <View style={styles.listContainer}>
          {mealPlan.map((item, index) => (
            <MealPlanCard key={index} mealPlanInfo={item} />
          ))}
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    marginTop: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e8fd',
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#ebf5f1',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
  },
  listContainer: {
    paddingBottom: 20,
  }
});
