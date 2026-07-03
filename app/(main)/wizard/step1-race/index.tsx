import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { RACES, WIZARD_STEPS } from '../../utils/gameData';

export default function Step1Race() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const selectedRace = useCharacterStore((s) => s.selectedRace);
  const setSelectedRace = useCharacterStore((s) => s.setSelectedRace);
  const setWizardStep = useCharacterStore((s) => s.setWizardStep);

  const goNext = () => {
    setWizardStep(2);
    router.push('/wizard/step2-class');
  };

  const bonusText = (bonuses: Record<string, number | undefined>) =>
    Object.entries(bonuses).map(([s, v]) => `${s}+${v}`).join(', ');

  return (
    <View style={styles.container}>
      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />
      <Text style={styles.title}>Выберите расу</Text>
      <Text style={styles.subtitle}>Раса определяет бонусы, скорость и особенности</Text>

      <FlatList
        data={Object.values(RACES)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedRace === item.id;
          return (
            <Card
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => setSelectedRace(item.id)}
            >
              <Card.Content>
                <Text style={[styles.name, selected && styles.nameSelected]}>
                  {item.name}
                </Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.bonus}>Бонусы: {bonusText(item.abilityBonuses)}</Text>
                <Text style={styles.traits}>{item.traits.join(', ')}</Text>
              </Card.Content>
            </Card>
          );
        }}
      />

      <View style={styles.footer}>
        <Button mode="contained" onPress={goNext} disabled={!selectedRace}>
          Далее →
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontSize: FONT.size.xxl, fontWeight: 'bold',
    color: COLORS.primary, textAlign: 'center', marginTop: SPACING.md,
  },
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
  name: {
    fontSize: FONT.size.lg, fontWeight: '500', color: COLORS.primary,
  },
  nameSelected: { color: COLORS.accent },
  desc: { fontSize: FONT.size.sm, color: COLORS.text, marginTop: 4 },
  bonus: {
    fontSize: FONT.size.sm, fontWeight: '500',
    color: COLORS.success, marginTop: 6,
  },
  traits: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: 4 },
  footer: { padding: SPACING.md },
});
