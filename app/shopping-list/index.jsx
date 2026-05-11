import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft02Icon, Settings01Icon, Share01Icon, DiscoverCircleIcon, Tick01Icon, PlusSignCircleIcon } from '@hugeicons/core-free-icons';

import Colors from '../../shared/Colors';

export default function ShoppingList() {
  const router = useRouter();
  
  const [items, setItems] = useState({
    produce: [
      { id: 1, name: 'Rau thơm', qty: '2 bundles • Organic preferred', checked: false },
      { id: 2, name: 'Cà chua bi', qty: '250g • Red, ripe', checked: false },
      { id: 3, name: 'Hành tây', qty: '2 pieces • Medium size', checked: true },
    ],
    meat: [
      { id: 4, name: 'Gà (Ức gà)', qty: '500g • Boneless, skinless', checked: false, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9UTxoFgSAyl8orklcPnsoNYAogNaQIj5pGbN9FXALKCvfhV_uQ8SZn22nuXbtkx9IX5geYVYC6lbOGtt449gC2Z7K04_qvh-PPNSiyaO3Sa-qgFdsCWIsylfZfaoTvB6RozKXFbHf9-qu5Sg7EbEVOlez9kVwYAvbPupYdu9054GwrzndxLF_1h9ZAG1rE64Qui362sc5t_ZnAq00cu9ap1N677fGOCiRar2eZ4X79cDSSzEtVK-V19ByGIhUi5olKNYs1ay_krk' }
    ],
    dairy: [
      { id: 5, name: 'Sữa chua Hy Lạp', qty: '1 tub • Unsweetened', checked: false },
      { id: 6, name: 'Phô mai Feta', qty: '200g • Block', checked: false },
    ]
  });

  const toggleCheck = (category, id) => {
    setItems(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const renderItem = (item, category) => (
    <TouchableOpacity 
      key={item.id}
      activeOpacity={0.7}
      onPress={() => toggleCheck(category, item.id)}
      style={styles.itemCard}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
          {item.checked && <HugeiconsIcon icon={Tick01Icon} size={14} color={Colors.WHITE} />}
        </View>
        
        {item.img && (
          <View style={styles.itemImgContainer}>
            <Image source={{ uri: item.img }} style={styles.itemImg} />
          </View>
        )}
        
        <View style={styles.itemTextContainer}>
          <Text style={[styles.itemName, item.checked && styles.textChecked]}>{item.name}</Text>
          <Text style={[styles.itemQty, item.checked && styles.textChecked]}>{item.qty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping List</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={Share01Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <HugeiconsIcon icon={Settings01Icon} size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* AI Insight */}
        <View style={styles.aiInsightCard}>
          <HugeiconsIcon icon={DiscoverCircleIcon} size={28} color={Colors.PRIMARY} />
          <View style={styles.aiInsightTextContainer}>
            <Text style={styles.aiInsightTitle}>AI Optimization</Text>
            <Text style={styles.aiInsightDesc}>
              Based on your meal plan for the next 4 days, I've consolidated ingredients to save you 15% on waste. Ensure the <Text style={{fontWeight: '700'}}>Rau thơm</Text> is stored in a damp paper towel.
            </Text>
          </View>
        </View>

        {/* Produce Category */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>PRODUCE</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{items.produce.length} items</Text>
            </View>
          </View>
          <View style={styles.itemsList}>
            {items.produce.map(item => renderItem(item, 'produce'))}
          </View>
        </View>

        {/* Meat Category */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>MEAT & POULTRY</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{items.meat.length} item</Text>
            </View>
          </View>
          <View style={styles.itemsList}>
            {items.meat.map(item => renderItem(item, 'meat'))}
          </View>
        </View>

        {/* Dairy Category */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>DAIRY</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{items.dairy.length} items</Text>
            </View>
          </View>
          <View style={styles.itemsList}>
            {items.dairy.map(item => renderItem(item, 'dairy'))}
          </View>
        </View>

        {/* Add Item CTA */}
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
          <HugeiconsIcon icon={PlusSignCircleIcon} size={24} color={Colors.ON_SURFACE_VARIANT} />
          <Text style={styles.addBtnText}>Add Custom Item</Text>
        </TouchableOpacity>

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
    backgroundColor: 'rgba(0, 108, 73, 0.1)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  aiInsightCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.PRIMARY,
    marginBottom: 30,
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
  categorySection: {
    marginBottom: 25,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.ON_SURFACE_VARIANT,
  },
  categoryBadge: {
    backgroundColor: Colors.SECONDARY_CONTAINER,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.ON_SECONDARY_CONTAINER,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#bbcbb8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  itemImgContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f1f3ff',
  },
  itemImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
    marginBottom: 2,
  },
  itemQty: {
    fontSize: 12,
    color: Colors.ON_SURFACE_VARIANT,
  },
  textChecked: {
    opacity: 0.4,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    backgroundColor: '#f1f3ff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#bbcbb8',
    borderRadius: 16,
    marginTop: 10,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.ON_SURFACE_VARIANT,
  }
});
