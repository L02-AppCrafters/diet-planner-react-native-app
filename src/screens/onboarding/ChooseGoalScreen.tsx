import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const loseWeightImg = require('../../../assets/mediterranean-salad.png');
const gainMuscleImg = require('../../../assets/grass-fed-steak-with-garlic-asparagus.png');
const healthyLifestyleImg = require('../../../assets/vegan-buddha-bowl.png');

type ChooseGoalScreenProps = {
  onSelectGoal: (goal: string) => void;
};

type GoalOption = {
  id: string;
  title: string;
  description: string;
  image: any;
  icon: string;
  iconBg: string;
};

const goals: GoalOption[] = [
  {
    id: 'lose_weight',
    title: 'Lose Weight',
    description: 'Burn fat and optimize your body composition with calorie-controlled AI plans.',
    image: loseWeightImg,
    icon: svgIcons.goalLoseWeight,
    iconBg: '#E6F4EA',
  },
  {
    id: 'gain_muscle',
    title: 'Gain Muscle',
    description: 'Fuel your gains with high-protein macronutrient targeting and surplus guidance.',
    image: gainMuscleImg,
    icon: svgIcons.goalGainMuscle,
    iconBg: '#E8F0FE',
  },
  {
    id: 'healthy_lifestyle',
    title: 'Healthy Lifestyle',
    description: 'Maintain balance, increase energy levels, and improve long-term longevity.',
    image: healthyLifestyleImg,
    icon: svgIcons.goalHealthyLifestyle,
    iconBg: '#E6F7F0',
  },
];

export function ChooseGoalScreen({ onSelectGoal }: ChooseGoalScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>('healthy_lifestyle');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose your path</Text>
          <Text style={styles.subtitle}>
            Personalize your Nutri Planner experience by selecting the primary goal you want to achieve today.
          </Text>
        </View>

        <View style={styles.goalsContainer}>
          {goals.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <Pressable
                key={goal.id}
                onPress={() => setSelectedGoal(goal.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <Image source={goal.image} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: goal.iconBg }]}>
                      <SvgIcon height={18} source={goal.icon} width={18} />
                    </View>
                    <Text style={styles.cardTitle}>{goal.title}</Text>
                  </View>
                  <Text style={styles.cardDescription}>{goal.description}</Text>
                  <Text style={[styles.selectLink, isSelected && styles.selectLinkActive]}>
                    Select Plan  ›
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <SvgIcon height={16} source={svgIcons.aiInsight} width={16} />
            <Text style={styles.aiTitle}>AI Recommendation</Text>
          </View>
          <Text style={styles.aiText}>
            Based on recent health trends, most users start with 'Healthy Lifestyle' to build sustainable habits before specializing.
          </Text>
        </View>

        <Pressable style={styles.btnContinue} onPress={() => onSelectGoal(selectedGoal)}>
          <Text style={styles.btnText}>Continue</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          You can change this goal at any time in your profile settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  title: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 28,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  goalsContainer: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.primaryMid,
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  cardImage: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  cardTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  cardDescription: {
    color: '#475569',
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
    marginLeft: 40,
  },
  selectLink: {
    color: '#64748B',
    fontFamily: fontFamily.medium,
    fontSize: 13,
    marginLeft: 40,
  },
  selectLinkActive: {
    color: colors.primaryMid,
  },
  aiBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryMid,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  aiTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  aiText: {
    color: '#475569',
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  btnContinue: {
    backgroundColor: colors.primaryMid,
    borderRadius: 24,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primaryMid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  btnText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  footerNote: {
    color: '#94A3B8',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    textAlign: 'center',
  },
});
