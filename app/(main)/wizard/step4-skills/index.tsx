import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Checkbox } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper, TooltipHint } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { SKILLS_LIST, WIZARD_STEPS } from '../../utils/gameData';

export default function Step4Skills() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const selectedClassObject = useCharacterStore((s) => s.selectedClassObject);
  const selectedSkills = useCharacterStore((s) => s.selectedSkills);
  const setSelectedSkills = useCharacterStore((s) => s.setSelectedSkills);

  const skillPool = selectedClassObject?.skillPool ?? [];
  const requiredCount = selectedClassObject?.skillChoices ?? 0;
  const currentCount = selectedSkills.filter((s) => s.proficient).length;

  const toggle = (skillId: string) => {
    const existing = selectedSkills.find((s) => s.skillId === skillId && s.proficient);
    if (existing) {
      setSelectedSkills(selectedSkills.filter((s) => s.skillId !== skillId));
      return;
    }
    if (currentCount < requiredCount) {
      setSelectedSkills([...selectedSkills, { skillId, proficient: true, expertise: false }]);
    }
  };

  const canProceed = currentCount === requiredCount;
  const skillsToShow = SKILLS_LIST.filter((s) => skillPool.includes(s.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Выбор навыков</Text>
        <TooltipHint text="Выберите навыки из пула класса. Профессия добавляет бонус мастерства к проверкам соответствующих характеристик." />
      </View>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      <Text style={styles.subtitle}>
        Выберите {requiredCount} навыков ({currentCount}/{requiredCount})
      </Text>

      <FlatList
        data={skillsToShow}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedSkills.some((s) => s.skillId === item.id && s.proficient);
          const disabled = !selected && currentCount >= requiredCount;
          return (
            <Card
              style={[styles.card, selected && styles.cardSelected, disabled && styles.cardDisabled]}
              onPress={() => !disabled && toggle(item.id)}
            >
              <Card.Content style={styles.row}>
                <Checkbox
                  status={selected ? 'checked' : 'unchecked'}
                  disabled={disabled}
                  onPress={() => !disabled && toggle(item.id)}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.stat}>{item.stat}</Text>
                </View>
              </Card.Content>
            </Card>
          );
        }}
        contentContainerStyle={{ paddingVertical: SPACING.sm }}
      />

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back} style={styles.backBtn}>← Назад</Button>
        <Button mode="contained" onPress={() => router.push('/wizard/step5-details')} disabled={!canProceed} style={styles.nextBtn}>
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
    borderRadius: 8, borderWidth: 1, borderColor: 'transparent',
    backgroundColor: COLORS.surface,
  },
  cardSelected: { borderColor: COLORS.primary },
  cardDisabled: { backgroundColor: COLORS.surfaceVariant, opacity: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: SPACING.sm },
  name: { fontSize: FONT.size.md, color: COLORS.text },
  stat: { fontSize: FONT.size.xs, color: COLORS.textSecondary },
  footer: { flexDirection: 'row', padding: SPACING.md },
  backBtn: { flex: 1, marginRight: SPACING.sm },
  nextBtn: { flex: 1, marginLeft: SPACING.sm },
});
