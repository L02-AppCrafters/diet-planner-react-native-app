import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SparklesIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { useRouter } from 'expo-router';

import Colors from '../shared/Colors';

export default function GenerateRecipeCard() {
  const router = useRouter();

  return (
    <View style={styles.cardContainer}>
      <View>
        <View style={styles.header}>
          <HugeiconsIcon icon={SparklesIcon} color={Colors.PRIMARY} size={20} />
          <Text style={styles.headerText}>AI RECIPE GENERATOR</Text>
        </View>
        <Text style={styles.descriptionText}>
          "Need meal ideas? Let our AI generate personalized, delicious recipes tailored just for your goals."
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push('/generate-ai-recipe')}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Generate Recommendations</Text>
          <HugeiconsIcon icon={ArrowRight02Icon} size={18} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.PRIMARY,
    letterSpacing: 1.5,
  },
  descriptionText: {
    color: Colors.ON_SURFACE,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e8fd', // outline variant light
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  }
});