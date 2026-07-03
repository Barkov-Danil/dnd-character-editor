import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { useCharacterStore } from '../../store/characterStore';
import { StatBlock } from '../../components';
import { formatModifier } from '../../utils/rulesEngine';

export default function CharacterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const savedCharacters = useCharacterStore((s) => s.savedCharacters);
  const libraryCharacters = useCharacterStore((s) => s.libraryCharacters);
  const all = [...savedCharacters, ...libraryCharacters];
  const character = all.find((c) => c.id === id);

  if (!character) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Персонаж не найден</Text>
        <Button mode="contained" onPress={() => router.replace('/')} style={styles.backBtn}>
          На главную
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.name}>{character.name}</Text>
          <Text style={styles.subtitle}>
            {character.race} / {character.class} · Ур. {character.level}
          </Text>
          <Text style={styles.alignment}>{character.alignment}</Text>
          <Text style={styles.background}>{character.background}</Text>
        </Card.Content>
      </Card>

      <Text style={styles.sectionLabel}>Характеристики</Text>
      <StatBlock stats={character.stats} />

      <Text style={styles.sectionLabel}>Боевые показатели</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>HP</Text>
          <Text style={[styles.statValue, { color: COLORS.danger }]}>
            {character.hitPoints}/{character.maxHitPoints}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>AC</Text>
          <Text style={[styles.statValue, { color: COLORS.accent }]}>{character.armorClass}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Скор.</Text>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{character.speed}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Бонус</Text>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>+{character.proficiencyBonus}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back}>← Назад</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  notFoundText: { color: COLORS.text, fontSize: FONT.size.lg, marginBottom: SPACING.md },
  backBtn: { marginTop: SPACING.md },
  headerCard: { margin: SPACING.md, backgroundColor: COLORS.surface },
  cardContent: { padding: SPACING.md },
  name: { color: COLORS.primary, fontSize: FONT.size.xxl, fontWeight: 'bold' },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT.size.md, marginTop: SPACING.xs },
  alignment: { color: COLORS.text, fontSize: FONT.size.sm, marginTop: SPACING.xs },
  background: { color: COLORS.textSecondary, fontSize: FONT.size.sm, marginTop: SPACING.xs },
  sectionLabel: {
    color: COLORS.text, fontSize: FONT.size.md, fontWeight: '600',
    marginTop: SPACING.md, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm,
  },
  statsGrid: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: COLORS.surface, borderRadius: 8,
    padding: SPACING.md, marginHorizontal: SPACING.md,
  },
  statBox: { alignItems: 'center' },
  statLabel: { color: COLORS.textSecondary, fontSize: FONT.size.xs },
  statValue: { fontSize: FONT.size.lg, fontWeight: 'bold' },
  footer: { padding: SPACING.md },
});
