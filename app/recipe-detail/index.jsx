import React, { useRef } from 'react';
import { View, Text, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ActionSheet from 'react-native-actions-sheet';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft02Icon, Bookmark02Icon, Share01Icon, Calendar02Icon } from '@hugeicons/core-free-icons';

import Colors from './../../shared/Colors';
import RecipeIntro from '../../components/RecipeIntro';
import RecipeIngredents from '../../components/RecipeIngredents';
import RecipeSteps from '../../components/RecipeSteps';
import AddToMealActionSheet from '../../components/AddToMealActionSheet';

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams();
  const router = useRouter();
  const actionSheetRef = useRef(null);

  const recipeDetail = useQuery(api.Recipes.GetRecipeById, {
    id: recipeId == undefined && 'j97ec3m20j9szh91trjfcgvzvs84h6p5'
  });

  return (
    <View style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.topAppBar}>
        <View style={styles.leftNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.navTitle} numberOfLines={1}>
            {recipeDetail?.recipeName || 'Recipe Detail'}
          </Text>
        </View>
        <View style={styles.rightNav}>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={Bookmark02Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={Share01Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <RecipeIntro recipeDetail={recipeDetail} />
        <RecipeIngredents recipeDetail={recipeDetail} />
        <RecipeSteps recipeDetail={recipeDetail} />

        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            activeOpacity={0.8}
            onPress={() => actionSheetRef.current?.show()}
          >
            <HugeiconsIcon icon={Calendar02Icon} size={20} color={Colors.WHITE} />
            <Text style={styles.primaryBtnText}>Add to Meal Plan</Text>
          </TouchableOpacity>
        </View>

        <ActionSheet ref={actionSheetRef}>
          <AddToMealActionSheet recipeDetail={recipeDetail} hideActionSheet={() => actionSheetRef.current?.hide()} />
        </ActionSheet>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
    backgroundColor: 'rgba(233, 245, 239, 0.9)',
    zIndex: 10,
  },
  leftNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.PRIMARY,
    flex: 1,
  },
  rightNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 108, 73, 0.1)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  actionBar: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  primaryBtn: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  primaryBtnText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '800',
  }
});