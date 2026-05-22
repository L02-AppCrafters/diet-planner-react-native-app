import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { svgIcons } from '../assets/icons';
import { SvgIcon } from '../components/ui/SvgIcon';
import { AddSnackTab } from './tabs/AddSnackTab';
import { HomeTab } from './tabs/HomeTab';
import { LogTab } from './tabs/LogTab';
import { ProgressTab } from './tabs/ProgressTab';
import { RecipesTab } from './tabs/RecipesTab';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamily } from '../theme/typography';
import { AppTab } from '../types/navigation';
import { ShoppingListModal } from '../components/ShoppingListModal';
import { useApp } from '../context/AppContext';

type HomeScreenProps = {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
};

const tabs: Array<{ key: AppTab; icon: string; iconHeight: number; iconWidth: number }> = [
    { key: 'Home', icon: svgIcons.home, iconHeight: 18, iconWidth: 16 },
    { key: 'Log', icon: svgIcons.log, iconHeight: 20, iconWidth: 20 },
    { key: 'Recipes', icon: svgIcons.recipes, iconHeight: 18, iconWidth: 18 },
    { key: 'Progress', icon: svgIcons.progress, iconHeight: 17, iconWidth: 22 },
];

export function HomeScreen({ activeTab, onTabChange }: HomeScreenProps) {
    const [logRoute, setLogRoute] = useState<'log' | 'addSnack'>('log');
    const [isShoppingListVisible, setIsShoppingListVisible] = useState(false);
    const isAddSnack = activeTab === 'Log' && logRoute === 'addSnack';
    const headerTitle =
        isAddSnack
            ? 'NutriPlanner'
            : ({
                Home: 'Nutri Planner',
                Log: 'Weekly Plan',
                Recipes: 'Discover Fuel',
                Progress: 'Analytics',
            } as const)[activeTab];

    return (
        <View style={styles.viewport}>
            <View style={styles.phone}>
                <Header
                    onBack={isAddSnack ? () => setLogRoute('log') : undefined}
                    onShoppingListPress={() => setIsShoppingListVisible(true)}
                    title={headerTitle}
                />
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {activeTab === 'Home' ? <HomeTab /> : null}
                    {activeTab === 'Log' && logRoute === 'log' ? <LogTab onAddSnack={() => setLogRoute('addSnack')} /> : null}
                    {isAddSnack ? <AddSnackTab /> : null}
                    {activeTab === 'Recipes' ? <RecipesTab /> : null}
                    {activeTab === 'Progress' ? <ProgressTab /> : null}
                </ScrollView>
                <BottomNavigation
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        if (tab !== 'Log') {
                            setLogRoute('log');
                        }
                        onTabChange(tab);
                    }}
                />
                <ShoppingListModal
                    visible={isShoppingListVisible}
                    onClose={() => setIsShoppingListVisible(false)}
                />
            </View>
        </View>
    );
}

function Header({ onBack, onShoppingListPress, title }: { onBack?: () => void; onShoppingListPress: () => void; title: string }) {
    const { shoppingList } = useApp();
    const uncheckedCount = shoppingList.filter(item => !item.checked).length;

    return (
        <View style={styles.header}>
            {onBack ? (
                <Pressable accessibilityLabel="Back to Log Page" onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backIcon}>‹</Text>
                </Pressable>
            ) : null}
            <View style={styles.avatar}>
                <View style={styles.avatarHead} />
                <View style={styles.avatarBody} />
            </View>
            <Text style={styles.logo}>{title}</Text>
            
            <Pressable accessibilityLabel="Open Shopping List" onPress={onShoppingListPress} style={styles.shoppingCartButton}>
                <SvgIcon height={20} source={svgIcons.shoppingBag} width={18} />
                {uncheckedCount > 0 ? (
                    <View style={styles.shoppingBadge}>
                        <Text style={styles.shoppingBadgeText}>{uncheckedCount}</Text>
                    </View>
                ) : null}
            </Pressable>

            <Pressable accessibilityLabel="Open settings" style={styles.gearButton}>
                <SvgIcon height={20} source={svgIcons.settings} width={21} />
            </Pressable>
        </View>
    );
}

function BottomNavigation({ activeTab, onTabChange }: HomeScreenProps) {
    return (
        <View style={styles.navShell}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                        key={tab.key}
                        onPress={() => onTabChange(tab.key)}
                        style={[styles.navItem, isActive && styles.navItemActive]}
                    >
                        <SvgIcon
                            color={isActive ? colors.primary : colors.inkSoft}
                            height={tab.iconHeight}
                            source={tab.icon}
                            width={tab.iconWidth}
                        />
                        <Text style={[styles.navText, isActive && styles.navTextActive]}>{tab.key}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        backgroundColor: colors.ink,
        borderColor: colors.primaryMid,
        borderRadius: 999,
        borderWidth: 3,
        height: 42,
        justifyContent: 'center',
        overflow: 'hidden',
        width: 42,
    },
    avatarBody: {
        backgroundColor: '#F1E6D9',
        borderRadius: 5,
        height: 14,
        marginTop: 1,
        width: 18,
    },
    avatarHead: {
        backgroundColor: '#E2B48D',
        borderRadius: 999,
        height: 12,
        width: 12,
    },
    backButton: {
        alignItems: 'center',
        height: 36,
        justifyContent: 'center',
        marginRight: spacing.sm,
        width: 28,
    },
    backIcon: {
        color: colors.primary,
        fontFamily: fontFamily.bold,
        fontWeight: undefined,
        fontSize: 34,
        lineHeight: 36,
    },
    gearButton: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    shoppingCartButton: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        width: 40,
        marginRight: spacing.sm,
        position: 'relative',
    },
    shoppingBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#EF4444',
        borderRadius: 999,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: colors.header,
    },
    shoppingBadgeText: {
        color: colors.surface,
        fontSize: 9,
        fontFamily: fontFamily.bold,
        fontWeight: 'bold',
        lineHeight: 11,
    },
    header: {
        alignItems: 'center',
        backgroundColor: colors.header,
        flexDirection: 'row',
        height: 74,
        paddingHorizontal: 25,
    },
    logo: {
        color: colors.primary,
        flex: 1,
        fontFamily: fontFamily.bold,
        fontWeight: undefined,
        fontSize: 20,
        marginLeft: spacing.md,
    },
    navItem: {
        alignItems: 'center',
        borderRadius: 16,
        justifyContent: 'center',
        minWidth: 74,
        paddingHorizontal: 12,
        paddingVertical: 9,
    },
    navItemActive: {
        backgroundColor: colors.primarySoft,
    },
    navShell: {
        alignItems: 'center',
        backgroundColor: colors.nav,
        borderColor: '#E9F4EF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderWidth: 1,
        bottom: 0,
        flexDirection: 'row',
        height: 100,
        justifyContent: 'space-around',
        left: 0,
        paddingHorizontal: 18,
        position: 'absolute',
        right: 0,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.15,
        shadowRadius: 26,
    },
    navText: {
        color: colors.inkSoft,
        fontFamily: fontFamily.semiBold,
        fontWeight: undefined,
        fontSize: 11,
        marginTop: spacing.xs,
    },
    navTextActive: {
        color: colors.primary,
    },
    phone: {
        backgroundColor: colors.background,
        flex: 1,
        maxWidth: 430,
        overflow: 'hidden',
        width: '100%',
    },
    scrollContent: {
        paddingBottom: 132,
        paddingHorizontal: 25,
    },
    viewport: {
        alignItems: 'center',
        backgroundColor: '#000000',
        flex: 1,
    },
});
