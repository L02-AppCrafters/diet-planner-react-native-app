import { useState, useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Modal,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const fitnessImg = require('../../../assets/lunch.png'); // Ảnh minh họa tập luyện thể thao

// -------------------------------------------------------------
// Component ScrollPicker Tự Cuộn Dọc Chuyên Nghiệp (Wheel Picker)
// -------------------------------------------------------------
type ScrollPickerProps = {
  items: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  unit: string;
};

function ScrollPicker({ items, selectedValue, onValueChange, unit }: ScrollPickerProps) {
  const itemHeight = 44;
  const visibleItems = 3;
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Padding trống ở đầu và cuối để căn giữa
  const paddedItems = [null, ...items, null];
  
  useEffect(() => {
    const initialIndex = items.indexOf(selectedValue);
    if (initialIndex !== -1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: initialIndex * itemHeight,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / itemHeight);
    if (index >= 0 && index < items.length) {
      const newValue = items[index];
      if (newValue !== selectedValue) {
        onValueChange(newValue);
      }
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerWindow}>
        {/* Thanh highlight ở giữa */}
        <View style={styles.pickerIndicator} />
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          snapToAlignment="center"
          decelerationRate="fast"
          disableIntervalMomentum={true}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
          onScrollEndDrag={handleScroll}
          scrollEventThrottle={16}
          style={[styles.scrollView, { height: itemHeight * visibleItems }]}
        >
          {paddedItems.map((item, idx) => {
            if (item === null) {
              return (
                <View
                  key={`empty-${idx}`}
                  style={[styles.pickerItem, { height: itemHeight }]}
                />
              );
            }
            const isSelected = item === selectedValue;
            return (
              <View key={item} style={[styles.pickerItem, { height: itemHeight }]}>
                <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                  {item}
                  {isSelected && unit ? <Text style={styles.pickerUnitText}> {unit}</Text> : null}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

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
  // Tạo mảng dữ liệu cuộn
  const heights = Array.from({ length: 101 }, (_, i) => 120 + i); // 120cm - 220cm
  const weights = Array.from({ length: 121 }, (_, i) => 30 + i);  // 30kg - 150kg
  const birthYears = Array.from({ length: 81 }, (_, i) => 1940 + i); // 1940 - 2020

  // Ban đầu đặt các thông số ở dạng null (chưa chọn) để đảm bảo "nhập đủ mới hiện"
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [activityLevel, setActivityLevel] = useState<string>(initialProfile.activityLevel);

  // States lưu trữ giá trị tạm thời khi cuộn trong Modal
  const [tempHeight, setTempHeight] = useState<number>(initialProfile.height || 175);
  const [tempWeight, setTempWeight] = useState<number>(initialProfile.weight || 70);
  const [tempBirthYear, setTempBirthYear] = useState<number>(2026 - (initialProfile.age || 28));

  // Trạng thái mở Modal: 'height' | 'weight' | 'year' | null
  const [activeModal, setActiveModal] = useState<'height' | 'weight' | 'year' | null>(null);

  // States tính toán
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState<'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE'>('NORMAL');
  const [tdee, setTdee] = useState<number>(0);

  // Kiểm tra xem đã điền đầy đủ cả 3 thông số chưa
  const isAllFilled = height !== null && weight !== null && birthYear !== null;
  
  // Tính tuổi dựa trên năm sinh (năm hiện tại là 2026)
  const age = birthYear ? (2026 - birthYear) : 0;

  // Thực hiện tính toán chỉ số khi điền đủ
  useEffect(() => {
    if (isAllFilled) {
      calculateMetrics();
    }
  }, [height, weight, birthYear, activityLevel]);

  const calculateMetrics = () => {
    if (height === null || weight === null || birthYear === null) return;
    
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

  // Xác nhận và đóng Modal
  const handleConfirmModal = () => {
    if (activeModal === 'height') {
      setHeight(tempHeight);
    } else if (activeModal === 'weight') {
      setWeight(tempWeight);
    } else if (activeModal === 'year') {
      setBirthYear(tempBirthYear);
    }
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <View style={styles.logoHead} />
            <View style={styles.logoBody} />
          </View>
          <Text style={styles.logoText}>Nutri Planner</Text>
        </View>
        <Pressable accessibilityLabel="Settings" style={styles.headerSettingsBtn}>
          <SvgIcon height={18} source={svgIcons.settings} width={18} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Body Profile</Text>
          <Text style={styles.subtitle}>
            Let's calibrate your nutritional engine. Tap on each field to scroll and enter your values.
          </Text>
        </View>

        {/* Các Trường Input Bấm Cao Cấp */}
        <View style={styles.profileCard}>
          {/* Ô HEIGHT */}
          <Pressable
            style={styles.fieldInput}
            onPress={() => {
              setTempHeight(height || 175);
              setActiveModal('height');
            }}
          >
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>HEIGHT</Text>
              <Text style={styles.fieldPlaceholder}>Scroll to select</Text>
            </View>
            <Text style={[styles.fieldValue, !height && styles.fieldValueEmpty]}>
              {height ? `${height} cm` : '-- cm'}
            </Text>
          </Pressable>

          {/* Ô WEIGHT */}
          <Pressable
            style={styles.fieldInput}
            onPress={() => {
              setTempWeight(weight || 70);
              setActiveModal('weight');
            }}
          >
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>WEIGHT</Text>
              <Text style={styles.fieldPlaceholder}>Scroll to select</Text>
            </View>
            <Text style={[styles.fieldValue, !weight && styles.fieldValueEmpty]}>
              {weight ? `${weight} kg` : '-- kg'}
            </Text>
          </Pressable>

          {/* Ô BIRTH YEAR */}
          <Pressable
            style={styles.fieldInput}
            onPress={() => {
              setTempBirthYear(birthYear || 1998);
              setActiveModal('year');
            }}
          >
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>BIRTH YEAR</Text>
              <Text style={styles.fieldPlaceholder}>Scroll to select</Text>
            </View>
            <Text style={[styles.fieldValue, !birthYear && styles.fieldValueEmpty]}>
              {birthYear ? `${birthYear} (${age} yrs old)` : '--'}
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
            <View style={styles.metricCard}>
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
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View>
                  <Text style={styles.metricCardTitle}>Estimated TDEE</Text>
                  <View style={styles.tdeeHeaderRow}>
                    <Text style={styles.tdeeLabel}>Daily Calories</Text>
                    <Text style={styles.tdeeValue}>{tdee.toLocaleString()} <Text style={styles.tdeeUnit}>kcal</Text></Text>
                  </View>
                </View>
                <SvgIcon height={18} source={svgIcons.trendUp} width={18} />
              </View>
              <Text style={styles.metricDescription}>
                Based on your activity level and body composition, this is the energy required to maintain your current weight.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyPromptCard}>
            <Text style={styles.emptyPromptText}>
              Please select your Height, Weight and Birth Year above to calculate your BMI and TDEE metrics.
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
      {/* Modal Box chứa ScrollPicker (Bottom Sheet Style) */}
      {/* ------------------------------------------------------------- */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activeModal === 'height'
                  ? 'Select Height'
                  : activeModal === 'weight'
                    ? 'Select Weight'
                    : 'Select Birth Year'}
              </Text>
              <Pressable onPress={handleConfirmModal} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmBtnText}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.modalPickerContainer}>
              {activeModal === 'height' && (
                <ScrollPicker
                  items={heights}
                  selectedValue={tempHeight}
                  onValueChange={setTempHeight}
                  unit="cm"
                />
              )}
              {activeModal === 'weight' && (
                <ScrollPicker
                  items={weights}
                  selectedValue={tempWeight}
                  onValueChange={setTempWeight}
                  unit="kg"
                />
              )}
              {activeModal === 'year' && (
                <ScrollPicker
                  items={birthYears}
                  selectedValue={tempBirthYear}
                  onValueChange={setTempBirthYear}
                  unit=""
                />
              )}
            </View>
          </View>
        </Pressable>
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
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderColor: colors.primaryMid,
    borderRadius: 999,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 32,
  },
  logoHead: {
    backgroundColor: '#E2B48D',
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  logoBody: {
    backgroundColor: '#F1E6D9',
    borderRadius: 4,
    height: 10,
    marginTop: 1,
    width: 14,
  },
  logoText: {
    color: colors.primaryMid,
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  headerSettingsBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  mainTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 28,
  },
  subtitle: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  fieldInput: {
    backgroundColor: '#F1F4FF',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldHeader: {
    flexDirection: 'column',
    gap: 2,
  },
  fieldLabel: {
    color: '#475569',
    fontFamily: fontFamily.bold,
    fontSize: 11,
    letterSpacing: 1,
  },
  fieldPlaceholder: {
    color: '#94A3B8',
    fontFamily: fontFamily.regular,
    fontSize: 11,
  },
  fieldValue: {
    color: colors.primaryMid,
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  fieldValueEmpty: {
    color: '#94A3B8',
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },
  activityGroup: {
    marginTop: spacing.sm,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  activityBtn: {
    alignItems: 'center',
    backgroundColor: '#F1F4FF',
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.md,
    width: '47%',
  },
  activityBtnActive: {
    backgroundColor: '#E6F4EA',
    borderWidth: 1.5,
    borderColor: colors.primaryMid,
  },
  activityText: {
    color: '#475569',
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  activityTextActive: {
    color: colors.primaryMid,
    fontFamily: fontFamily.bold,
  },
  btnUpdate: {
    backgroundColor: colors.primaryMid,
    borderRadius: 24,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
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
    fontSize: 16,
  },
  resultsContainer: {
    marginBottom: spacing.sm,
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
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 8,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  metricCardTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  metricValue: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 32,
    marginTop: spacing.xxs,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
  },
  bmiTrack: {
    borderRadius: 999,
    flexDirection: 'row',
    height: 6,
    marginBottom: spacing.lg,
    overflow: 'visible',
    position: 'relative',
    width: '100%',
  },
  bmiColorSegment: {
    height: '100%',
  },
  bmiIndicator: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0F172A',
    borderRadius: 999,
    borderWidth: 2.5,
    height: 12,
    position: 'absolute',
    top: -3,
    transform: [{ translateX: -6 }],
    width: 12,
  },
  metricDescription: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  tdeeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  tdeeLabel: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
  tdeeValue: {
    color: colors.primaryMid,
    fontFamily: fontFamily.bold,
    fontSize: 28,
  },
  tdeeUnit: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  bannerImage: {
    borderRadius: 24,
    height: 140,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  bannerImageStyle: {
    resizeMode: 'cover',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  bannerTag: {
    color: '#34D399',
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: spacing.xxs,
  },
  bannerHeading: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
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
  modalPickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  pickerWindow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    width: '80%',
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  scrollView: {
    width: '100%',
    ...({
      scrollSnapType: 'y mandatory',
    } as any),
  },
  pickerIndicator: {
    backgroundColor: 'rgba(0, 108, 73, 0.08)',
    borderColor: colors.primaryMid,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    height: 44,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 44,
  },
  pickerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    ...({
      scrollSnapAlign: 'center',
    } as any),
  },
  pickerItemText: {
    color: '#94A3B8',
    fontFamily: fontFamily.regular,
    fontSize: 15,
  },
  pickerItemTextSelected: {
    color: colors.primaryMid,
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
  pickerUnitText: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
});
