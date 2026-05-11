import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons';

import Colors from '../shared/Colors';

export default function RecipeIngredents({ recipeDetail }) {
  const recipeJson = recipeDetail?.jsonData;
  const ingredients = recipeJson?.ingredients || [];
  
  // State to track checked ingredients
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getPercent = (value, total) => {
    if (!total || total === 0) return '0%';
    return `${Math.min(100, Math.round((parseFloat(value) / parseFloat(total)) * 100))}%`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <TouchableOpacity>
          <Text style={styles.actionText}>Add all to list</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ingredientsList}>
        {ingredients.map((item, index) => {
          const isChecked = !!checkedItems[index];
          return (
            <TouchableOpacity 
              key={index} 
              activeOpacity={0.7}
              onPress={() => toggleCheck(index)}
              style={[
                styles.ingredientItem,
                isChecked && styles.ingredientItemChecked
              ]}
            >
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} color={Colors.WHITE} />}
              </View>
              <View style={styles.ingredientTextContainer}>
                <Text style={[styles.ingredientName, isChecked && styles.textChecked]}>
                  {item?.ingredient} {item?.icon}
                </Text>
                <Text style={[styles.ingredientQuantity, isChecked && styles.textChecked]}>
                  {item?.quantity}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionTitle}>NUTRITIONAL INFO</Text>
        
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionHeader}>
            <Text style={styles.nutritionLabel}>Protein</Text>
            <Text style={[styles.nutritionValue, { color: Colors.PRIMARY }]}>{recipeJson?.protein || '0g'}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { backgroundColor: Colors.PRIMARY, width: '70%' }]} />
          </View>
        </View>

        <View style={styles.nutritionRow}>
          <View style={styles.nutritionHeader}>
            <Text style={styles.nutritionLabel}>Carbs</Text>
            <Text style={[styles.nutritionValue, { color: '#005ac2' }]}>{recipeJson?.carbs || '0g'}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { backgroundColor: '#005ac2', width: '50%' }]} />
          </View>
        </View>

        <View style={styles.nutritionRow}>
          <View style={styles.nutritionHeader}>
            <Text style={styles.nutritionLabel}>Fats</Text>
            <Text style={[styles.nutritionValue, { color: '#2b6954' }]}>{recipeJson?.fats || '0g'}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { backgroundColor: '#2b6954', width: '30%' }]} />
          </View>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  ingredientsList: {
    gap: 12,
    marginBottom: 30,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e1e8fd',
  },
  ingredientItemChecked: {
    borderLeftColor: Colors.PRIMARY,
    backgroundColor: '#f1f3ff',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#bbcbb8',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  ingredientTextContainer: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
    marginBottom: 4,
  },
  ingredientQuantity: {
    fontSize: 13,
    color: Colors.ON_SURFACE_VARIANT,
  },
  textChecked: {
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  nutritionCard: {
    backgroundColor: '#f1f3ff', // surface-container-low
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    letterSpacing: 1,
    marginBottom: 20,
  },
  nutritionRow: {
    marginBottom: 15,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  }
});