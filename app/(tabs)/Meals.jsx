import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Search01Icon, Notification03Icon, Settings01Icon, Time02Icon, FireIcon, Dumbbell01Icon, SparklesIcon } from '@hugeicons/core-free-icons';

import Colors from '../../shared/Colors';

export default function Meals() {
  const [activeFilter, setActiveFilter] = useState('All Recipes');

  const filters = ['All Recipes', 'Keto', 'Vegan', 'High Protein', 'Gluten Free', 'Low Carb'];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.userInfo}>
          <Image source={require('../../assets/images/user.png')} style={styles.avatar} />
          <Text style={styles.appName}>Nutri Planner</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={Notification03Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={Settings01Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>
            Discover <Text style={styles.titleItalic}>Fuel</Text>
          </Text>
          
          <View style={styles.searchContainer}>
            <HugeiconsIcon icon={Search01Icon} size={20} color={Colors.GRAY} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search recipes, ingredients..."
              placeholderTextColor={Colors.GRAY}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
          {filters.map((filter, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.feedGrid}>
          {/* Featured Large Card */}
          <TouchableOpacity activeOpacity={0.9} style={styles.featuredCard}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6P4Rd_FH4AE5hgnFfvxuPIdbM0u2GCWFOuefR7laPj55dgMlSv7Ns2gAhP4kkNaGeS9Yz6UeYNR84GmK5Li_TR8KMCckkK5YVITzUCwhPSvQxupMD7r8HCVnMyAbtvUmpYGD5ZTq40pDs81NaEM0Q9X4PurFK6iCwNtEVJ-KjGcC7byiMoVEDcnPdN7bLqjCray2nXAKu2qI_rmNL6QMcRcKJIEC4tS_tX06ttJkc_-Y9EVklEJ_ZZh-2G4nrV0aQagtca-pbc-A' }} 
              style={styles.featuredImage} 
            />
            <View style={styles.gradientOverlay} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Editor's Choice</Text>
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Zesty Atlantic Salmon & Quinoa Power Bowl</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <HugeiconsIcon icon={Time02Icon} size={14} color={Colors.WHITE} />
                  <Text style={styles.metaText}>25 mins</Text>
                </View>
                <View style={styles.metaItem}>
                  <HugeiconsIcon icon={FireIcon} size={14} color={Colors.WHITE} />
                  <Text style={styles.metaText}>420 kcal</Text>
                </View>
                <View style={styles.metaItem}>
                  <HugeiconsIcon icon={Dumbbell01Icon} size={14} color={Colors.WHITE} />
                  <Text style={styles.metaText}>32g Protein</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Secondary Card */}
          <TouchableOpacity activeOpacity={0.9} style={styles.secondaryCard}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDlmpWHdpwPxc8VH4W-wVwYbKco0dPZu5BpDipwGn6m4j0oSLw0EgA-azuk8vivYMH813cyhY7ROrOg2FtdhCSZehFHR19x7_X5fY56HFKDBFByMHYsJ5tJ1iav7AF23HA2QpXBrSyXhM2Nx3UBzPxCheflSVmiyV5G-V6rA1aA3-VZ86lyC3sBhCA7zx0_x6-Uj35acnwPrkfWnjLkIaVDNybfG2a3owuXvRSZXPP9JqFJBuvY3IEakD3FNSb5DI_r-sTYMwqbnU' }} 
              style={styles.secondaryImage} 
            />
            <View style={styles.secondaryContent}>
              <Text style={styles.tagTextPrimary}>VEGAN</Text>
              <Text style={styles.secondaryTitle} numberOfLines={2}>Spiced Chickpea & Avocado Buddha Bowl</Text>
              <View style={styles.secondaryMetaRow}>
                <View>
                  <Text style={styles.metaLabel}>TIME</Text>
                  <Text style={styles.metaValue}>15m</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>PROTEIN</Text>
                  <Text style={styles.metaValue}>14g</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* AI Insight Card */}
          <View style={styles.aiInsightCard}>
            <View style={styles.aiHeader}>
              <HugeiconsIcon icon={SparklesIcon} size={20} color={Colors.PRIMARY} />
              <Text style={styles.aiTitle}>AI DISCOVERY</Text>
            </View>
            <Text style={styles.aiDesc}>
              Based on your workout intensity yesterday, we recommend increasing your <Text style={{fontWeight: 'bold'}}>Leucine</Text> intake. Try adding hemp seeds to these recipes.
            </Text>
            <View style={styles.aiProgressBox}>
              <View style={styles.aiProgressHeader}>
                <Text style={styles.aiProgressLabel}>Daily Goal Progress</Text>
                <Text style={styles.aiProgressPercent}>65%</Text>
              </View>
              <View style={styles.aiProgressBarBg}>
                <View style={[styles.aiProgressBarFill, { width: '65%' }]} />
              </View>
            </View>
          </View>

          {/* Small Feed Card */}
          <TouchableOpacity activeOpacity={0.9} style={styles.smallCard}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoYLmzDqpMR8qliMOvPw41NKWR8DTyCqJc2luxgpT4gZz317_mxHc_GMPeqGlfrI_cn5kBXAx8iS04OtltprMgBcVBHnYq-QjjFlaM4rPD4l14S0bvK_-Gl8GzRao9n4i3WTDLmlMo_pe1jpX5-7fFpcKKhdTX-24OrT4eg-k66Uy3OqcDj7L3a-B5Yk8H6s28EwWC0LPDt1O9edn6lUfcOFm_GFBdXNMWZhjdwXIyCasEoxF_As6m5MTHiXy4FSADzVEHImmi95w' }} 
              style={styles.smallImage} 
            />
            <View style={styles.smallContent}>
              <Text style={[styles.tagTextPrimary, { color: '#005ac2' }]}>KETO</Text>
              <Text style={styles.smallTitle} numberOfLines={2}>Grass-Fed Steak with Garlic Asparagus</Text>
              <Text style={styles.smallMetaText}>480 kcal • 42g Prot • 20m</Text>
            </View>
          </TouchableOpacity>

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
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 108, 73, 0.1)',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 20,
  },
  titleItalic: {
    color: Colors.PRIMARY,
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3ff',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 60,
    position: 'relative',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.ON_SURFACE,
    height: '100%',
  },
  searchBtn: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchBtnText: {
    color: Colors.WHITE,
    fontWeight: '700',
    fontSize: 14,
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderWidth: 1,
    borderColor: '#e1e8fd',
  },
  filterPillActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
  },
  filterTextActive: {
    color: Colors.WHITE,
  },
  feedGrid: {
    paddingHorizontal: 20,
    gap: 20,
  },
  featuredCard: {
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 108, 73, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.WHITE,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.WHITE,
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e8fd',
  },
  secondaryImage: {
    height: 180,
    width: '100%',
  },
  secondaryContent: {
    padding: 20,
  },
  tagTextPrimary: {
    color: Colors.PRIMARY,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  secondaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 15,
    lineHeight: 24,
  },
  secondaryMetaRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e1e8fd',
    paddingTop: 15,
    gap: 30,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
  },
  aiInsightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
    borderWidth: 1,
    borderColor: '#e1e8fd',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  aiTitle: {
    color: Colors.PRIMARY,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  aiDesc: {
    fontSize: 14,
    color: Colors.ON_SURFACE,
    lineHeight: 22,
    marginBottom: 20,
  },
  aiProgressBox: {
    backgroundColor: 'rgba(0, 108, 73, 0.1)',
    borderRadius: 10,
    padding: 12,
  },
  aiProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiProgressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  aiProgressPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  aiProgressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0, 108, 73, 0.2)',
    borderRadius: 3,
  },
  aiProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 3,
  },
  smallCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e8fd',
    flexDirection: 'column',
  },
  smallImage: {
    height: 150,
    width: '100%',
  },
  smallContent: {
    padding: 16,
  },
  smallTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 8,
  },
  smallMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
  }
});