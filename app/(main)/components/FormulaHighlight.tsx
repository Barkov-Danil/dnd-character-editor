import { Text, StyleSheet } from 'react-native';
import { COLORS, FONT } from '../theme';
import { highlightFormula, type HighlightSegment } from '../utils/diceParser';

const KIND_COLORS: Record<HighlightSegment['kind'], string> = {
  dice: COLORS.accent,
  stat: COLORS.text,
  prof: COLORS.text,
  number: COLORS.text,
  op: COLORS.textSecondary,
  space: COLORS.text,
  unknown: COLORS.text,
};

export function FormulaHighlight({
  input,
  style,
}: {
  input: string;
  style?: import('react-native').TextStyle;
}) {
  if (!input) return null;
  const segments = highlightFormula(input);
  return (
    <Text style={[styles.base, style]}>
      {segments.map((seg, i) => (
        <Text key={i} style={{ color: seg.valid ? COLORS.success : KIND_COLORS[seg.kind] }}>
          {seg.raw}
        </Text>
      ))}
      {'\u200b'}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '700',
    fontSize: FONT.size.lg,
    padding: 0,
    margin: 0,
  },
});
