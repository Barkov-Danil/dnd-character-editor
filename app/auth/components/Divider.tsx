import { View, Text, StyleSheet } from 'react-native';
import { AUTH_COLORS } from '../theme';

export function Divider() {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>Или</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: 312,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: AUTH_COLORS.divider,
  },
  text: {
    color: AUTH_COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Spectral-Regular',
  },
});
