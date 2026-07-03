import { router } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, FAB } from 'react-native-paper';
import { useCharacterStore } from './store/characterStore';
import { COLORS, FONT, SPACING } from './theme';
import { LIBRARY_CHARACTERS } from './utils/gameData';

export default function HomeScreen() {
  const savedCharacters = useCharacterStore((s) => s.savedCharacters);
  const setLibraryCharacters = useCharacterStore((s) => s.setLibraryCharacters);

  const handleCreateNew = () => router.push('/wizard/step1-race');
  const handleOpenLibrary = () => {
    setLibraryCharacters(LIBRARY_CHARACTERS);
    router.push('/library');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Мои персонажи</Text>

      {savedCharacters.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Персонажей пока нет</Text>
          <Text style={styles.emptyText}>
            Создайте первого персонажа или загрузите готового из библиотеки
          </Text>
          <Button mode="contained" onPress={handleCreateNew} style={styles.emptyBtn}>
            Создать персонажа
          </Button>
          <Button mode="outlined" onPress={handleOpenLibrary} style={styles.emptyBtn}>
            Библиотека персонажей
          </Button>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {savedCharacters.map((char) => (
            <Card
              key={char.id}
              style={styles.card}
              onPress={() => router.push(`/character/${char.id}`)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.charName}>{char.name}</Text>
                  <Text style={styles.charLevel}>Ур. {char.level}</Text>
                </View>
                <Text style={styles.charRaceClass}>{char.race} / {char.class}</Text>
                <View style={styles.divider} />
                <View style={styles.quickStats}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>HP</Text>
                    <Text style={styles.statValue}>{char.hitPoints}/{char.maxHitPoints}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>AC</Text>
                    <Text style={styles.statValue}>{char.armorClass}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Скор.</Text>
                    <Text style={styles.statValue}>{char.speed}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Бонус</Text>
                    <Text style={styles.statValue}>+{char.proficiencyBonus}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      <FAB icon="plus" style={styles.fab} onPress={handleCreateNew} label="Создать" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, padding: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },
  emptyBtn: { marginVertical: 4, minWidth: 200 },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  card: { backgroundColor: COLORS.surface, borderRadius: 8, marginVertical: SPACING.sm },
  cardContent: { padding: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  charName: { fontSize: 20, fontWeight: 'bold', color: COLORS.accent },
  charLevel: { fontSize: 14, color: COLORS.textSecondary },
  charRaceClass: { color: COLORS.textSecondary, fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  quickStats: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.accent },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
});
