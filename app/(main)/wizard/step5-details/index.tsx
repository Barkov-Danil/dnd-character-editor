import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper, TooltipHint } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { ALIGNMENTS, BACKGROUNDS, WIZARD_STEPS } from '../../utils/gameData';
import { getCharacterService } from '../../../../src/application/CharacterServiceProvider';

export default function Step5Details() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const characterName = useCharacterStore((s) => s.characterName);
  const characterBackground = useCharacterStore((s) => s.characterBackground);
  const selectedBackgroundId = useCharacterStore((s) => s.selectedBackgroundId);
  const characterAlignment = useCharacterStore((s) => s.characterAlignment);
  const setCharacterName = useCharacterStore((s) => s.setCharacterName);
  const setCharacterBackground = useCharacterStore((s) => s.setCharacterBackground);
  const setSelectedBackground = useCharacterStore((s) => s.setSelectedBackground);
  const setCharacterAlignment = useCharacterStore((s) => s.setCharacterAlignment);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);

  const selectedBg = BACKGROUNDS.find((b) => b.id === selectedBackgroundId);

  const genBiography = async () => {
    const service = getCharacterService();
    const state = useCharacterStore.getState();
    const char = {
      id: 'temp',
      name: state.characterName || 'Безымянный',
      race: state.selectedRaceObject?.name || state.selectedRace || '',
      class: state.selectedClassObject?.name || state.selectedClass || '',
      level: 1,
      stats: state.stats || { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      background: state.characterBackground || 'Неизвестно',
      alignment: state.characterAlignment,
    } as any;
    try {
      const bio = service.generateBackgroundWithoutSave(char);
      setCharacterBackground(bio);
    } catch {
      Alert.alert('Ошибка', 'Не удалось сгенерировать биографию');
    }
  };

  const handleSelectBg = (bgId: string) => {
    setSelectedBackground(bgId);
    const bg = BACKGROUNDS.find((b) => b.id === bgId);
    if (bg) setCharacterBackground(bg.description);
    setBgPickerOpen(false);
  };

  const canProceed = characterName.trim() && characterBackground.trim() && characterAlignment;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Детали персонажа</Text>
        <TooltipHint text="Имя, предыстория и мировоззрение определяют образ и мотивацию персонажа. Эти данные влияют на отыгрыш и взаимодействие с миром." />
      </View>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      <ScrollView style={styles.form}>
        <TextInput
          label="Имя персонажа"
          value={characterName}
          onChangeText={setCharacterName}
          mode="outlined"
          style={styles.input}
        />

        <Text style={styles.label}>Предыстория:</Text>
        <View style={styles.bgRow}>
          {selectedBg ? (
            <Chip
              selected
              onPress={() => setBgPickerOpen(!bgPickerOpen)}
              style={styles.bgChip}
            >
              {selectedBg.name}
            </Chip>
          ) : (
            <Button mode="outlined" onPress={() => setBgPickerOpen(!bgPickerOpen)} style={styles.bgBtn}>
              {bgPickerOpen ? 'Скрыть' : 'Выбрать предысторию'}
            </Button>
          )}
          <Button mode="text" onPress={genBiography} textColor={COLORS.accent}>
            Сгенерировать
          </Button>
        </View>

        {bgPickerOpen && (
          <View style={styles.bgList}>
            {BACKGROUNDS.map((bg) => {
              const active = selectedBackgroundId === bg.id;
              return (
                <Card
                  key={bg.id}
                  style={[styles.bgCard, active && styles.bgCardActive]}
                  onPress={() => handleSelectBg(bg.id)}
                >
                  <Card.Content>
                    <Text style={styles.bgName}>{bg.name}</Text>
                    <Text style={styles.bgDesc}>{bg.description}</Text>
                    <Text style={styles.bgSkills}>Навыки: {bg.skillProficiencies.join(', ')}</Text>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        )}

        <TextInput
          label="Предыстория (текст)"
          value={characterBackground}
          onChangeText={setCharacterBackground}
          mode="outlined"
          multiline
          numberOfLines={4}
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
      </ScrollView>

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
  form: { padding: SPACING.md, flex: 1 },
  input: { marginBottom: SPACING.md, backgroundColor: COLORS.surface },
  label: { fontSize: FONT.size.sm, color: COLORS.text, marginBottom: SPACING.sm },
  bgRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.sm },
  bgBtn: { borderColor: COLORS.border },
  bgChip: { backgroundColor: COLORS.surfaceVariant },
  bgList: { marginBottom: SPACING.md },
  bgCard: { marginBottom: 6, backgroundColor: COLORS.surface },
  bgCardActive: { borderColor: COLORS.primary, borderWidth: 1 },
  bgName: { fontSize: FONT.size.md, fontWeight: '600', color: COLORS.primary },
  bgDesc: { fontSize: FONT.size.sm, color: COLORS.text, marginTop: 2 },
  bgSkills: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: 4 },
  alignmentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  alignmentBtn: { margin: 2 },
  alignmentBtnContent: { paddingVertical: 2, paddingHorizontal: 8 },
  footer: { flexDirection: 'row', padding: SPACING.md },
  backBtn: { flex: 1, marginRight: SPACING.sm },
  nextBtn: { flex: 1, marginLeft: SPACING.sm },
});
