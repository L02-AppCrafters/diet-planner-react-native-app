import { useState, useEffect } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
  Modal,
} from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const fitnessImg = require('../../../assets/fitness-background.png');
const androidStatusBarHeight = StatusBar.currentHeight ?? 0;
const headerTopInset = Math.min(androidStatusBarHeight, 10);

// -------------------------------------------------------------
// Component Màn Hình Chính BodyProfileScreen
// -------------------------------------------------------------
type BodyProfileScreenProps = {
  initialProfile: {
    goal: string;
    height: number;
    weight: number;
    age: number;
    activityLevel: string;
  };
  onUpdateProfile: (profile: any) => void;
};

export function BodyProfileScreen({ initialProfile, onUpdateProfile }: BodyProfileScreenProps) {
  // Ban đầu đặt các thông số ở dạng null (chưa chọn) để đảm bảo "nhập đủ mới hiện"
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState<string>(initialProfile.activityLevel);

  // Trạng thái mở Modal: 'height' | 'weight' | 'age' | null
  const [activeModal, setActiveModal] = useState<'height' | 'weight' | 'age' | null>(null);
  const [modalInputValue, setModalInputValue] = useState('');
  const [modalInputError, setModalInputError] = useState('');

  // States tính toán
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState<'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE'>('NORMAL');
  const [tdee, setTdee] = useState<number>(0);

  // Kiểm tra xem đã điền đầy đủ cả 3 thông số chưa
  const isAllFilled = height !== null && weight !== null && age !== null;

  // Thực hiện tính toán chỉ số khi điền đủ
  useEffect(() => {
    if (isAllFilled) {
      calculateMetrics();
    }
  }, [height, weight, age, activityLevel]);

  const calculateMetrics = () => {
    if (height === null || weight === null || age === null) return;
    
    // 1. Tính BMI
    const bmiVal = weight / ((height / 100) * (height / 100));
    setBmi(Math.round(bmiVal * 10) / 10);

    if (bmiVal < 18.5) setBmiCategory('UNDERWEIGHT');
    else if (bmiVal >= 18.5 && bmiVal < 25) setBmiCategory('NORMAL');
    else if (bmiVal >= 25 && bmiVal < 30) setBmiCategory('OVERWEIGHT');
    else setBmiCategory('OBESE');

    // 2. Tính TDEE (Mifflin-St Jeor)
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    let multiplier = 1.2; // sedentary
    if (activityLevel === 'light') multiplier = 1.375;
    else if (activityLevel === 'active') multiplier = 1.55;
    else if (activityLevel === 'elite') multiplier = 1.725;

    setTdee(Math.round(bmr * multiplier));
  };

  const getBmiCategoryColor = () => {
    switch (bmiCategory) {
      case 'UNDERWEIGHT': return '#F59E0B';
      case 'NORMAL': return '#10B981';
      case 'OVERWEIGHT': return '#EF4444';
      case 'OBESE': return '#B91C1C';
    }
  };

  const handleUpdate = () => {
    if (!isAllFilled) return;

    onUpdateProfile({
      goal: initialProfile.goal,
      height: height,
      weight: weight,
      age: age,
      activityLevel: activityLevel,
      tdee: tdee || 2450,
    });
  };

  const openNumberModal = (field: 'height' | 'weight' | 'age') => {
    setModalInputValue('');
    setModalInputError('');
    setActiveModal(field);
  };

  const getModalConfig = () => {
    if (activeModal === 'height') {
      return {
        helper: 'Enter height in centimeters. Valid range: 50-250 cm.',
        keyboardType: 'decimal-pad' as const,
        placeholder: '165.5',
        suffix: 'cm',
        title: 'Enter Height',
      };
    }

    if (activeModal === 'weight') {
      return {
        helper: 'Enter weight in kilograms. Valid range: 20-300 kg.',
        keyboardType: 'decimal-pad' as const,
        placeholder: '60.5',
        suffix: 'kg',
        title: 'Enter Weight',
      };
    }

    return {
      helper: 'Enter your age as a whole number. Valid range: 5-120.',
      keyboardType: 'number-pad' as const,
      placeholder: '28',
      suffix: 'yrs',
      title: 'Enter Age',
    };
  };

  const sanitizeNumberInput = (value: string) => {
    setModalInputError('');

    if (activeModal === 'age') {
      setModalInputValue(value.replace(/\D/g, '').slice(0, 3));
      return;
    }

    const hasLeadingMinus = value.trim().startsWith('-');
    const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
    const [integerPart, ...decimalParts] = normalized.split('.');
    const decimalPart = decimalParts.join('');
    const nextValue = decimalParts.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
    setModalInputValue(hasLeadingMinus ? `-${nextValue}` : nextValue);
  };

  const getValidationError = (parsedValue: number) => {
    if (!modalInputValue.trim()) {
      return 'Please enter a value before continuing.';
    }

    if (!Number.isFinite(parsedValue)) {
      return 'Please enter a valid number.';
    }

    if (parsedValue <= 0) {
      return 'Value must be greater than zero.';
    }

    if (activeModal === 'height' && (parsedValue < 50 || parsedValue > 250)) {
      return 'Height should be between 50 and 250 cm.';
    }

    if (activeModal === 'weight' && (parsedValue < 20 || parsedValue > 300)) {
      return 'Weight should be between 20 and 300 kg.';
    }

    if (activeModal === 'age') {
      if (!/^\d{1,3}$/.test(modalInputValue)) {
        return 'Age must be a whole number.';
      }

      if (parsedValue < 5 || parsedValue > 120) {
        return 'Age should be between 5 and 120.';
      }
    }

    return '';
  };

  // Xác nhận và đóng Modal
  const handleConfirmModal = () => {
    const parsedValue = Number(modalInputValue);
    const validationError = getValidationError(parsedValue);

    if (validationError) {
      setModalInputError(validationError);
      return;
    }

    if (activeModal === 'height') {
      setHeight(Math.round(parsedValue * 10) / 10);
    } else if (activeModal === 'weight') {
      setWeight(Math.round(parsedValue * 10) / 10);
    } else if (activeModal === 'age') {
      setAge(Math.trunc(parsedValue));
    }
    Keyboard.dismiss();
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.header} />
      <View style={styles.appHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <View style={styles.logoHead} />
            <View style={styles.logoBody} />
          </View>
          <Text style={styles.logoText}>Body Profile</Text>
        </View>
        <Pressable accessibilityLabel="Settings" style={styles.headerSettingsBtn}>
          <SvgIcon height={18} source={svgIcons.settings} width={18} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Body Profile</Text>
          <Text style={styles.subtitle}>
            Let's calibrate your nutritional engine. Tap each field and enter your values.
          </Text>
        </View>

        {/* Các Trường Input Bấm Cao Cấp */}
        <View style={styles.profileCard}>
          {/* Ô HEIGHT */}
          <Pressable
            style={styles.fieldInput}
            onPress={() => openNumberModal('height')}
          >
            <Text style={styles.fieldLabel}>HEIGHT (CM)</Text>
            <Text style={[styles.fieldValue, !height && styles.fieldValueEmpty]}>
              {height ? `${height}` : '--'}
            </Text>
          </Pressable>

          {/* Ô WEIGHT */}
          <Pressable
            style={styles.fieldInput}
            onPress={() => openNumberModal('weight')}
          >
            <Text style={styles.fieldLabel}>WEIGHT (KG)</Text>
            <Text style={[styles.fieldValue, !weight && styles.fieldValueEmpty]}>
              {weight ? `${weight}` : '--'}
            </Text>
          </Pressable>

          {/* Ô BIRTH YEAR */}
          <Pressable
            style={styles.fieldInput}
            onPress={() => openNumberModal('age')}
          >
            <Text style={styles.fieldLabel}>AGE</Text>
            <Text style={[styles.fieldValue, !age && styles.fieldValueEmpty]}>
              {age ? `${age}` : '--'}
            </Text>
          </Pressable>

          {/* Khối chọn mức độ hoạt động */}
          <View style={styles.activityGroup}>
            <Text style={styles.fieldLabel}>ACTIVITY LEVEL</Text>
            <View style={styles.activityGrid}>
              {[
                { id: 'sedentary', label: 'Sedentary', icon: svgIcons.activitySedentary },
                { id: 'light', label: 'Light', icon: svgIcons.activityLight },
                { id: 'active', label: 'Active', icon: svgIcons.activityActive },
                { id: 'elite', label: 'Elite', icon: svgIcons.activityElite },
              ].map((lvl) => {
                const isActive = activityLevel === lvl.id;
                return (
                  <Pressable
                    key={lvl.id}
                    onPress={() => setActivityLevel(lvl.id)}
                    style={[styles.activityBtn, isActive && styles.activityBtnActive]}
                  >
                    <SvgIcon
                      color={isActive ? colors.primaryMid : '#475569'}
                      height={18}
                      source={lvl.icon}
                      width={18}
                    />
                    <Text style={[styles.activityText, isActive && styles.activityTextActive]}>
                      {lvl.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.btnUpdate, !isAllFilled && styles.btnUpdateDisabled]}
          onPress={handleUpdate}
          disabled={!isAllFilled}
        >
          <Text style={styles.btnUpdateText}>Update Profile Data</Text>
        </Pressable>

        {/* CHỈ HIỂN THỊ BMI và TDEE KHI ĐÃ NHẬP ĐỦ */}
        {isAllFilled ? (
          <View style={styles.resultsContainer}>
            {/* BMI Card */}
            <View style={[styles.metricCard, styles.metricCardAccent]}>
              <View style={styles.metricHeader}>
                <View>
                  <Text style={styles.metricCardTitle}>Current BMI</Text>
                  <Text style={styles.metricValue}>{bmi}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: `${getBmiCategoryColor()}15` }]}>
                  <Text style={[styles.badgeText, { color: getBmiCategoryColor() }]}>{bmiCategory}</Text>
                </View>
              </View>
              {/* BMI color bar indicator */}
              <View style={styles.bmiTrack}>
                <View style={[styles.bmiColorSegment, { backgroundColor: '#F59E0B', flex: 18.5 }]} />
                <View style={[styles.bmiColorSegment, { backgroundColor: '#10B981', flex: 6.5 }]} />
                <View style={[styles.bmiColorSegment, { backgroundColor: '#EF4444', flex: 5 }]} />
                <View style={[styles.bmiColorSegment, { backgroundColor: '#B91C1C', flex: 10 }]} />
                {/* BMI indicator needle/thumb */}
                <View style={[styles.bmiIndicator, { left: `${Math.max(10, Math.min(((bmi - 15) / 25) * 100, 90))}%` }]} />
              </View>
              <Text style={styles.metricDescription}>
                You are within the healthy range for your height.
              </Text>
            </View>

            {/* TDEE Card */}
            <View style={[styles.metricCard, styles.tdeeCard]}>
              <View style={styles.tdeeTitleRow}>
                <SvgIcon height={25} source={svgIcons.estimatedTdee} width={32} />
                <Text style={styles.tdeeCardTitle}>Estimated TDEE</Text>
              </View>
              <View style={styles.tdeeHeaderRow}>
                <Text style={styles.tdeeLabel}>Daily Calories</Text>
                <View style={styles.tdeeValueRow}>
                  <Text style={styles.tdeeValue}>{tdee.toLocaleString()}</Text>
                  <Text style={styles.tdeeUnit}>kcal</Text>
                </View>
              </View>
              <View style={styles.tdeeDivider} />
              <Text style={styles.tdeeDescription}>
                Based on your activity level and body composition, this is the energy required to maintain your current weight.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyPromptCard}>
            <Text style={styles.emptyPromptText}>
              Please enter your Height, Weight and Age above to calculate your BMI and TDEE metrics.
            </Text>
          </View>
        )}

        {/* Banner Samurai Lifestyle */}
        <ImageBackground source={fitnessImg} style={styles.bannerImage} imageStyle={styles.bannerImageStyle}>
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTag}>FITNESS</Text>
            <Text style={styles.bannerHeading}>Precision is the foundation of progress.</Text>
          </View>
        </ImageBackground>
      </ScrollView>

      {/* ------------------------------------------------------------- */}
      {/* Modal Box chứa numeric input (Bottom Sheet Style) */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveModal(null)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {getModalConfig().title}
              </Text>
              <Pressable onPress={handleConfirmModal} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmBtnText}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalHelperText}>{getModalConfig().helper}</Text>
              <View style={[styles.numberInputShell, modalInputError ? styles.numberInputShellError : null]}>
                <TextInput
                  autoFocus={true}
                  keyboardType={getModalConfig().keyboardType}
                  maxLength={activeModal === 'age' ? 3 : 6}
                  onChangeText={sanitizeNumberInput}
                  placeholder={getModalConfig().placeholder}
                  placeholderTextColor="#94A3B8"
                  returnKeyType="done"
                  onSubmitEditing={handleConfirmModal}
                  style={styles.numberInput}
                  value={modalInputValue}
                />
                {getModalConfig().suffix ? <Text style={styles.inputSuffix}>{getModalConfig().suffix}</Text> : null}
              </View>
              {modalInputError ? <Text style={styles.modalErrorText}>{modalInputError}</Text> : null}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  appHeader: {
    alignItems: 'center',
    backgroundColor: colors.header,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: headerTopInset,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
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
  logoHead: {
    backgroundColor: '#E2B48D',
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  logoBody: {
    backgroundColor: '#F1E6D9',
    borderRadius: 4,
    height: 14,
    marginTop: 1,
    width: 18,
  },
  logoText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 22,
  },
  headerSettingsBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingBottom: 72,
    paddingHorizontal: 25,
    paddingTop: 34,
  },
  titleSection: {
    marginBottom: 54,
  },
  mainTitle: {
    color: colors.ink,
    fontFamily: fontFamily.manropeExtraBold,
    fontSize: 38,
    lineHeight: 46,
  },
  subtitle: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 21,
    lineHeight: 31,
    marginTop: 18,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingBottom: 34,
    paddingHorizontal: 34,
    paddingTop: 36,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  fieldInput: {
    marginBottom: 34,
  },
  fieldLabel: {
    color: colors.inkMuted,
    fontFamily: fontFamily.bold,
    fontSize: 15,
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  fieldValue: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    color: '#7A8191',
    fontFamily: fontFamily.regular,
    fontSize: 20,
    height: 64,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 19,
  },
  fieldValueEmpty: {
    color: '#94A3B8',
    fontFamily: fontFamily.medium,
  },
  activityGroup: {
    marginTop: 0,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
    rowGap: 16,
  },
  activityBtn: {
    alignItems: 'center',
    backgroundColor: '#F1F4FF',
    borderColor: 'transparent',
    borderRadius: 22,
    borderWidth: 2,
    gap: 8,
    height: 86,
    justifyContent: 'center',
    width: '45.5%',
  },
  activityBtnActive: {
    backgroundColor: '#E4F8EF',
    borderColor: colors.primary,
  },
  activityText: {
    color: colors.inkMuted,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  activityTextActive: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
  btnUpdate: {
    backgroundColor: colors.primaryMid,
    borderRadius: 24,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 34,
    shadowColor: colors.primaryMid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  btnUpdateDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnUpdateText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 21,
  },
  resultsContainer: {
    marginBottom: 2,
  },
  emptyPromptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyPromptText: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 26,
    paddingBottom: 25,
    paddingHorizontal: 34,
    paddingTop: 25,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 22,
    elevation: 1,
  },
  metricCardAccent: {
    borderLeftColor: colors.primary,
    borderLeftWidth: 5,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  metricCardTitle: {
    color: colors.inkMuted,
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  metricValue: {
    color: colors.ink,
    fontFamily: fontFamily.black,
    fontSize: 39,
    lineHeight: 44,
    marginTop: spacing.xxs,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  badgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  bmiTrack: {
    borderRadius: 999,
    flexDirection: 'row',
    height: 8,
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  bmiColorSegment: {
    height: '100%',
  },
  bmiIndicator: {
    display: 'none',
  },
  metricDescription: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  tdeeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 14,
    justifyContent: 'space-between',
    marginTop: 36,
  },
  tdeeCard: {
    backgroundColor: '#EFF2FF',
    borderColor: 'transparent',
    borderRadius: 28,
    paddingBottom: 32,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  tdeeTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  tdeeCardTitle: {
    color: colors.ink,
    fontFamily: fontFamily.black,
    fontSize: 23,
    lineHeight: 29,
  },
  tdeeLabel: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    flexShrink: 1,
    fontSize: 18,
  },
  tdeeValueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexShrink: 0,
    gap: 8,
  },
  tdeeValue: {
    color: colors.ink,
    fontFamily: fontFamily.black,
    fontSize: 36,
    lineHeight: 42,
  },
  tdeeUnit: {
    color: colors.inkMuted,
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  tdeeDivider: {
    backgroundColor: '#E2E7F6',
    height: 1,
    marginBottom: 22,
    marginTop: 22,
  },
  tdeeDescription: {
    color: colors.inkMuted,
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 26,
  },
  bannerImage: {
    borderRadius: 18,
    height: 178,
    marginTop: 6,
    overflow: 'hidden',
  },
  bannerImageStyle: {
    resizeMode: 'cover',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(7, 38, 48, 0.44)',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingHorizontal: 26,
    paddingTop: 22,
  },
  bannerTag: {
    alignSelf: 'flex-end',
    color: 'rgba(255,255,255,0.88)',
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: 1,
  },
  bannerHeading: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 21,
    lineHeight: 29,
    width: '80%',
  },

  // -------------------------------------------------------------
  // Styles của Modal & Picker
  // -------------------------------------------------------------
  modalOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.md,
  },
  modalTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  modalConfirmBtn: {
    backgroundColor: colors.primaryMid,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  modalInputContainer: {
    gap: spacing.md,
  },
  modalHelperText: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  numberInputShell: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#DDE7F2',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: spacing.xl,
  },
  numberInputShellError: {
    backgroundColor: '#FFF7F7',
    borderColor: '#EF4444',
  },
  numberInput: {
    color: '#0F172A',
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 30,
    paddingVertical: 10,
  },
  inputSuffix: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  modalErrorText: {
    color: '#DC2626',
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
});
