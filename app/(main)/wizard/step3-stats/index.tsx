import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper, TooltipHint, StatBlock } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { generateRandomStats, generateStandardArray } from '../../utils/statGenerator';
import { STAT_METHODS, WIZARD_STEPS } from '../../utils/gameData';
import { STAT_KEYS } from '../../types';
import type { CharacterStats } from '../../types';

const FALLBACK_STATS: CharacterStats = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

export default function Step3Stats() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const selectedRace = useCharacterStore((s) => s.selectedRace);
  const stats = useCharacterStore((s) => s.stats);
  const setStats = useCharacterStore((s) => s.setStats);
  const selectedRaceObject = useCharacterStore((s) => s.selectedRaceObject);
  const [method, setMethod] = useState('4d6');

  const applyRacialBonus = (base: CharacterStats): CharacterStats => {
    if (!selectedRace || !selectedRaceObject) return base;
    const result = { ...base };
    for (const key of STAT_KEYS) {
      const bonus = selectedRaceObject.abilityBonuses[key];
      if (bonus) result[key] = result[key] + bonus;
    }
    return result;
  };

  const generate = () => {
    const base = method === '4d6' ? generateRandomStats() : generateStandardArray();
    setStats(applyRacialBonus(base));
  };

  const finalStats = stats ?? FALLBACK_STATS;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Характеристики</Text>
        <TooltipHint text="Характеристики определяют возможности персонажа. Модификатор = (значение - 10) / 2. Бонусы расы прибавляются автоматически." />
      </View>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      <SegmentedButtons
        value={method}
        onValueChange={setMethod}
        buttons={STAT_METHODS.map((m) => ({ value: m.value, label: m.label }))}
        style={styles.segmented}
      />

      <Button mode="contained" onPress={generate} style={styles.generateBtn}>
        Сгенерировать
      </Button>

      <StatBlock stats={finalStats} />

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back} style={styles.backBtn}>← Назад</Button>
        <Button mode="contained" onPress={() => router.push('/wizard/step4-skills')} disabled={!stats} style={styles.nextBtn}>
          Далее →
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md,
  },
  title: { fontSize: FONT.size.xl, fontWeight: 'bold', color: COLORS.primary },
  segmented: { marginHorizontal: SPACING.md, marginVertical: SPACING.sm },
  generateBtn: { marginHorizontal: SPACING.md, marginVertical: SPACING.sm },
  footer: { flexDirection: 'row', padding: SPACING.md },
  backBtn: { flex: 1, marginRight: SPACING.sm },
  nextBtn: { flex: 1, marginLeft: SPACING.sm },
});
