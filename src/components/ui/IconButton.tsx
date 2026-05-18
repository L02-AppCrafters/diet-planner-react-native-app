import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';

type IconButtonProps = {
  label: string;
  symbol: string;
};

export function IconButton({ label, symbol }: IconButtonProps) {
  return (
    <Pressable accessibilityLabel={label} style={styles.button}>
      <Text style={styles.symbol}>{symbol}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  symbol: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
});
