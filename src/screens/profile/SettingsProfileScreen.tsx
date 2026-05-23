import { useState, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, SafeAreaView, Modal, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { svgIcons } from '../../assets/icons';
import { SvgIcon } from '../../components/ui/SvgIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

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

type SettingsProfileScreenProps = {
  profile: {
    goal: string;
    height: number;
    weight: number;
    age: number;
    activityLevel: string;
    tdee?: number;
    weightHistory?: { date: string; weight: number }[];
  };
  onBack: () => void;
  onUpdateGoal: (goal: string) => void;
  onUpdateStats: (newWeight: number, newHeight: number, weightHistory: { date: string; weight: number }[]) => void;
};

export function SettingsProfileScreen({ profile, onBack, onUpdateGoal, onUpdateStats }: SettingsProfileScreenProps) {
  // Trạng thái mở modal chỉnh sửa: 'goal' | 'weight' | 'height' | null
  const [activeModal, setActiveModal] = useState<'goal' | 'weight' | 'height' | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string>(profile.goal);

  // States chọn số tạm thời
  const [tempWeight, setTempWeight] = useState<number>(profile.weight);
  const [tempHeight, setTempHeight] = useState<number>(profile.height);

  // Tạo mảng dữ liệu cuộn
  const heights = Array.from({ length: 101 }, (_, i) => 120 + i); // 120cm - 220cm
  const weights = Array.from({ length: 121 }, (_, i) => 30 + i);  // 30kg - 150kg

  // Lịch sử cân nặng hằng ngày
  const weightLogs = profile.weightHistory || [
    { date: '2026-05-22', weight: profile.weight + 0.2 },
    { date: '2026-05-23', weight: profile.weight }
  ];

  // Hàm tính toán sự chênh lệch cân nặng so với hôm qua động
  const getWeightDelta = (history: { date: string; weight: number }[]) => {
    if (history.length < 2) return { text: 'First log today', isDecrease: true };
    const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    const diff = latest.weight - prev.weight;
    const diffFixed = Math.abs(diff).toFixed(1);
    if (diff > 0) return { text: `+${diffFixed} from yesterday`, isDecrease: false };
    if (diff < 0) return { text: `-${diffFixed} from yesterday`, isDecrease: true };
    return { text: 'Same as yesterday', isDecrease: true };
  };

  const deltaInfo = getWeightDelta(weightLogs);

  // Helper map goal sang nhãn hiển thị trực quan
  const getGoalLabel = (goalId: string) => {
    switch (goalId) {
      case 'lose_weight':
        return 'Lose Weight Plan';
      case 'gain_muscle':
        return 'Gain Muscle Plan';
      case 'healthy_lifestyle':
      default:
        return 'Healthy Lifestyle Plan';
    }
  };

  // Mock data khớp Figma cho đẹp
  const user = {
    name: 'Alex Sterling',
    plan: getGoalLabel(profile.goal),
    weight: `${profile.weight} kg`,
    weightDelta: deltaInfo.text,
    height: `${profile.height} cm`,
    age: `${profile.age} yrs`,
    caloriesGoal: profile.tdee || 2450,
    caloriesConsumed: 1592,
  };

  const caloriesLeft = user.caloriesGoal - user.caloriesConsumed;
  const progressPct = user.caloriesConsumed / user.caloriesGoal;

  // Lưu thông số cân nặng/chiều cao
  const handleSaveStats = () => {
    if (activeModal === 'weight') {
      const todayStr = '2026-05-23'; // Sử dụng ngày hiện tại của ứng dụng
      const existsIndex = weightLogs.findIndex((log) => log.date === todayStr);
      let newHistory = [...weightLogs];
      if (existsIndex !== -1) {
        newHistory[existsIndex] = { ...newHistory[existsIndex], weight: tempWeight };
      } else {
        newHistory.push({ date: todayStr, weight: tempWeight });
      }
      onUpdateStats(tempWeight, profile.height, newHistory);
    } else if (activeModal === 'height') {
      onUpdateStats(profile.weight, tempHeight, weightLogs);
    }
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable accessibilityLabel="Back to Dashboard" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Pressable accessibilityLabel="Notifications" style={styles.bellButton}>
          {/* Vẽ icon Bell đơn giản bằng SVG */}
          <Svg height={20} viewBox="0 0 20 20" width={20}>
            <Path
              d="M10 20C11.103 20 12 19.103 12 18H8C8 19.103 8.897 20 10 20ZM17 15V9C17 5.93 14.86 3.36 12 2.62V2C12 0.9 11.1 0 10 0C8.9 0 8 0.9 8 2V2.62C5.14 3.36 3 5.93 3 9V15L1 17V18H19V17L17 15Z"
              fill={colors.primaryMid}
            />
            {/* Chấm đỏ thông báo */}
            <Circle cx={16} cy={4} fill="#EF4444" r={3.5} />
          </Svg>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profilePlan}>{user.plan}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Ô WEIGHT - Bấm để log cân nặng hằng ngày */}
          <Pressable
            accessibilityLabel="Edit Weight"
            style={[styles.statCard, styles.statCardWeight]}
            onPress={() => {
              setTempWeight(profile.weight);
              setActiveModal('weight');
            }}
          >
            <Text style={styles.statLabel}>WEIGHT (TAP TO LOG)</Text>
            <Text style={styles.statValueWeight}>{user.weight}</Text>
            <View style={styles.deltaContainer}>
              <View style={!deltaInfo.isDecrease ? { transform: [{ rotate: '180deg' }] } : undefined}>
                <SvgIcon
                  color={deltaInfo.isDecrease ? '#10B981' : '#EF4444'}
                  height={8}
                  source={svgIcons.downArrow}
                  width={10}
                />
              </View>
              <Text style={[styles.deltaText, { color: deltaInfo.isDecrease ? '#10B981' : '#EF4444' }]}>
                {user.weightDelta}
              </Text>
            </View>
          </Pressable>

          <View style={styles.statCardSmallCol}>
            {/* Ô HEIGHT - Bấm để chỉnh sửa */}
            <Pressable
              accessibilityLabel="Edit Height"
              style={styles.statCardSmall}
              onPress={() => {
                setTempHeight(profile.height);
                setActiveModal('height');
              }}
            >
              <Text style={styles.statLabel}>HEIGHT (TAP)</Text>
              <Text style={styles.statValueSmall}>{user.height}</Text>
            </Pressable>
            <View style={styles.statCardSmall}>
              <Text style={styles.statLabel}>AGE</Text>
              <Text style={styles.statValueSmall}>{user.age}</Text>
            </View>
          </View>
        </View>

        {/* Daily Fuel Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Daily Fuel</Text>
            <Text style={styles.sectionSubtitle}>Your AI-calculated macros</Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => {
              setSelectedGoal(profile.goal);
              setActiveModal('goal');
            }}
          >
            <Text style={styles.editBtnText}>Edit Goal</Text>
          </Pressable>
        </View>

        {/* Macros card */}
        <View style={styles.fuelCard}>
          <View style={styles.calorieRow}>
            <View>
              <Text style={styles.calorieLabel}>CALORIES</Text>
              <Text style={styles.calorieValue}>
                {user.caloriesGoal.toLocaleString()} <Text style={styles.calorieUnit}>/ kcal</Text>
              </Text>
            </View>
            <View style={styles.lightningIconContainer}>
              <SvgIcon height={20} source={svgIcons.energyLightning} width={16} />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPct * 100}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLeftText}>{user.caloriesConsumed.toLocaleString()} consumed</Text>
            <Text style={styles.progressRightText}>{caloriesLeft.toLocaleString()} left</Text>
          </View>

          <View style={styles.divider} />

          {/* Core Macros Ring Indicators */}
          <View style={styles.macrosRingRow}>
            <MacroIndicator color="#006C49" label="PROTEIN" value="160g" percentage={0.88} />
            <MacroIndicator color="#2563EB" label="CARBS" value="280g" percentage={0.72} />
            <MacroIndicator color="#374151" label="FATS" value="75g" percentage={0.65} />
          </View>
        </View>

        {/* AI Insight Section */}
        <View style={styles.aiInsightCard}>
          <View style={styles.aiHeadingRow}>
            <SvgIcon height={18} source={svgIcons.aiInsight} width={18} />
            <Text style={styles.aiHeadingText}>AI Wellness Insight</Text>
          </View>
          <Text style={styles.aiDescriptionText}>
            Based on your active recovery yesterday, we've increased your <Text style={styles.aiBoldText}>Protein target</Text> by 15g to support muscle repair. Your hydration levels are slightly below baseline.
          </Text>
          <View style={styles.pillsRow}>
            <View style={[styles.pill, styles.pillHydration]}>
              <Text style={styles.pillTextHydration}>HYDRATION ALERT</Text>
            </View>
            <View style={[styles.pill, styles.pillRecovery]}>
              <Text style={styles.pillTextRecovery}>RECOVERY MODE</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Chỉnh Sửa Mục Tiêu (Bottom Sheet Style) */}
      <Modal
        visible={activeModal === 'goal'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Your Goal</Text>
              <Pressable onPress={() => setActiveModal(null)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.modalGoalOptions}>
              {[
                {
                  id: 'lose_weight',
                  title: 'Lose Weight',
                  desc: 'Burn fat and optimize body composition',
                  color: '#E6F4EA',
                  icon: svgIcons.goalLoseWeight,
                },
                {
                  id: 'gain_muscle',
                  title: 'Gain Muscle',
                  desc: 'Fuel muscle gains with protein targets',
                  color: '#E8F0FE',
                  icon: svgIcons.goalGainMuscle,
                },
                {
                  id: 'healthy_lifestyle',
                  title: 'Healthy Lifestyle',
                  desc: 'Maintain balance and improve longevity',
                  color: '#E6F7F0',
                  icon: svgIcons.goalHealthyLifestyle,
                },
              ].map((opt) => {
                const isSelected = selectedGoal === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSelectedGoal(opt.id)}
                    style={[
                      styles.modalGoalCard,
                      isSelected && styles.modalGoalCardSelected,
                    ]}
                  >
                    <View style={[styles.modalGoalIconContainer, { backgroundColor: opt.color }]}>
                      <SvgIcon height={18} source={opt.icon} width={18} />
                    </View>
                    <View style={styles.modalGoalCardContent}>
                      <Text style={styles.modalGoalCardTitle}>{opt.title}</Text>
                      <Text style={styles.modalGoalCardDesc}>{opt.desc}</Text>
                    </View>
                    <View style={[styles.modalRadio, isSelected && styles.modalRadioActive]}>
                      {isSelected && <View style={styles.modalRadioInner} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.modalSaveBtn}
              onPress={() => {
                onUpdateGoal(selectedGoal);
                setActiveModal(null);
              }}
            >
              <Text style={styles.modalSaveBtnText}>Save New Goal</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Modal Log Cân Nặng Hằng Ngày (Daily Weight Sheet) */}
      <Modal
        visible={activeModal === 'weight'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Daily Weight</Text>
              <Pressable onPress={handleSaveStats} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmBtnText}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.modalPickerContainer}>
              <ScrollPicker
                items={weights}
                selectedValue={tempWeight}
                onValueChange={setTempWeight}
                unit="kg"
              />
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Modal Chỉnh Sửa Chiều Cao (Height Sheet) */}
      <Modal
        visible={activeModal === 'height'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Height</Text>
              <Pressable onPress={handleSaveStats} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmBtnText}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.modalPickerContainer}>
              <ScrollPicker
                items={heights}
                selectedValue={tempHeight}
                onValueChange={setTempHeight}
                unit="cm"
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// Sub-component vẽ vòng tròn chỉ số đa lượng
function MacroIndicator({
  color,
  label,
  value,
  percentage,
}: {
  color: string;
  label: string;
  value: string;
  percentage: number;
}) {
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <View style={styles.macroIndicator}>
      <View style={styles.ringContainer}>
        <Svg height={size} width={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            r={radius}
            stroke="#EDF2F7"
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            originX={size / 2}
            originY={size / 2}
            r={radius}
            rotation="-90"
            stroke={color}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
          />
        </Svg>
        <View style={styles.macroValueContainer}>
          <Text style={styles.macroIndicatorValue}>{value}</Text>
        </View>
      </View>
      <Text style={styles.macroIndicatorLabel}>{label}</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 28,
  },
  backIcon: {
    color: colors.primaryMid,
    fontFamily: fontFamily.bold,
    fontSize: 34,
    lineHeight: 36,
  },
  bellButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  profileHeader: {
    marginBottom: spacing.xl,
  },
  profileName: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 28,
  },
  profilePlan: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    marginTop: spacing.xxs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: spacing.lg,
  },
  statCardWeight: {
    flex: 1.2,
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  statCardSmallCol: {
    flex: 1,
    gap: spacing.md,
  },
  statCardSmall: {
    backgroundColor: '#F1F4FF',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statLabel: {
    color: '#64748B',
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: spacing.xxs,
  },
  statValueWeight: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 26,
  },
  statValueSmall: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  deltaContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
    marginTop: spacing.xs,
  },
  deltaText: {
    color: '#10B981',
    fontFamily: fontFamily.bold,
    fontSize: 11,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 22,
  },
  sectionSubtitle: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: spacing.xxs,
  },
  editBtn: {
    backgroundColor: '#EDF2F7',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  editBtnText: {
    color: '#475569',
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  fuelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  calorieLabel: {
    color: '#64748B',
    fontFamily: fontFamily.bold,
    fontSize: 11,
    letterSpacing: 1,
  },
  calorieValue: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 28,
    marginTop: spacing.xxs,
  },
  calorieUnit: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  lightningIconContainer: {
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  progressBarTrack: {
    backgroundColor: '#EDF2F7',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    backgroundColor: '#10B981',
    borderRadius: 999,
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  progressLeftText: {
    color: '#475569',
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  progressRightText: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  divider: {
    backgroundColor: '#F1F5F9',
    height: 1.5,
    marginVertical: spacing.xl,
  },
  macrosRingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroIndicator: {
    alignItems: 'center',
  },
  ringContainer: {
    position: 'relative',
    height: 64,
    width: 64,
  },
  macroValueContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroIndicatorValue: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  macroIndicatorLabel: {
    color: '#64748B',
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: spacing.sm,
  },
  aiInsightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryMid,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  aiHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  aiHeadingText: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  aiDescriptionText: {
    color: '#475569',
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  aiBoldText: {
    color: '#006C49',
    fontFamily: fontFamily.bold,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pillHydration: {
    backgroundColor: '#E6F4EA',
  },
  pillRecovery: {
    backgroundColor: '#EEF2F6',
  },
  pillTextHydration: {
    color: '#006C49',
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  pillTextRecovery: {
    color: '#4F46E5',
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
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
  modalCloseBtn: {
    padding: spacing.xs,
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  modalGoalOptions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  modalGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
  },
  modalGoalCardSelected: {
    borderColor: colors.primaryMid,
    backgroundColor: '#F0FAF5',
  },
  modalGoalIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 36,
    width: 36,
    marginRight: spacing.md,
  },
  modalGoalCardContent: {
    flex: 1,
  },
  modalGoalCardTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  modalGoalCardDesc: {
    color: '#64748B',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  modalRadio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  modalRadioActive: {
    borderColor: colors.primaryMid,
  },
  modalRadioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryMid,
  },
  modalSaveBtn: {
    backgroundColor: colors.primaryMid,
    borderRadius: 24,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryMid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 16,
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
    width: '100%',
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
  scrollView: {
    width: '100%',
    ...({
      scrollSnapType: 'y mandatory',
    } as any),
  },
});
