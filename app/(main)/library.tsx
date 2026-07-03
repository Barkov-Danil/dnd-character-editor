import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useCharacterStore } from './store/characterStore';
import { COLORS, FONT, SPACING } from './theme';
import { StatBlock } from './components';
import type { Character } from './types';

export default function LibraryScreen() {
  const libraryCharacters = useCharacterStore((s) => s.libraryCharacters);
  const savedCharacters = useCharacterStore((s) => s.savedCharacters);
  const addSavedCharacter = useCharacterStore((s) => s.addSavedCharacter);

  const isImported = (char: Character) =>
    savedCharacters.some((s) => s.id === char.id || s.name === char.name);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Библиотека персонажей</Text>
        <Text style={styles.subtitle}>Готовые персонажи для быстрого старта</Text>

        {libraryCharacters.map((char) => (
          <Card key={char.id} style={styles.card} onPress={() => {}}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.charName}>{char.name}</Text>
                <Text style={styles.charLevel}>Ур. {char.level}</Text>
              </View>
              <Text style={styles.charRaceClass}>
                {char.race} / {char.class}
                {char.subClass ? ` — ${char.subClass}` : ''}
              </Text>
              <View style={styles.statGap} />
              <StatBlock stats={char.stats} />
              <Text style={styles.sheet}>{char.characterSheet}</Text>
              <View style={styles.sheetGap} />
              {isImported(char) ? (
                <Text style={styles.imported}>Уже импортирован</Text>
              ) : (
                <Button mode="contained" onPress={() => addSavedCharacter(char)}>
                  Импортировать
                </Button>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  title: { color: COLORS.text, fontSize: FONT.size.xxl, fontWeight: 'bold' },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT.size.md, marginBottom: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: 8, marginBottom: SPACING.md },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  charName: { color: COLORS.primary, fontSize: FONT.size.lg, fontWeight: 'bold' },
  charLevel: { color: COLORS.textSecondary, fontSize: FONT.size.sm },
  charRaceClass: { color: COLORS.textSecondary, fontSize: FONT.size.md },
  statGap: { marginVertical: SPACING.sm },
  sheet: { color: COLORS.text, fontSize: FONT.size.xs, marginTop: SPACING.sm, fontStyle: 'italic' },
  sheetGap: { marginVertical: SPACING.sm },
  imported: { color: COLORS.success, fontWeight: '600' },
});
