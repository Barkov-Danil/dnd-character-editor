import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper, TooltipHint } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { CHARACTER_CLASSES, WIZARD_STEPS } from '../../utils/gameData';

export default function Step2Class() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const selectedClass = useCharacterStore((s) => s.selectedClass);
  const selectedRace = useCharacterStore((s) => s.selectedRace);
  const setSelectedClass = useCharacterStore((s) => s.setSelectedClass);

  const goNext = () => {
    router.push('/wizard/step3-stats');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Выбор класса</Text>
        <TooltipHint text="Класс определяет боевые навыки, куб хитов, спас-броски и доступные навыки. Каждый класс задаёт роль персонажа в партии." />
      </View>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      <Text style={styles.subtitle}>
        Выберите класс{selectedRace ? ` (раса: ${selectedRace})` : ''}
      </Text>

      <FlatList
        data={Object.values(CHARACTER_CLASSES)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedClass === item.id;
          return (
            <Card
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => setSelectedClass(item.id)}
            >
              <Card.Content>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.info}>
                  КХ: d{item.hitDie} · Осн.: {item.primaryStat} · Навыки: {item.skillChoices} из {item.skillPool.length}
                </Text>
                <Text style={styles.saves}>Спас-броски: {item.savingThrows.join(', ')}</Text>
              </Card.Content>
            </Card>
          );
        }}
        contentContainerStyle={{ paddingVertical: SPACING.sm }}
      />

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back} style={styles.backBtn}>← Назад</Button>
        <Button mode="contained" onPress={goNext} disabled={!selectedClass} style={styles.nextBtn}>
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
  cardSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.surfaceVariant },
  name: { fontSize: FONT.size.lg, fontWeight: '600', color: COLORS.primary },
  desc: { fontSize: FONT.size.sm, color: COLORS.text, marginTop: 4, lineHeight: 20 },
  info: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: 6 },
  saves: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: 2 },
  footer: { flexDirection: 'row', padding: SPACING.md },
  backBtn: { flex: 1, marginRight: SPACING.sm },
  nextBtn: { flex: 1, marginLeft: SPACING.sm },
});
