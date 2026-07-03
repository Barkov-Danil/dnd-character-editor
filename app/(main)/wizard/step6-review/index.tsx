import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { WizardStepper, StatBlock } from '../../components';
import { useCharacterStore } from '../../store/characterStore';
import { SKILLS_LIST, WIZARD_STEPS } from '../../utils/gameData';
import { validateCharacter, calculateHP, calculateAC, proficiencyBonusFor } from '../../utils/rulesEngine';
import { STAT_KEYS } from '../../types';
import type { CharacterStats, Character } from '../../types';

const FALLBACK_STATS: CharacterStats = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

export default function Step6Review() {
  const currentStep = useCharacterStore((s) => s.currentStep);
  const selectedRaceObject = useCharacterStore((s) => s.selectedRaceObject);
  const selectedClassObject = useCharacterStore((s) => s.selectedClassObject);
  const stats = useCharacterStore((s) => s.stats);
  const selectedSkills = useCharacterStore((s) => s.selectedSkills);
  const characterName = useCharacterStore((s) => s.characterName);
  const characterBackground = useCharacterStore((s) => s.characterBackground);
  const characterAlignment = useCharacterStore((s) => s.characterAlignment);
  const addCharacter = useCharacterStore((s) => s.addCharacter);
  const resetWizard = useCharacterStore((s) => s.resetWizard);

  const finalStats = stats ?? FALLBACK_STATS;
  const conBonus = Math.floor((finalStats.CON - 10) / 2);
  const dexBonus = Math.floor((finalStats.DEX - 10) / 2);
  const hitDie = selectedClassObject?.hitDie ?? 8;
  const maxHP = calculateHP(hitDie, 1, conBonus);
  const ac = calculateAC(dexBonus);

  const skillsMap = Object.fromEntries(SKILLS_LIST.map((s) => [s.id, s]));
  const proficient = selectedSkills.filter((s) => s.proficient);

  const previewChar: Character = {
    id: 'preview',
    name: characterName || 'Безымянный',
    race: selectedRaceObject?.id ?? 'human',
    class: selectedClassObject?.id ?? 'fighter',
    level: 1,
    background: characterBackground || 'Неизвестно',
    alignment: characterAlignment || 'Нейтральный',
    stats: finalStats,
    baseStats: finalStats,
    racialBonus: selectedRaceObject?.abilityBonuses ?? {},
    skills: selectedSkills,
    savingThrows: {},
    hitPoints: maxHP,
    maxHitPoints: maxHP,
    armorClass: ac,
    proficiencyBonus: proficiencyBonusFor(1),
    speed: selectedRaceObject?.speed ?? 30,
    languages: selectedRaceObject?.languages ?? ['Общий'],
    features: [],
    inventory: [],
    experiencePoints: 0,
    characterSheet: '',
    isLibrary: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const errors = validateCharacter(
    previewChar,
    selectedClassObject?.skillPool ?? [],
    selectedClassObject?.skillChoices ?? 0,
  );

  const handleSave = () => {
    const newChar = { ...previewChar, id: `char-${Date.now()}` };
    addCharacter(newChar);
    resetWizard();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Обзор персонажа</Text>
      </View>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      {errors.length > 0 && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorTitle}>Проблемы:</Text>
            {errors.map((err) => (
              <Text key={err} style={styles.errorText}>• {err}</Text>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryName}>{previewChar.name}</Text>
          <Text style={styles.summarySubtitle}>
            {selectedRaceObject?.name ?? '—'} {selectedClassObject?.name ?? '—'} · Ур. 1
          </Text>
          <Text style={styles.summaryAlignment}>{previewChar.alignment}</Text>
          <Divider style={styles.divider} />
          <StatBlock stats={finalStats} size="small" />
          <Divider style={styles.divider} />
          <Text style={styles.sectionLabel}>Навыки ({proficient.length}):</Text>
          {proficient.map((skill) => (
            <Text key={skill.skillId} style={styles.skillItem}>
              {skillsMap[skill.skillId]?.name ?? skill.skillId}
            </Text>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back} style={styles.backBtn}>← Назад</Button>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={errors.length > 0}
          style={styles.saveBtn}
        >
          Сохранить
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  title: { fontSize: FONT.size.xl, fontWeight: 'bold', color: COLORS.primary },
  errorCard: {
    marginHorizontal: SPACING.md, marginVertical: SPACING.sm,
    borderRadius: 8, borderLeftWidth: 4, borderLeftColor: COLORS.danger,
    backgroundColor: COLORS.surface,
  },
  errorTitle: { fontSize: FONT.size.md, fontWeight: '600', color: COLORS.danger },
  errorText: { fontSize: FONT.size.sm, color: COLORS.danger, marginVertical: 2 },
  summaryCard: {
    marginHorizontal: SPACING.md, borderRadius: 12,
    marginVertical: SPACING.sm, backgroundColor: COLORS.surface,
  },
  summaryName: { fontSize: FONT.size.xxl, fontWeight: 'bold', color: COLORS.primary },
  summarySubtitle: { fontSize: FONT.size.md, color: COLORS.textSecondary, marginTop: 4 },
  summaryAlignment: { fontSize: FONT.size.sm, color: COLORS.text, marginTop: 4 },
  divider: { backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  sectionLabel: { fontSize: FONT.size.md, fontWeight: '600', color: COLORS.text, marginTop: SPACING.sm },
  skillItem: { fontSize: FONT.size.sm, color: COLORS.text, paddingVertical: 2 },
  footer: { flexDirection: 'row', padding: SPACING.md },
  backBtn: { flex: 1, marginRight: SPACING.sm },
  saveBtn: { flex: 1, marginLeft: SPACING.sm },
});
