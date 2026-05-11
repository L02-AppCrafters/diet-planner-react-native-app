import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Settings01Icon, ArrowDown01Icon, FireIcon, TrendingDown01Icon, EggIcon, DropletIcon } from '@hugeicons/core-free-icons';

import Colors from '../../shared/Colors';

export default function Progress() {
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPqIhgUPR3jd0O66Y1lBWT-DHmKF0Zug9ymgNqJYX5Own32J-LNbZuXE4Zo0Bq8fQw92Fmix-zcsSPn_7rf-UatKwcF0lyL01Z0LFP8etEfTynLskQakMAU1gaDBPnfb6ONqLrEnF1ppllkNhdGx3dplOZrYzxA3wNQbRb104AE_6UZkPer4YaZnlMnskFxVV4VaI0kobRG1ygYZ7ZnzlBbGCdhX74vef8a6Inyxx_u8I3JBczp29gbVyUZQzzPIzeT7avUVcrqYQ' }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.appName}>Analytics</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <HugeiconsIcon icon={Settings01Icon} size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Your Performance</Text>
          <Text style={styles.pageSubTitle}>Consistency is the secret to lasting results.</Text>
        </View>

        {/* Weight Over Time (Mock Chart) */}
        <View style={styles.weightCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Weight Over Time</Text>
              <View style={styles.weightValueRow}>
                <Text style={styles.weightValue}>74.2 kg</Text>
                <View style={styles.weightChangeBadge}>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} color={Colors.ON_SECONDARY_CONTAINER} />
                  <Text style={styles.weightChangeText}>0.8kg</Text>
                </View>
              </View>
            </View>
            <View style={styles.tabSwitcher}>
              <View style={[styles.tabBtn, styles.tabBtnActive]}>
                <Text style={styles.tabBtnTextActive}>Week</Text>
              </View>
              <View style={styles.tabBtn}>
                <Text style={styles.tabBtnText}>Month</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            {/* Simple mock CSS-based line chart approximation for React Native */}
            <View style={styles.chartLines}>
              <View style={styles.chartHLine} />
              <View style={styles.chartHLine} />
              <View style={[styles.chartHLine, { borderStyle: 'dashed', borderColor: 'rgba(0, 108, 73, 0.2)' }]} />
              <View style={styles.chartHLine} />
            </View>
            
            {/* Dots */}
            <View style={[styles.chartDot, { left: '10%', bottom: '70%' }]} />
            <View style={[styles.chartDot, { left: '30%', bottom: '60%' }]} />
            <View style={[styles.chartDot, { left: '50%', bottom: '40%' }]} />
            <View style={[styles.chartDot, { left: '70%', bottom: '25%', width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.WHITE }]} />
            <View style={[styles.chartDot, { left: '90%', bottom: '30%' }]} />
            
            <View style={styles.chartXAxis}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <Text key={i} style={styles.chartXLabel}>{d}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakLabel}>ACTIVITY STREAK</Text>
          <View style={styles.streakValueRow}>
            <Text style={styles.streakValue}>5</Text>
            <Text style={styles.streakUnit}>Days</Text>
          </View>
          
          <View style={styles.streakBarsRow}>
            <View style={[styles.streakBar, styles.streakBarActive]} />
            <View style={[styles.streakBar, styles.streakBarActive]} />
            <View style={[styles.streakBar, styles.streakBarActive]} />
            <View style={[styles.streakBar, styles.streakBarActive]} />
            <View style={[styles.streakBar, styles.streakBarActive]} />
            <View style={styles.streakBar} />
            <View style={styles.streakBar} />
          </View>
          <Text style={styles.streakMsg}>2 days left to hit your weekly goal!</Text>
          
          <View style={styles.streakBgIcon}>
            <HugeiconsIcon icon={FireIcon} size={120} color="rgba(0, 108, 73, 0.05)" />
          </View>
        </View>

        {/* Weekly Calorie Average */}
        <View style={styles.calCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Weekly Calorie Average</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.calValue}>2,140</Text>
              <Text style={styles.calUnit}>AVG KCAL/DAY</Text>
            </View>
          </View>
          
          <View style={styles.barChartContainer}>
            {[{v: 80, d:'M', c: Colors.PRIMARY_CONTAINER}, {v: 95, d:'T', c: Colors.PRIMARY}, {v: 65, d:'W', c: Colors.PRIMARY_CONTAINER}, {v: 100, d:'T', c: Colors.ERROR}, {v: 75, d:'F', c: Colors.PRIMARY_CONTAINER}, {v: 0, d:'S', c: Colors.PRIMARY_CONTAINER}, {v: 0, d:'S', c: Colors.PRIMARY_CONTAINER}].map((b, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { height: `${b.v}%`, backgroundColor: b.c, opacity: b.c === Colors.ERROR ? 0.6 : 1 }]} />
                </View>
                <Text style={styles.barLabel}>{b.d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Body Fat Trend */}
        <View style={styles.fatCard}>
          <Text style={styles.cardTitle}>Body Fat %</Text>
          <View style={styles.fatContentRow}>
            <View>
              <Text style={styles.fatValue}>22.4%</Text>
              <View style={styles.fatChangeRow}>
                <HugeiconsIcon icon={TrendingDown01Icon} size={16} color={Colors.PRIMARY} />
                <Text style={styles.fatChangeText}>1.2% this month</Text>
              </View>
            </View>
            
            {/* Simple circular progress mock */}
            <View style={styles.circularProgressContainer}>
              <View style={styles.circularProgressInner}>
                <Text style={styles.circularProgressText}>HEALTHY</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.fatQuoteBox}>
            <Text style={styles.fatQuoteText}>"Your muscle mass is increasing alongside your fat loss. Keep up the high-protein intake."</Text>
          </View>
        </View>

        {/* Nutrient Adherence */}
        <View style={styles.nutrientSection}>
          <Text style={styles.cardTitle}>Nutrient Adherence</Text>
          
          <View style={styles.nutrientList}>
            {/* Protein */}
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIconBox, { backgroundColor: '#d1fae5' }]}>
                <HugeiconsIcon icon={EggIcon} size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.nutrientContent}>
                <View style={styles.nutrientHeader}>
                  <Text style={styles.nutrientName}>Protein</Text>
                  <Text style={styles.nutrientPct}>92%</Text>
                </View>
                <View style={styles.nutrientBarBg}>
                  <View style={[styles.nutrientBarFill, { width: '92%', backgroundColor: Colors.PRIMARY }]} />
                </View>
              </View>
            </View>

            {/* Carbs */}
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIconBox, { backgroundColor: '#fef3c7' }]}>
                <Text style={{ fontSize: 20 }}>🥖</Text>
              </View>
              <View style={styles.nutrientContent}>
                <View style={styles.nutrientHeader}>
                  <Text style={styles.nutrientName}>Carbs</Text>
                  <Text style={styles.nutrientPct}>78%</Text>
                </View>
                <View style={styles.nutrientBarBg}>
                  <View style={[styles.nutrientBarFill, { width: '78%', backgroundColor: '#f59e0b' }]} />
                </View>
              </View>
            </View>

            {/* Fats */}
            <View style={styles.nutrientItem}>
              <View style={[styles.nutrientIconBox, { backgroundColor: '#dbeafe' }]}>
                <HugeiconsIcon icon={DropletIcon} size={24} color="#1d4ed8" />
              </View>
              <View style={styles.nutrientContent}>
                <View style={styles.nutrientHeader}>
                  <Text style={styles.nutrientName}>Fats</Text>
                  <Text style={styles.nutrientPct}>105%</Text>
                </View>
                <View style={styles.nutrientBarBg}>
                  <View style={[styles.nutrientBarFill, { width: '100%', backgroundColor: '#3b82f6' }]} />
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dce2f7',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.ON_BACKGROUND,
    marginBottom: 4,
  },
  pageSubTitle: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
  },
  weightCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e8fd',
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 4,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weightValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  weightChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SECONDARY_CONTAINER,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  weightChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ON_SECONDARY_CONTAINER,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#f1f3ff',
    padding: 4,
    borderRadius: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
  },
  chartContainer: {
    height: 180,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  chartLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    justifyContent: 'space-between',
  },
  chartHLine: {
    borderTopWidth: 1,
    borderColor: 'rgba(187, 203, 184, 0.2)',
    width: '100%',
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  chartXLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
    textTransform: 'uppercase',
  },
  chartDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.PRIMARY,
  },
  streakCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
    letterSpacing: 1,
    marginBottom: 10,
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 15,
  },
  streakValue: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.PRIMARY,
  },
  streakUnit: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
  },
  streakBarsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  streakBar: {
    height: 6,
    flex: 1,
    backgroundColor: '#dce2f7',
    borderRadius: 3,
  },
  streakBarActive: {
    backgroundColor: Colors.PRIMARY,
  },
  streakMsg: {
    fontSize: 12,
    color: Colors.ON_SURFACE_VARIANT,
  },
  streakBgIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  calCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e8fd',
    marginBottom: 16,
  },
  calValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#005ac2',
  },
  calUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
    letterSpacing: 1,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    gap: 12,
  },
  barCol: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  barBg: {
    width: '100%',
    height: '80%',
    backgroundColor: '#f1f3ff',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
  },
  fatCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e8fd',
    marginBottom: 24,
  },
  fatContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  fatValue: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.ON_BACKGROUND,
  },
  fatChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  fatChangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  circularProgressContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#f1f3ff',
    borderTopColor: '#005ac2',
    borderRightColor: '#005ac2',
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressInner: {
    transform: [{ rotate: '45deg' }],
  },
  circularProgressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005ac2',
  },
  fatQuoteBox: {
    backgroundColor: '#f1f3ff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  fatQuoteText: {
    fontSize: 12,
    color: Colors.ON_SURFACE_VARIANT,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  nutrientSection: {
    marginBottom: 20,
  },
  nutrientList: {
    gap: 12,
    marginTop: 10,
  },
  nutrientItem: {
    flexDirection: 'row',
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  nutrientIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutrientContent: {
    flex: 1,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nutrientName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
  },
  nutrientPct: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
  },
  nutrientBarBg: {
    height: 6,
    backgroundColor: '#f1f3ff',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  nutrientBarFill: {
    height: '100%',
    borderRadius: 3,
  }
});