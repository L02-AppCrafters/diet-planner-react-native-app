import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FireIcon, Time02Icon, Restaurant01Icon } from '@hugeicons/core-free-icons';

import Colors from '../shared/Colors';

export default function RecipeIntro({ recipeDetail }) {
  const recipeJson = recipeDetail?.jsonData;

  return (
    <View style={styles.heroContainer}>
      <Image source={{ uri: recipeDetail?.imageUrl || 'https://via.placeholder.com/600x400' }} style={styles.heroImage} />
      
      <LinearGradient
        colors={['transparent', 'rgba(20, 27, 43, 0.9)']}
        style={styles.gradientOverlay}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>HIGH PROTEIN</Text>
        </View>
        
        <Text style={styles.recipeTitle}>{recipeDetail?.recipeName || 'Recipe Name'}</Text>
        <Text style={styles.recipeDesc} numberOfLines={2}>
          {recipeJson?.description || 'Delicious and healthy recipe for your daily diet.'}
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <HugeiconsIcon icon={FireIcon} color={Colors.PRIMARY} size={24} />
            <Text style={styles.statValue}>{recipeJson?.calories || 0}</Text>
            <Text style={styles.statLabel}>KCAL</Text>
          </View>
          
          <View style={styles.statBox}>
            <HugeiconsIcon icon={Time02Icon} color={Colors.PRIMARY} size={24} />
            <Text style={styles.statValue}>{recipeJson?.cookTime || 0}</Text>
            <Text style={styles.statLabel}>MINS</Text>
          </View>
          
          <View style={styles.statBox}>
            <HugeiconsIcon icon={Restaurant01Icon} color={Colors.PRIMARY} size={24} />
            <Text style={styles.statValue}>{recipeJson?.serverTo || 1}</Text>
            <Text style={styles.statLabel}>SERVINGS</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 450,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.PRIMARY_CONTAINER,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: Colors.ON_PRIMARY_CONTAINER,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  recipeTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.WHITE,
    marginBottom: 8,
  },
  recipeDesc: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderLeftWidth: 2,
    borderLeftColor: Colors.PRIMARY,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.ON_SURFACE_VARIANT,
    textTransform: 'uppercase',
  }
});