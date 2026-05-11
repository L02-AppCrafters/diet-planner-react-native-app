import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../shared/Colors';

export default function RecipeSteps({ recipeDetail }) {
  const steps = recipeDetail?.jsonData?.steps || [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>

      <View style={styles.stepsList}>
        {steps.map((item, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              {/* Assuming item is just a string, we use it as description. If it were an object with title and desc, we'd split it. */}
              <Text style={styles.stepTitle}>Step {index + 1}</Text>
              <Text style={styles.stepDesc}>{item}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 25,
  },
  stepsList: {
    gap: 30,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.ON_SURFACE_VARIANT,
  }
});