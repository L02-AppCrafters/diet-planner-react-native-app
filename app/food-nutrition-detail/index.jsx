import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft02Icon, FavouriteIcon, Share01Icon, DiscoverCircleIcon, ScaleIcon, Clock01Icon, ArrowDown01Icon, PlusSignCircleIcon } from '@hugeicons/core-free-icons';

import Colors from '../../shared/Colors';

const { width } = Dimensions.get('window');

export default function FoodNutritionDetail() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Phở Bò</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={FavouriteIcon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={Share01Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqcWUzsSuHtvjeBkV3CQg1TjtHBByGKmZ24PHRJqvsZHFUCsAtDQYupNT-AFNPDdbmTj5R5jGiogjqDQ1OLHq4__eCZAR25HYBW8vTz7V6hElwWXdkYZM9s5iR4c-b0AtAAkM_6_2Qr67-eFAZDNu0NxWpMq_6dm6uP5payHlqi9F6845oAofP1naDH5p2BJClmtvj6S4d4_X_2HoL8Opu5-8YTXMezKU4A9Ug8cSeAYUMrmwYyU0WzECY2Diq1Kdiz0Ml0U0w2pU' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Vietnamese Cuisine</Text>
            </View>
            <Text style={styles.heroTitle}>Phở Bò</Text>
            <Text style={styles.heroSub}>Traditional Beef Noodle Soup • 1 standard bowl (500g)</Text>
          </View>
        </View>

        <View style={styles.contentWrap}>
          {/* Calorie Card */}
          <View style={styles.calorieCard}>
            <Text style={styles.calorieLabel}>TOTAL CALORIES</Text>
            <Text style={styles.calorieValue}>450</Text>
            <Text style={styles.calorieSub}>kcal per serving</Text>
          </View>

          {/* Macros Card */}
          <View style={styles.macrosCard}>
            <Text style={styles.macrosTitle}>Macronutrient Breakdown</Text>
            
            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Protein</Text>
                <Text style={[styles.macroVal, { color: Colors.PRIMARY }]}>28g <Text style={styles.macroPct}>(35%)</Text></Text>
              </View>
              <View style={styles.macroBarBg}>
                <View style={[styles.macroBarFill, { width: '35%', backgroundColor: Colors.PRIMARY }]} />
              </View>
            </View>

            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Carbohydrates</Text>
                <Text style={[styles.macroVal, { color: '#005ac2' }]}>52g <Text style={styles.macroPct}>(50%)</Text></Text>
              </View>
              <View style={styles.macroBarBg}>
                <View style={[styles.macroBarFill, { width: '50%', backgroundColor: '#005ac2' }]} />
              </View>
            </View>

            <View style={styles.macroRow}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Fats</Text>
                <Text style={[styles.macroVal, { color: '#2b6954' }]}>14g <Text style={styles.macroPct}>(15%)</Text></Text>
              </View>
              <View style={styles.macroBarBg}>
                <View style={[styles.macroBarFill, { width: '15%', backgroundColor: '#2b6954' }]} />
              </View>
            </View>
          </View>

          {/* AI Insight */}
          <View style={styles.aiInsightCard}>
            <HugeiconsIcon icon={DiscoverCircleIcon} size={28} color={Colors.PRIMARY} />
            <View style={styles.aiInsightTextContainer}>
              <Text style={styles.aiInsightTitle}>AI Nutritional Insight</Text>
              <Text style={styles.aiInsightDesc}>
                Phở Bò is an excellent source of lean protein and collagen from bone broth. To optimize your glycemic response, consider adding extra bean sprouts for fiber.
              </Text>
            </View>
          </View>

          {/* Micronutrients */}
          <View style={styles.microCard}>
            <Text style={styles.macrosTitle}>Micronutrients & Minerals</Text>
            
            <View style={styles.microList}>
              {[
                { name: 'Vitamin A', val: '12% DV' },
                { name: 'Vitamin C', val: '8% DV' },
                { name: 'Calcium', val: '4% DV' },
                { name: 'Iron', val: '18% DV' },
                { name: 'Sodium', val: '980mg', error: true },
                { name: 'Potassium', val: '420mg' },
              ].map((item, index) => (
                <View key={index} style={styles.microItem}>
                  <Text style={styles.microName}>{item.name}</Text>
                  <Text style={[styles.microVal, item.error && { color: Colors.ERROR }]}>{item.val}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Card */}
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>LOG THIS MEAL</Text>
            
            <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.actionBtnLeft}>
                <HugeiconsIcon icon={ScaleIcon} size={20} color={Colors.PRIMARY} />
                <Text style={styles.actionBtnText}>1 serving (500g)</Text>
              </View>
              <HugeiconsIcon icon={ArrowDown01Icon} size={20} color={Colors.ON_SURFACE_VARIANT} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <View style={styles.actionBtnLeft}>
                <HugeiconsIcon icon={Clock01Icon} size={20} color={Colors.PRIMARY} />
                <Text style={styles.actionBtnText}>Lunch (Now)</Text>
              </View>
              <HugeiconsIcon icon={ArrowDown01Icon} size={20} color={Colors.ON_SURFACE_VARIANT} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryActionBtn} activeOpacity={0.8}>
              <HugeiconsIcon icon={PlusSignCircleIcon} size={20} color={Colors.WHITE} />
              <Text style={styles.primaryActionText}>Add to Log</Text>
            </TouchableOpacity>

            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>QUICK ACTIONS</Text>
              <View style={styles.quickActionsRow}>
                <View style={styles.quickBadge}>
                  <Text style={styles.quickBadgeText}>Custom Portion</Text>
                </View>
                <View style={[styles.quickBadge, { backgroundColor: '#f1f3ff' }]}>
                  <Text style={[styles.quickBadgeText, { color: Colors.ON_SURFACE }]}>Save Recipe</Text>
                </View>
              </View>
            </View>
          </View>
          
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'rgba(233, 245, 239, 0.9)',
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.4)', // Simple gradient placeholder
  },
  heroBadge: {
    backgroundColor: Colors.PRIMARY_CONTAINER,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroBadgeText: {
    color: Colors.ON_PRIMARY_CONTAINER,
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.WHITE,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  contentWrap: {
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 20,
  },
  calorieCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  calorieLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
    letterSpacing: 1,
    marginBottom: 8,
  },
  calorieValue: {
    fontSize: 60,
    fontWeight: '800',
    color: Colors.PRIMARY,
    lineHeight: 70,
  },
  calorieSub: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
  },
  macrosCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 20,
  },
  macroRow: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ON_SURFACE,
  },
  macroVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  macroPct: {
    fontWeight: '400',
    color: Colors.ON_SURFACE_VARIANT,
  },
  macroBarBg: {
    height: 10,
    backgroundColor: '#f1f3ff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  aiInsightCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.PRIMARY,
    gap: 16,
  },
  aiInsightTextContainer: {
    flex: 1,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 4,
  },
  aiInsightDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.ON_SURFACE_VARIANT,
  },
  microCard: {
    backgroundColor: '#f1f3ff', // surface-container-low
    padding: 24,
    borderRadius: 24,
  },
  microList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  microItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(187, 203, 184, 0.2)',
  },
  microName: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
  },
  microVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
  },
  actionCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.ON_SURFACE_VARIANT,
    letterSpacing: 1,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f3ff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  actionBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.PRIMARY,
    padding: 18,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.WHITE,
  },
  quickActions: {
    marginTop: 24,
  },
  quickActionsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.ON_SURFACE_VARIANT,
    letterSpacing: 1,
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBadge: {
    backgroundColor: Colors.SECONDARY_CONTAINER,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ON_SECONDARY_CONTAINER,
  }
});
