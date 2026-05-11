import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Settings01Icon, AnalyticsUpIcon, Sun03Icon, Restaurant01Icon, Moon02Icon, PlusSignIcon, DroppingIcon } from '@hugeicons/core-free-icons';

import Colors from '../../shared/Colors';

export default function Log() {
  const days = [
    { day: 'Mon', date: '12', active: false },
    { day: 'Tue', date: '13', active: false },
    { day: 'Wed', date: '14', active: true },
    { day: 'Thu', date: '15', active: false },
    { day: 'Fri', date: '16', active: false },
    { day: 'Sat', date: '17', active: false },
    { day: 'Sun', date: '18', active: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.userInfo}>
          <Image source={require('../../assets/images/user.png')} style={styles.avatar} />
          <Text style={styles.appName}>Weekly Plan</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <HugeiconsIcon icon={Settings01Icon} size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Summary Stats */}
        <View style={styles.statsSection}>
          <View style={styles.energyBudgetCard}>
            <View style={styles.energyHeader}>
              <View>
                <Text style={styles.energyLabel}>Energy Budget</Text>
                <Text style={styles.energyValue}>
                  1,420 <Text style={styles.energyTotal}>/ 2,100 kcal</Text>
                </Text>
              </View>
              <View style={styles.plannedBadge}>
                <Text style={styles.plannedBadgeText}>67% Planned</Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '67.6%' }]} />
            </View>
          </View>

          <View style={styles.aiOptimizationCard}>
            <Text style={styles.aiOptTitle}>AI Optimization</Text>
            <Text style={styles.aiOptDesc}>
              Your plan is low in Fiber today. We suggest adding Chia Seeds to your afternoon snack.
            </Text>
            <HugeiconsIcon icon={AnalyticsUpIcon} size={80} color="rgba(255,255,255,0.1)" style={styles.aiIconBg} />
          </View>
        </View>

        {/* Horizontal Calendar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
          {days.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              activeOpacity={0.8}
              style={[styles.dayCard, item.active && styles.dayCardActive]}
            >
              <Text style={[styles.dayName, item.active && styles.dayNameActive]}>{item.day}</Text>
              <Text style={[styles.dayDate, item.active && styles.dayDateActive]}>{item.date}</Text>
              {item.active && <View style={styles.activeDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meal Slots */}
        <View style={styles.mealGrid}>
          {/* Breakfast */}
          <View style={styles.mealSlotCard}>
            <View style={styles.slotHeader}>
              <View style={styles.slotTitleRow}>
                <View style={[styles.slotIconBox, { backgroundColor: '#ffedd5' }]}>
                  <HugeiconsIcon icon={Sun03Icon} size={20} color="#ea580c" />
                </View>
                <Text style={styles.slotTitle}>Breakfast</Text>
              </View>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>08:30 AM</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.mealImageContainer}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0fqbF6z2dwKK3MoPh81BX_xFRt7GQQnbffiuOQqREMcZUWppJt1A-M38JIGVs1C7HsRhyM89LE0zS0996sBxGTr1pRvhL9UVISjH6MrioBJv2toKmGZwKBhrvGs7ILUlFR-yDaSAXQJnfAIvVEnijEVl_-dsSQS_PitEGVsn8BhnJ0uGvfMX-lI1_OEO2yuQfJaeawuZTd2_5mdWuNfNVoCmYhqwhbh7Ns1-CNkeGF0uYSMw1NEKyLoOHPO_5LLV2PFVXPcpC9-M' }} 
                style={styles.mealImage} 
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.mealTitle}>Avocado & Poached Egg</Text>
                <Text style={styles.mealMeta}>420 kcal • 18g Protein</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Lunch */}
          <View style={styles.mealSlotCard}>
            <View style={styles.slotHeader}>
              <View style={styles.slotTitleRow}>
                <View style={[styles.slotIconBox, { backgroundColor: '#d1fae5' }]}>
                  <HugeiconsIcon icon={Restaurant01Icon} size={20} color="#059669" />
                </View>
                <Text style={styles.slotTitle}>Lunch</Text>
              </View>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>12:45 PM</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.mealImageContainer}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiNXtbQHjXvl21BA89ly626E-DpfGBfMQQo1U9Lm5gyte7nI43m3PsL4WtaE_mC6aGxQj0kHj6VW2-_GsYJekvca1kQbErRGBOj1DSahkKj6lCsgVKRxs9R0e8WhXlCZQjy25O-1cOJnVx7AayBWDNQnIYQ2uOsAGqXnSIpk2QvhTCha2VUky0OCnWxUXalWwNiqQ0DJEh1i2SdM2tPZdL69oHLEqfc81JUfJCk8U4TmXiI_3ubQWEj0dkWJpb_2nwD3pdGcK85t4' }} 
                style={styles.mealImage} 
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.mealTitle}>Mediterranean Power Bowl</Text>
                <Text style={styles.mealMeta}>650 kcal • 32g Protein</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Add Snack Slot */}
          <TouchableOpacity activeOpacity={0.7} style={styles.addSnackSlot}>
            <View style={styles.addIconBg}>
              <HugeiconsIcon icon={PlusSignIcon} size={28} color={Colors.PRIMARY} />
            </View>
            <Text style={styles.addSnackTitle}>Add Snack</Text>
            <Text style={styles.addSnackDesc}>Keep your metabolism active</Text>
          </TouchableOpacity>

          {/* Dinner */}
          <View style={styles.dinnerSlot}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-ll_07iMlDytCufwcpSdM-mYke4nkD9a5rsq4GMLh749fCJbWiBQsl_wMotRMJD109XWFLxIT4FVyA2eG7bYOO3u_UkhtX0ZhfzgoTUoWXj6ajTlfJ5O48vN17PjVaCQCsFEZUegsm-CkzG-F8ozYcDwxk_w-coJRuCe01FRmoJJIZfl3m80BlDmHW78iCm8pHWUnneuFSnMqS5MsG1tl-zHEhwDagOKdNaOJ8eO_xkwK4QXjA7eNraIQ_3-iAKakJX_OiVGkjrk' }} 
              style={styles.dinnerImage} 
            />
            <View style={styles.dinnerContent}>
              <View style={styles.slotHeader}>
                <View style={styles.slotTitleRow}>
                  <View style={[styles.slotIconBox, { backgroundColor: '#e0e7ff' }]}>
                    <HugeiconsIcon icon={Moon02Icon} size={20} color="#4f46e5" />
                  </View>
                  <Text style={styles.slotTitle}>Dinner</Text>
                </View>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>07:15 PM</Text>
                </View>
              </View>
              <Text style={styles.dinnerTitle}>Atlantic Salmon & Asparagus</Text>
              <Text style={styles.dinnerDesc}>High in Omega-3 fatty acids. Served with a side of zesty quinoa and roasted almonds.</Text>
              
              <View style={styles.dinnerStats}>
                <View style={styles.dinnerStatBox}>
                  <Text style={styles.dinnerStatLabel}>CALS</Text>
                  <Text style={styles.dinnerStatValue}>520</Text>
                </View>
                <View style={styles.dinnerStatBox}>
                  <Text style={styles.dinnerStatLabel}>PROTEIN</Text>
                  <Text style={styles.dinnerStatValue}>38g</Text>
                </View>
                <View style={styles.dinnerStatBox}>
                  <Text style={styles.dinnerStatLabel}>FAT</Text>
                  <Text style={styles.dinnerStatValue}>24g</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Hydration */}
          <View style={styles.hydrationCard}>
            <View style={styles.hydrationHeaderRow}>
              <View style={[styles.slotIconBox, { backgroundColor: 'rgba(0, 90, 194, 0.2)' }]}>
                <HugeiconsIcon icon={DroppingIcon} size={20} color="#005ac2" />
              </View>
              <Text style={styles.slotTitle}>Hydration</Text>
            </View>
            <View style={styles.hydrationBody}>
              <Text style={styles.hydrationText}>1.8 <Text style={styles.hydrationTotal}>/ 3.0L</Text></Text>
              <View style={styles.hydrationBars}>
                <View style={[styles.hydroBar, styles.hydroBarActive]} />
                <View style={[styles.hydroBar, styles.hydroBarActive]} />
                <View style={[styles.hydroBar, styles.hydroBarActive]} />
                <View style={styles.hydroBar} />
                <View style={styles.hydroBar} />
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 108, 73, 0.2)',
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 108, 73, 0.1)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
    gap: 15,
  },
  energyBudgetCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e8fd',
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  energyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
    marginBottom: 4,
  },
  energyValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  energyTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.GRAY,
  },
  plannedBadge: {
    backgroundColor: 'rgba(42, 196, 139, 0.2)', // primary-container/20
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  plannedBadgeText: {
    color: Colors.PRIMARY,
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#f1f3ff',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 6,
  },
  aiOptimizationCard: {
    backgroundColor: Colors.PRIMARY,
    padding: 24,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  aiOptTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.WHITE,
    marginBottom: 8,
  },
  aiOptDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    position: 'relative',
    zIndex: 2,
  },
  aiIconBg: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    zIndex: 1,
  },
  calendarScroll: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  dayCard: {
    width: 70,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
  },
  dayCardActive: {
    backgroundColor: Colors.PRIMARY,
    width: 80,
    height: 110,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dayNameActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  dayDate: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
  },
  dayDateActive: {
    color: Colors.WHITE,
    fontSize: 24,
  },
  activeDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.WHITE,
    borderRadius: 3,
    marginTop: 8,
  },
  mealGrid: {
    paddingHorizontal: 20,
    gap: 20,
  },
  mealSlotCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e8fd',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  slotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slotIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
  },
  timeBadge: {
    backgroundColor: '#f1f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.ON_SURFACE_VARIANT,
  },
  mealImageContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)', // Simplified gradient effect
  },
  mealTitle: {
    color: Colors.WHITE,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 4,
  },
  mealMeta: {
    color: '#d1fae5',
    fontSize: 12,
    fontWeight: '600',
  },
  addSnackSlot: {
    backgroundColor: '#f1f3ff',
    borderWidth: 2,
    borderColor: 'rgba(187, 203, 184, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addSnackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 4,
  },
  addSnackDesc: {
    fontSize: 12,
    color: '#94a3b8',
  },
  dinnerSlot: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e8fd',
    overflow: 'hidden',
  },
  dinnerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  dinnerContent: {
    padding: 20,
  },
  dinnerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 8,
  },
  dinnerDesc: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
    lineHeight: 22,
    marginBottom: 20,
  },
  dinnerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  dinnerStatBox: {
    backgroundColor: '#f1f3ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  dinnerStatLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dinnerStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  hydrationCard: {
    backgroundColor: 'rgba(133, 173, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 90, 194, 0.1)',
  },
  hydrationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  hydrationBody: {
    alignItems: 'center',
  },
  hydrationText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#005ac2',
    marginBottom: 16,
  },
  hydrationTotal: {
    fontSize: 18,
    fontWeight: '500',
    color: '#64748b',
  },
  hydrationBars: {
    flexDirection: 'row',
    gap: 8,
  },
  hydroBar: {
    width: 16,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 90, 194, 0.2)',
  },
  hydroBarActive: {
    backgroundColor: '#005ac2',
  }
});
