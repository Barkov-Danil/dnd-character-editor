import { useRef } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { AUTH_COLORS } from '../theme';

const CELL_COUNT = 5;
const CELL_SIZE = 48;
const CELL_GAP = 8;

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function CodeInput({ value, onChange }: Props) {
  const ref = useRef<TextInput>(null);

  const cells = Array.from({ length: CELL_COUNT }, (_, i) => value[i] || '');

  return (
    <View style={styles.row}>
      {cells.map((c, i) => {
        const filled = !!c;
        return (
          <View
            key={i}
            style={[styles.cell, { borderColor: filled ? AUTH_COLORS.accent : AUTH_COLORS.inputBorder }]}
          >
            <Text style={styles.cellText}>{c}</Text>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.slice(0, CELL_COUNT).toUpperCase())}
        keyboardType="default"
        autoCapitalize="characters"
        style={styles.hidden}
        maxLength={CELL_COUNT}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: CELL_GAP,
    justifyContent: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 10,
    backgroundColor: AUTH_COLORS.inputBg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: AUTH_COLORS.textPrimary,
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
