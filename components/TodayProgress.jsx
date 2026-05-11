import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useContext } from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Colors from '../shared/Colors';
import { UserContext } from '../context/UserContext';

export default function TodayProgress() {
  const { user } = useContext(UserContext);

  const totalCalories = user?.calories || 2450;
  const consumedCalories = 1240; // Hardcoded for demo, replace with real data
  const leftCalories = totalCalories - consumedCalories;
  
  // Progress calculation
  const radius = 60;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(consumedCalories / totalCalories, 1);
  const strokeDashoffset = circumference - (circumference * progressPercent);

  const MacroCard = ({ title, current, total, color, percent }) => (
    <View style={styles.macroCard}>
      <Text style={styles.macroTitle}>{title}</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { backgroundColor: color, width: `${percent}%` }]} />
      </View>
      <Text style={styles.macroText}>{current}g / {total}g</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Fuel your <Text style={styles.highlight}>Potential.</Text>
      </Text>
      
      <Text style={styles.subtext}>
        You've consumed {consumedCalories} kcal today. Stay on track for your {totalCalories} kcal daily goal.
      </Text>

      <View style={styles.progressSection}>
        <View style={styles.ringContainer}>
          <Svg width="150" height="150" viewBox="0 0 150 150">
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={Colors.PRIMARY} stopOpacity="1" />
                <Stop offset="100%" stopColor={Colors.PRIMARY_CONTAINER} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            
            {/* Background Circle */}
            <Circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#f1f3ff"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress Circle */}
            <Circle
              cx="75"
              cy="75"
              r={radius}
              stroke="url(#grad)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 75 75)"
            />
          </Svg>
          <View style={styles.ringTextContainer}>
            <Text style={styles.ringValue}>{leftCalories > 0 ? leftCalories : 0}</Text>
            <Text style={styles.ringLabel}>KCAL LEFT</Text>
          </View>
        </View>

        <View style={styles.macrosContainer}>
          <MacroCard title="Protein" current={112} total={user?.protein || 180} color={Colors.PRIMARY} percent={65} />
          <MacroCard title="Carbs" current={145} total={300} color="#005ac2" percent={40} />
          <MacroCard title="Fat" current={58} total={75} color={Colors.PRIMARY_CONTAINER} percent={80} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
    marginBottom: 8,
  },
  highlight: {
    color: Colors.PRIMARY,
  },
  subtext: {
    fontSize: 16,
    color: Colors.ON_SURFACE_VARIANT,
    lineHeight: 24,
    marginBottom: 25,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
  },
  ringTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.ON_SURFACE,
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
    letterSpacing: 1,
  },
  macrosContainer: {
    flex: 1,
    marginLeft: 20,
    gap: 12,
  },
  macroCard: {
    backgroundColor: Colors.SURFACE_CONTAINER_LOWEST,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#edf0ff',
  },
  macroTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.ON_SURFACE_VARIANT,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f1f3ff',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ON_SURFACE,
  }
});