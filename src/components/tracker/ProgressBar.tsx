import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

type ProgressBarProps = {
  color: string;
  progress: number;
};

export function ProgressBar({ color, progress }: ProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { backgroundColor: color, width: `${Math.min(progress, 1) * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    borderRadius: 999,
    height: '100%',
  },
  track: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
});
