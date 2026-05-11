import { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Dumbbell01Icon, FemaleSymbolFreeIcons, MaleSymbolFreeIcons, WeightScaleIcon, FavouriteIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { api } from '../../convex/_generated/api';

import { UserContext } from './../../context/UserContext';
import Input from './../../components/shared/Input';
import Colors from './../../shared/Colors';
import { CalculateCaloriesAI } from '../../services/AiModel';
import Prompt from '../../shared/Prompt';

export default function Preferences() {
  const router = useRouter();

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const updateUserPreferences = useMutation(api.Users.UpdateUserPreferences);

  const onContinue = async () => {
    if (!weight || !height || !goal || !gender) {
      Alert.alert('Missing Information', 'Please fill in all the fields and select a goal to continue.');
      return;
    }

    if (!user?._id) {
      Alert.alert('Error', 'User not loaded');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        uid: user._id,
        weight: weight,
        height: height,
        goal: goal,
        gender: gender
      };

      // Calculate calories and proteins using AI
      const PROMPT = JSON.stringify(data) + Prompt.CALORIES_PROMPT;
      const AIResult = await CalculateCaloriesAI(PROMPT);
      const AIResponse = AIResult.choices[0].message.content;
      const JSONContent = JSON.parse(AIResponse.replace('```json', '').replace('```', ''));

      const result = await updateUserPreferences({
        ...data,
        ...JSONContent
      });

      setUser(prev => ({
        ...prev,
        ...data,
        ...JSONContent
      }));

      router.replace('/(tabs)/Home');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while saving your preferences.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const GoalCard = ({ title, description, icon, imageUrl, value }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setGoal(value)}
      style={[
        styles.goalCard,
        goal === value && styles.goalCardSelected
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.goalImage} />
        {goal === value && <View style={styles.selectedOverlay} />}
      </View>
      <View style={styles.goalContent}>
        <View style={styles.goalHeader}>
          <View style={[styles.iconContainer, goal === value && styles.iconContainerSelected]}>
            <HugeiconsIcon icon={icon} size={28} color={goal === value ? Colors.PRIMARY : Colors.ON_SURFACE_VARIANT} />
          </View>
          <Text style={[styles.goalTitle, goal === value && styles.goalTitleSelected]}>{title}</Text>
        </View>
        <Text style={styles.goalDescription}>{description}</Text>
        <Text style={[styles.selectText, goal === value && styles.selectTextActive]}>
          {goal === value ? 'Selected' : 'Select Plan'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your path</Text>
        <Text style={styles.subtitle}>
          Personalize your Nutri Planner experience by entering your details and selecting your primary goal.
        </Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Input placeholder='e.g. 60' label='Weight (kg)' onChangeText={setWeight} value={weight} keyboardType="numeric" />
          </View>
          <View style={styles.flex1}>
            <Input placeholder='e.g. 170' label='Height (cm)' onChangeText={setHeight} value={height} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Gender</Text>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setGender('Male')}
            style={[styles.genderCard, gender === 'Male' && styles.genderCardSelected]}
          >
            <HugeiconsIcon icon={MaleSymbolFreeIcons} size={32} color={gender === 'Male' ? Colors.PRIMARY : Colors.GRAY} />
            <Text style={[styles.genderText, gender === 'Male' && styles.genderTextSelected]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGender('Female')}
            style={[styles.genderCard, gender === 'Female' && styles.genderCardSelected]}
          >
            <HugeiconsIcon icon={FemaleSymbolFreeIcons} size={32} color={gender === 'Female' ? Colors.PINK : Colors.GRAY} />
            <Text style={[styles.genderText, gender === 'Female' && { color: Colors.PINK }]}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.goalsSection}>
        <GoalCard
          title="Lose Weight"
          value="Weight Loss"
          description="Burn fat and optimize your body composition with calorie-controlled AI plans."
          icon={WeightScaleIcon}
          imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBV-lT2vhv97FsxieuSZYEn89KEm_vbWiGJM_6PrKDiX7JiO9mma7a0LqGyLm8ncpQpg1x-p7ApUJIRrjkfMiCFXEowr9u96hRE-3UV41KbRUQZsEApWcwz3fYe6-W06XAh_dEzQhHhboWdWLBLdSJbDr0i301rYyMVuwd1q3oFcd9nizBL1eEw3lCzdGsHY1UtmBf-nkyOyYbk6gEEgCaoTGOCcSb3p42es0c6W4U4V1ERl1OcnFz0bU9vZSfIn21UCg1glAFnaFI"
        />

        <GoalCard
          title="Gain Muscle"
          value="Muscle Gain"
          description="Fuel your gains with high-protein macronutrient targeting and surplus guidance."
          icon={Dumbbell01Icon}
          imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC_pEq7pc1YbAvJiGIl1WiokosV_Gj3LCZFigJAVuBMA5aOxfnKssmlkLS3hP92T52TG7rY0ZdQ6UrzvDBPEWxZN_jFOYfRSR0TNDbvIRDYxmYhXM59J9MXjRNfuvhLJ5eXJc2gjkaIZs4ren19CUFzUMLD18QWZhryfHZlYooXW2lgxzDY7hoy7qBEVf_3HyctmT0huxfcTAgt_eLjLCqH_Gn0IgxCgHDsDjA4NchIWzkNeSysVCHwzNYwqRKfFWy27de9j94Sx8Q"
        />

        <GoalCard
          title="Healthy Lifestyle"
          value="Healthy Lifestyle"
          description="Maintain balance, increase energy levels, and improve long-term longevity."
          icon={FavouriteIcon}
          imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBS4ytKXL8cT6DSeWsadXJ7Wc8U4qxHR8GIamg95fmcm1lmSDHlF6IVgP_7-m3189qCyMNuFZWBRVSRHK5o1OdSGA5QqFjnSRxTjoLXeJkWOCA37LnLPomvbSPZo1qlQdNb6MDejG2LUlDMs1cezqHqDCZFgswIWiHvabAv_PwFjNf6cREKUhkFe7KLTSxq_4kJVJGaZ1n7ob9UyozWoWLNYxVQ6CmVkOmzVDN5QpO5fLU3hBcuQM04VVkh_aFDOO2PEfClpcMpWfw"
        />
      </View>

      <View style={styles.aiInsightCard}>
        <HugeiconsIcon icon={SparklesIcon} color={Colors.PRIMARY} size={24} />
        <View style={styles.aiInsightContent}>
          <Text style={styles.aiInsightTitle}>AI Recommendation</Text>
          <Text style={styles.aiInsightText}>
            Based on recent health trends, most users start with 'Healthy Lifestyle' to build sustainable habits before specializing.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, isLoading && { opacity: 0.7 }]}
        onPress={onContinue}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>{isLoading ? 'Generating Plan...' : 'Continue'}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        You can change this goal at any time in your profile settings.
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 10,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.ON_SURFACE_VARIANT,
    textAlign: 'center',
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  flex1: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.ON_SURFACE,
    marginTop: 20,
    marginBottom: 12,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  genderCardSelected: {
    borderColor: Colors.PRIMARY_CONTAINER,
    backgroundColor: '#f1f8f5',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY,
  },
  genderTextSelected: {
    color: Colors.PRIMARY,
  },
  goalsSection: {
    gap: 20,
  },
  goalCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
  },
  goalCardSelected: {
    borderColor: Colors.PRIMARY_CONTAINER,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  goalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 196, 139, 0.2)',
  },
  goalContent: {
    padding: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f9f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: Colors.PRIMARY,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
  },
  goalTitleSelected: {
    color: Colors.PRIMARY,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
    lineHeight: 22,
    marginBottom: 15,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.GRAY,
  },
  selectTextActive: {
    color: Colors.PRIMARY,
  },
  aiInsightCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
    marginTop: 30,
    gap: 15,
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  aiInsightContent: {
    flex: 1,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
    marginBottom: 4,
  },
  aiInsightText: {
    fontSize: 14,
    color: Colors.ON_SURFACE_VARIANT,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  continueButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.ON_SURFACE_VARIANT,
    marginTop: 20,
  }
});