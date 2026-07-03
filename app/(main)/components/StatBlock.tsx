import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SPACING } from '../theme';
import { STAT_KEYS, STAT_LABELS, CharacterStats } from '../types';
import { formatModifier } from '../utils/rulesEngine';

export function StatBlock({ stats, size = 'normal' }: { stats: CharacterStats; size?: 'small' | 'normal' }) {
  const small = size === 'small';
  return (
    <View style={styles.container}>
      {STAT_KEYS.map((key) => {
        const value = stats[key];
        return (
          <View key={key} style={[styles.statBox, small && styles.statBoxSmall]}>
            <Text style={[styles.value, small && styles.valueSmall]}>{value}</Text>
            <Text style={[styles.modifier, small && styles.modifierSmall]}>
              {formatModifier(value)}
            </Text>
            <Text style={[styles.label, small && styles.labelSmall]}>
              {STAT_LABELS[key]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.md,
  },
  statBox: {
    alignItems: 'center',
    padding: SPACING.sm,
    minWidth: 50,
  },
  statBoxSmall: {
    padding: 4,
    minWidth: 40,
  },
  value: {
    fontSize: FONT.size.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  valueSmall: {
    fontSize: FONT.size.md,
  },
  modifier: {
    fontSize: FONT.size.sm,
    color: COLORS.text,
    marginTop: 2,
  },
  modifierSmall: {
    fontSize: FONT.size.xs,
  },
  label: {
    fontSize: FONT.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  labelSmall: {
    fontSize: 10,
  },
});
