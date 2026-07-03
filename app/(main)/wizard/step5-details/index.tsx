import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper, TooltipHint } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { ALIGNMENTS, WIZARD_STEPS } from '../../utils/gameData';

export default function Step5Details() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const characterName = useCharacterStore((s) => s.characterName);
  const characterBackground = useCharacterStore((s) => s.characterBackground);
  const characterAlignment = useCharacterStore((s) => s.characterAlignment);
  const setCharacterName = useCharacterStore((s) => s.setCharacterName);
  const setCharacterBackground = useCharacterStore((s) => s.setCharacterBackground);
  const setCharacterAlignment = useCharacterStore((s) => s.setCharacterAlignment);

  const canProceed = characterName.trim() && characterBackground.trim() && characterAlignment;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Детали персонажа</Text>
        <TooltipHint text="Имя, предыстория и мировоззрение определяют образ и мотивацию персонажа. Эти данные влияют на отыгрыш и взаимодействие с миром." />
      </View>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      <View style={styles.form}>
        <TextInput
          label="Имя персонажа"
          value={characterName}
          onChangeText={setCharacterName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Предыстория"
          value={characterBackground}
          onChangeText={setCharacterBackground}
          mode="outlined"
          style={styles.input}
        />

        <Text style={styles.label}>Мировоззрение:</Text>
        <View style={styles.alignmentGrid}>
          {ALIGNMENTS.map((alignment) => (
            <Button
              key={alignment}
              mode={characterAlignment === alignment ? 'contained' : 'outlined'}
              onPress={() => setCharacterAlignment(alignment)}
              style={styles.alignmentBtn}
              contentStyle={styles.alignmentBtnContent}
              compact
            >
              {alignment}
            </Button>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back} style={styles.backBtn}>← Назад</Button>
        <Button mode="contained" onPress={() => router.push('/wizard/step6-review')} disabled={!canProceed} style={styles.nextBtn}>
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
  form: { padding: SPACING.md },
  input: { marginBottom: SPACING.md, backgroundColor: COLORS.surface },
  label: { fontSize: FONT.size.sm, color: COLORS.text, marginBottom: SPACING.sm },
  alignmentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  alignmentBtn: { margin: 2 },
  alignmentBtnContent: { paddingVertical: 2, paddingHorizontal: 8 },
  footer: { flexDirection: 'row', padding: SPACING.md },
  backBtn: { flex: 1, marginRight: SPACING.sm },
  nextBtn: { flex: 1, marginLeft: SPACING.sm },
});
