import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper, TooltipHint } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { RACES, WIZARD_STEPS } from '../../utils/gameData';

export default function Step1Race() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const selectedRace = useCharacterStore((s) => s.selectedRace);
  const setSelectedRace = useCharacterStore((s) => s.setSelectedRace);
  const setWizardStep = useCharacterStore((s) => s.setWizardStep);
  const customRaces = useCharacterStore((s) => s.customRaces);
  const [subRaceId, setSubRaceId] = useState<string | null>(null);

  const allRaces = [...Object.values(RACES), ...customRaces];

  const selectedRaceObj = allRaces.find((r) => r.id === selectedRace);
  const subRaces = selectedRaceObj?.subRaces ?? [];

  const goNext = () => {
    setWizardStep(2);
    router.push('/wizard/step2-class');
  };

  const bonusText = (bonuses: Record<string, number | undefined>) =>
    Object.entries(bonuses).filter(([, v]) => v !== undefined).map(([s, v]) => `${s}+${v}`).join(', ');

  const handleSelectRace = (raceId: string) => {
    setSelectedRace(raceId);
    setSubRaceId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Выберите расу</Text>
        <TooltipHint text="Раса определяет бонусы к характеристикам, скорость, размер, языки и особенности. Некоторые расы имеют подрасы с дополнительными бонусами." />
      </View>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      <Text style={styles.subtitle}>Раса определяет бонусы, скорость и особенности</Text>

      <FlatList
        data={allRaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedRace === item.id;
          const isCustom = 'isCustom' in item;
          return (
            <Card
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => handleSelectRace(item.id)}
            >
              <Card.Content>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, selected && styles.nameSelected]}>
                    {item.name}
                  </Text>
                  {isCustom && <Chip style={styles.customChip}>Homebrew</Chip>}
                </View>
                <Text style={styles.desc}>{item.description}</Text>
                {item.abilityBonuses && (
                  <Text style={styles.bonus}>Бонусы: {bonusText(item.abilityBonuses as Record<string, number | undefined>)}</Text>
                )}
                <Text style={styles.traits}>{item.traits?.join(', ')}</Text>
              </Card.Content>
            </Card>
          );
        }}
        ListFooterComponent={
          subRaces.length > 0 ? (
            <View style={styles.subRaceSection}>
              <Text style={styles.subRaceTitle}>Подраса:</Text>
              <View style={styles.subRaceRow}>
                {subRaces.map((sr) => {
                  const active = subRaceId === sr.id;
                  return (
                    <Chip
                      key={sr.id}
                      selected={active}
                      onPress={() => setSubRaceId(sr.id)}
                      style={[styles.subRaceChip, active && styles.subRaceChipActive]}
                    >
                      {sr.name}
                    </Chip>
                  );
                })}
              </View>
            </View>
          ) : null
        }
      />

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back} style={styles.backBtn}>← Назад</Button>
        <Button mode="contained" onPress={goNext} disabled={!selectedRace} style={styles.nextBtn}>
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
  subtitle: {
    fontSize: FONT.size.sm, color: COLORS.textSecondary,
    textAlign: 'center', marginHorizontal: SPACING.md, marginBottom: SPACING.sm,
  },
  card: {
    marginHorizontal: SPACING.md, marginVertical: SPACING.xs,
    borderRadius: 8, borderWidth: 2, borderColor: 'transparent',
    backgroundColor: COLORS.surface,
  },
  cardSelected: { borderColor: COLORS.primary },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: FONT.size.lg, fontWeight: '500', color: COLORS.primary },
  nameSelected: { color: COLORS.accent },
  customChip: { backgroundColor: COLORS.accent, height: 24 },
  desc: { fontSize: FONT.size.sm, color: COLORS.text, marginTop: 4 },
  bonus: { fontSize: FONT.size.sm, fontWeight: '500', color: COLORS.success, marginTop: 6 },
  traits: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: 4 },
  subRaceSection: { padding: SPACING.md },
  subRaceTitle: { fontSize: FONT.size.sm, color: COLORS.text, marginBottom: 8 },
  subRaceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subRaceChip: { backgroundColor: COLORS.surfaceVariant },
  subRaceChipActive: { backgroundColor: COLORS.primary },
  footer: { flexDirection: 'row', padding: SPACING.md },
  backBtn: { flex: 1, marginRight: SPACING.sm },
  nextBtn: { flex: 1, marginLeft: SPACING.sm },
});
