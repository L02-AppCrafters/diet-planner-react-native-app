import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { WalkingIcon, RunningIcon, Dumbbell01Icon, ZapIcon, Settings01Icon } from '@hugeicons/core-free-icons';

import { UserContext } from '../../context/UserContext';
import Colors from '../../shared/Colors';

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const updateUserPreferences = useMutation(api.Users.UpdateUserPreferences);

  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [age, setAge] = useState('28'); // Default or load from user
  const [activityLevel, setActivityLevel] = useState('Light');

  const bmi = (weight && height) ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : '0.0';
  const getBmiStatus = (bmiValue) => {
    if (bmiValue < 18.5) return 'UNDERWEIGHT';
    if (bmiValue >= 18.5 && bmiValue < 25) return 'NORMAL';
    if (bmiValue >= 25 && bmiValue < 30) return 'OVERWEIGHT';
    return 'OBESE';
  };

  const bmiStatus = getBmiStatus(parseFloat(bmi));

  const handleUpdate = async () => {
    try {
      const data = {
        uid: user._id,
        weight: weight,
        height: height,
        // include other fields...
      };
      
      await updateUserPreferences(data);
      setUser((prev) => ({ ...prev, ...data }));
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const ActivityButton = ({ icon, label, isSelected, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.activityBtn,
        isSelected ? styles.activityBtnSelected : null
      ]}
    >
      <HugeiconsIcon 
        icon={icon} 
        size={24} 
        color={isSelected ? Colors.ON_SURFACE : Colors.ON_SURFACE_VARIANT} 
      />
      <Text style={[
        styles.activityLabel,
        isSelected ? styles.activityLabelSelected : null
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.userInfo}>
          <Image source={require('../../assets/images/user.png')} style={styles.avatar} />
          <Text style={styles.appName}>Nutri Planner</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <HugeiconsIcon icon={Settings01Icon} size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>Body Profile</Text>
          <Text style={styles.subtitle}>
            Let's calibrate your nutritional engine. Your measurements help us calculate the precise energy your body needs.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>HEIGHT (CM)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="175"
                placeholderTextColor={Colors.GRAY}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="70"
                placeholderTextColor={Colors.GRAY}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>AGE: {age}</Text>
            {/* Native Slider could be used here, but using TextInput for simplicity across platforms without extra deps */}
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="28"
            />
          </View>

          <View style={styles.activitySection}>
            <Text style={styles.inputLabel}>ACTIVITY LEVEL</Text>
            <View style={styles.activityGrid}>
              <ActivityButton icon={WalkingIcon} label="Sedentary" isSelected={activityLevel === 'Sedentary'} onPress={() => setActivityLevel('Sedentary')} />
              <ActivityButton icon={RunningIcon} label="Light" isSelected={activityLevel === 'Light'} onPress={() => setActivityLevel('Light')} />
              <ActivityButton icon={Dumbbell01Icon} label="Active" isSelected={activityLevel === 'Active'} onPress={() => setActivityLevel('Active')} />
              <ActivityButton icon={ZapIcon} label="Elite" isSelected={activityLevel === 'Elite'} onPress={() => setActivityLevel('Elite')} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.updateBtnText}>Update Profile Data</Text>
        </TouchableOpacity>

        <View style={styles.bmiCard}>
          <View style={styles.bmiIndicator} />
          <View style={styles.bmiHeader}>
            <View>
              <Text style={styles.bmiLabel}>Current BMI</Text>
              <Text style={styles.bmiValue}>{bmi}</Text>
            </View>
            <View style={styles.bmiStatusBadge}>
              <Text style={styles.bmiStatusText}>{bmiStatus}</Text>
            </View>
          </View>
          
          <View style={styles.bmiBar}>
            <View style={[styles.bmiSegment, { flex: 1, backgroundColor: '#facc15' }]} />
            <View style={[styles.bmiSegment, { flex: 2, backgroundColor: Colors.PRIMARY }]} />
            <View style={[styles.bmiSegment, { flex: 1, backgroundColor: Colors.ERROR }]} />
          </View>
          <Text style={styles.bmiTip}>You are within the {bmiStatus.toLowerCase()} range for your height.</Text>
        </View>

        <View style={styles.tdeeCard}>
          <Text style={styles.tdeeLabel}>Estimated TDEE</Text>
          <View style={styles.tdeeValueRow}>
            <Text style={styles.tdeeDailyText}>Daily Calories</Text>
            <Text style={styles.tdeeValue}>{user?.calories || '2,450'} <Text style={styles.tdeeUnit}>kcal</Text></Text>
          </View>
          <Text style={styles.tdeeDesc}>
            Based on your activity level and body composition, this is the energy required to maintain your current weight.
          </Text>
        </View>

        <View style={styles.imageAccent}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMZETayBsqcI0I6OO96gFYs0T9044rKqWIsS2Zi_Xh8hwRypbalmNWrVaxWynqiCaPkTiduUZWNm4tXM4nD9uLqMr2hUO96SG6hV_c3gNjfHPXYZ207Mgz3mkSv_f6PjMCA1m7HC0vWIcaSuwFkZ-FLx1ssZWqJNM-G0YzDpb4emln9oGHwYu_fH2JUx6yhaWsCG9TxrbnN0Z2Gn31Mv_TI9o5gasjO0MOX2jlnyOOLpyvlfMPewac9EPlCi06ItLv4SJFlYTPcJQ' }} style={styles.accentImg} />
          <View style={styles.accentOverlay}>
            <Text style={styles.accentText}>Precision is the foundation of progress.</Text>
          </View>
        </View>
        
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  settingsBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 108, 73, 0.1)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.ON_SURFACE_VARIANT,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e8fd',
    marginBottom: 20,
    shadowColor: '#141b2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f1f3ff',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    color: Colors.ON_SURFACE,
    fontWeight: '600',
  },
  activitySection: {
    marginTop: 5,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  activityBtn: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f1f3ff',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 10,
  },
  activityBtnSelected: {
    backgroundColor: '#ebf5f1',
    borderColor: Colors.PRIMARY,
  },
  activityLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
  },
  activityLabelSelected: {
    color: Colors.ON_SURFACE,
  },
  updateBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  updateBtnText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  bmiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e8fd',
  },
  bmiIndicator: {
    position: 'absolute',
    left: 4,
    top: 24,
    bottom: 24,
    width: 4,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingLeft: 8,
  },
  bmiLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ON_SURFACE_VARIANT,
  },
  bmiValue: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
  },
  bmiStatusBadge: {
    backgroundColor: '#adedd3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bmiStatusText: {
    color: '#306d58',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bmiBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bmiSegment: {
    height: '100%',
  },
  bmiTip: {
    fontSize: 13,
    color: Colors.ON_SURFACE_VARIANT,
    fontStyle: 'italic',
  },
  tdeeCard: {
    backgroundColor: '#f1f3ff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 25,
  },
  tdeeLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 15,
  },
  tdeeValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 15,
    marginBottom: 15,
  },
  tdeeDailyText: {
    color: Colors.ON_SURFACE_VARIANT,
    fontSize: 15,
  },
  tdeeValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.ON_SURFACE,
  },
  tdeeUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
  },
  tdeeDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.ON_SURFACE_VARIANT,
  },
  imageAccent: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  accentImg: {
    width: '100%',
    height: '100%',
  },
  accentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  accentText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: '800',
  }
});