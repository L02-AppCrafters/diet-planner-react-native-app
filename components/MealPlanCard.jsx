import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../shared/Colors';

export default function MealPlanCard({ mealPlanInfo }) {
  // Parse nutritional info if available, otherwise use defaults
  const calories = mealPlanInfo?.recipe?.jsonData?.calories || '0';
  const protein = mealPlanInfo?.recipe?.jsonData?.protein || '0g';
  const carbs = mealPlanInfo?.recipe?.jsonData?.carbs || '0g';
  const fats = mealPlanInfo?.recipe?.jsonData?.fats || '0g';

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: mealPlanInfo?.recipe?.imageUrl || 'https://via.placeholder.com/400x200' }} 
          style={styles.image} 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        />
        <Text style={styles.mealTypeBadge}>{mealPlanInfo?.mealPlan?.mealType || 'Meal'}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.recipeName} numberOfLines={1}>
            {mealPlanInfo?.recipe?.recipeName || 'Delicious Recipe'}
          </Text>
          <Text style={styles.caloriesText}>{calories} kCal</Text>
        </View>
        
        <View style={styles.macrosRow}>
          <View style={styles.macroPillPrimary}>
            <Text style={styles.macroTextPrimary}>P: {protein}</Text>
          </View>
          <View style={styles.macroPillSecondary}>
            <Text style={styles.macroTextSecondary}>C: {carbs}</Text>
          </View>
          <View style={styles.macroPillSecondary}>
            <Text style={styles.macroTextSecondary}>F: {fats}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e8fd',
    marginBottom: 16,
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  mealTypeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    color: Colors.WHITE,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
    marginRight: 10,
  },
  caloriesText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroPillPrimary: {
    backgroundColor: '#adedd3', // secondary-container
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  macroTextPrimary: {
    fontSize: 10,
    fontWeight: '800',
    color: '#306d58', // on-secondary-container
    textTransform: 'uppercase',
  },
  macroPillSecondary: {
    backgroundColor: '#f1f3ff', // surface-container-low
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  macroTextSecondary: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.ON_SURFACE_VARIANT,
    textTransform: 'uppercase',
  }
});