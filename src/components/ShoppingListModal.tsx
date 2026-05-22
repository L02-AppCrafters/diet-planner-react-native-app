import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamily } from '../theme/typography';
import { SvgIcon } from './ui/SvgIcon';
import { svgIcons } from '../assets/icons';

type ShoppingListModalProps = {
  visible: boolean;
  onClose: () => void;
};

const font = {
  regular: {
    fontFamily: fontFamily.regular,
    fontWeight: undefined,
  },
  medium: {
    fontFamily: fontFamily.medium,
    fontWeight: undefined,
  },
  semiBold: {
    fontFamily: fontFamily.semiBold,
    fontWeight: undefined,
  },
  bold: {
    fontFamily: fontFamily.bold,
    fontWeight: undefined,
  },
  manropeBold: {
    fontFamily: fontFamily.manropeBold,
    fontWeight: undefined,
  },
  manropeExtraBold: {
    fontFamily: fontFamily.manropeExtraBold,
    fontWeight: undefined,
  },
} as const;

export function ShoppingListModal({ visible, onClose }: ShoppingListModalProps) {
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearShoppingList } = useApp();

  const handleClearAll = () => {
    Alert.alert(
      "Clear Shopping List",
      "Are you sure you want to remove all ingredients from your shopping list?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearShoppingList }
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.header}>
            <Pressable accessibilityLabel="Close Shopping List" onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Shopping List</Text>
            {shoppingList.length > 0 ? (
              <Pressable onPress={handleClearAll} style={styles.clearButton}>
                <Text style={styles.clearText}>Clear All</Text>
              </Pressable>
            ) : (
              <View style={{ width: 60 }} />
            )}
          </View>

          {/* Modal Content */}
          {shoppingList.length > 0 ? (
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.helperText}>
                Items added from your recipe plan. Tap to check off as you shop.
              </Text>
              
              {shoppingList.map((item) => (
                <View key={item.id} style={[styles.itemRow, item.checked && styles.itemRowChecked]}>
                  {/* Custom Checkbox */}
                  <Pressable
                    onPress={() => toggleShoppingItem(item.id)}
                    style={[styles.checkbox, item.checked && styles.checkboxChecked]}
                  >
                    {item.checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
                  </Pressable>

                  {/* Copy */}
                  <View style={styles.copyContainer}>
                    <Text style={[styles.itemTitle, item.checked && styles.textChecked]}>
                      {item.title}
                    </Text>
                    {item.note ? (
                      <Text style={[styles.itemNote, item.checked && styles.textCheckedMuted]}>
                        {item.note}
                      </Text>
                    ) : null}
                  </View>

                  {/* Quantity */}
                  <Text style={[styles.itemAmount, item.checked && styles.textChecked]}>
                    {item.amount}
                  </Text>

                  {/* Individual Delete Button */}
                  <Pressable
                    accessibilityLabel={`Delete ${item.title}`}
                    onPress={() => removeShoppingItem(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIcon}>🛒</Text>
              </View>
              <Text style={styles.emptyTitle}>Your grocery list is empty</Text>
              <Text style={styles.emptyDescription}>
                Go to the <Text style={{ color: colors.primary, ...font.bold }}>Recipes</Text> tab or open a meal in the <Text style={{ color: colors.primary, ...font.bold }}>Log</Text> tab, and press <Text style={{ color: colors.primary, ...font.bold }}>"Add all to list"</Text> to instantly build your shopping list with required ingredients!
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '82%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: colors.inkMuted,
    ...font.bold,
  },
  headerTitle: {
    fontSize: 20,
    color: colors.ink,
    ...font.manropeBold,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#EF4444',
    ...font.bold,
  },
  listContent: {
    padding: 24,
    paddingBottom: 60,
  },
  helperText: {
    fontSize: 13,
    color: colors.inkMuted,
    ...font.regular,
    lineHeight: 18,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemRowChecked: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTick: {
    color: colors.surface,
    fontSize: 12,
    ...font.bold,
  },
  copyContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    color: colors.ink,
    ...font.bold,
  },
  itemNote: {
    fontSize: 12,
    color: colors.inkSoft,
    ...font.regular,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 14,
    color: colors.primary,
    ...font.bold,
    marginRight: 12,
  },
  textChecked: {
    textDecorationLine: 'line-through',
    color: colors.inkSoft,
  },
  textCheckedMuted: {
    textDecorationLine: 'line-through',
    color: '#CBD5E1',
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    fontSize: 14,
    color: '#94A3B8',
    ...font.bold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 42,
  },
  emptyTitle: {
    fontSize: 22,
    color: colors.ink,
    ...font.manropeBold,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.inkMuted,
    ...font.regular,
    lineHeight: 24,
    textAlign: 'center',
  },
});
