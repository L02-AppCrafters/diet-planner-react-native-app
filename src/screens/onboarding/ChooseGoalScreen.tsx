import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const loseWeightImg = require('../../../assets/lose-weight-background.png');
const gainMuscleImg = require('../../../assets/gain-muscle-background.png');
const healthyLifestyleImg = require('../../../assets/healthy-lifestyle-background.png');

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
    iconBg: '#E8FFF4',
  },
  {
    id: 'gain_muscle',
    title: 'Gain Muscle',
    description: 'Fuel your gains with high-protein macronutrient targeting and surplus guidance.',
    image: gainMuscleImg,
    icon: svgIcons.goalGainMuscle,
    iconBg: '#E8FFF4',
  },
  {
    id: 'healthy_lifestyle',
    title: 'Healthy Lifestyle',
    description: 'Maintain balance, increase energy levels, and improve long-term longevity.',
    image: healthyLifestyleImg,
    icon: svgIcons.goalHealthyLifestyle,
    iconBg: '#E8FFF4',
  },
];

export function ChooseGoalScreen({ onSelectGoal }: ChooseGoalScreenProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>('lose_weight');

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
          <View style={styles.aiRail} />
          <View style={styles.aiContent}>
            <View style={styles.aiHeader}>
              <SvgIcon height={22} source={svgIcons.aiInsight} width={22} />
              <Text style={styles.aiTitle}>AI Recommendation</Text>
            </View>
            <Text style={styles.aiText}>
              Based on recent health trends, most users start with 'Healthy Lifestyle' to build sustainable habits before
              specializing.
            </Text>
          </View>
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
    backgroundColor: '#F8F8FF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 38,
    paddingTop: 46,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    color: colors.ink,
    fontFamily: fontFamily.manropeExtraBold,
    fontSize: 36,
    lineHeight: 44,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 19,
    lineHeight: 30,
    marginTop: 14,
    maxWidth: 330,
    textAlign: 'center',
  },
  goalsContainer: {
    gap: 42,
    marginBottom: 68,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    borderRadius: 18,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  cardSelected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
  },
  cardImage: {
    height: 128,
    resizeMode: 'cover',
    width: '100%',
  },
  cardContent: {
    minHeight: 220,
    paddingBottom: 28,
    paddingHorizontal: 32,
    paddingTop: 28,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  cardTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 21,
    lineHeight: 28,
  },
  cardDescription: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 72,
    maxWidth: 272,
  },
  selectLink: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  selectLinkActive: {
    color: colors.primary,
  },
  aiBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    marginBottom: 64,
    minHeight: 138,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 22,
    elevation: 2,
  },
  aiRail: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 999,
    borderTopRightRadius: 999,
    marginVertical: 16,
    width: 4,
  },
  aiContent: {
    flex: 1,
    paddingBottom: 24,
    paddingHorizontal: 26,
    paddingTop: 25,
  },
  aiHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  aiTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
  aiText: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 23,
    marginLeft: 34,
    marginTop: 8,
  },
  btnContinue: {
    backgroundColor: colors.primaryMid,
    alignItems: 'center',
    borderRadius: 24,
    height: 68,
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: colors.primaryMid,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },
  btnText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  footerNote: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
});
