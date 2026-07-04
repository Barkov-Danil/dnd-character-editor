import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Button, Card, TextInput, SegmentedButtons, IconButton, Divider } from 'react-native-paper';

const webAlert = (msg: string) => {
  const g = globalThis as unknown as { alert?: (m: string) => void };
  if (g.alert) g.alert(msg);
};
const webConfirm = (msg: string): boolean => {
  const g = globalThis as unknown as { confirm?: (m: string) => boolean };
  return g.confirm ? g.confirm(msg) : false;
};
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from './theme';
import { useCharacterStore } from './store/characterStore';
import { useDiceFormulasStore } from './store/diceFormulasStore';
import {
  rollFormula,
  highlightFormula,
  DICE_CATEGORIES,
  LEGEND_EXAMPLES,
  LEGEND_KEYWORDS,
  type RollResult,
  type DiceFormulaEntry,
} from './utils/diceParser';
import { FormulaHighlight } from './components';

export default function CalculatorScreen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<RollResult | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('');
  const [saveCategory, setSaveCategory] = useState<string>('attack');
  const [saveFormula, setSaveFormula] = useState('');

  const savedCharacters = useCharacterStore((s) => s.savedCharacters);
  const libraryCharacters = useCharacterStore((s) => s.libraryCharacters);
  const currentCharacterId = useCharacterStore((s) => s.currentCharacterId);
  const setCurrentCharacterId = useCharacterStore((s) => s.setCurrentCharacterId);

  const formulas = useDiceFormulasStore((s) => s.formulas);
  const addFormula = useDiceFormulasStore((s) => s.addFormula);
  const updateFormula = useDiceFormulasStore((s) => s.updateFormula);
  const deleteFormula = useDiceFormulasStore((s) => s.deleteFormula);

  const allCharacters = [...savedCharacters, ...libraryCharacters];
  const currentCharacter = allCharacters.find((c) => c.id === currentCharacterId) ?? null;

  const handleRoll = () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    try {
      const rolled = rollFormula(input, currentCharacter);
      setResult(rolled);
    } catch {
      setResult(null);
    }
  };

  const handleValidateLive = (text: string) => {
    setInput(text);
  };

  const openSaveModal = (entry?: DiceFormulaEntry) => {
    if (entry) {
      setEditId(entry.id);
      setSaveName(entry.name);
      setSaveCategory(entry.category);
      setSaveFormula(entry.formula);
    } else {
      setEditId(null);
      setSaveName('');
      setSaveCategory('attack');
      setSaveFormula(input);
    }
    setSaveModalVisible(true);
  };

  const confirmSave = () => {
    if (!saveName.trim()) {
      webAlert('Введите название формулы');
      return;
    }
    const pieces = highlightFormula(saveFormula);
    const allValid = pieces.length > 0 && pieces.every((p) => p.valid);
    if (!allValid) {
      webAlert('Формула содержит некорректные части');
      return;
    }
    const category = (DICE_CATEGORIES.find((c) => c.value === saveCategory)?.value ?? 'other') as DiceFormulaEntry['category'];
    if (editId) {
      updateFormula(editId, { name: saveName.trim(), formula: saveFormula, category });
    } else {
      addFormula({ name: saveName.trim(), formula: saveFormula, category });
    }
    setSaveModalVisible(false);
    setSaveName('');
    setSaveFormula('');
    setEditId(null);
  };

  const confirmDelete = (id: string, name: string) => {
    if (webConfirm(`Удалить формулу «${name}»?`)) deleteFormula(id);
  };

  const renderBreakdown = () => {
    if (!result) return null;
    return (
      <View style={styles.breakdown}>
        <Text style={styles.breakdownTotal}>Итого: {result.total}</Text>
        <View style={styles.breakdownParts}>
          {result.parts.map((part, i) => {
            const sign = i > 0 && result.parts[i - 1].kind !== 'literal' ? '' : '';
            return (
              <View key={i} style={styles.partRow}>
                <Text style={styles.partLabel}>
                  {part.kind === 'dice'
                    ? `${part.notation} = [${part.rolls.join(' + ')}] = ${part.sum}`
                    : part.kind === 'modifier'
                      ? `${part.source} (${part.value >= 0 ? `+${part.value}` : part.value})`
                      : `число ${part.value >= 0 ? `+${part.value}` : part.value}`}{sign}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Калькулятор бросков</Text>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Текущий персонаж</Text>
          {allCharacters.length === 0 ? (
            <Text style={styles.muted}>Нет сохранённых персонажей. Характеристики будут считаться как у среднего (10).</Text>
          ) : (
            <View style={styles.characterPicker}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.charScroll}>
                {allCharacters.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setCurrentCharacterId(c.id)}
                    style={[
                      styles.charChip,
                      c.id === currentCharacterId && styles.charChipSelected,
                    ]}
                  >
                    <Text style={styles.charChipText}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {currentCharacter ? (
                <Text style={styles.characterSummary}>
                  {currentCharacter.name} · {currentCharacter.race} {currentCharacter.class} · Ур. {currentCharacter.level}
                </Text>
              ) : (
                <Text style={styles.muted}>Персонаж не выбран</Text>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Формула</Text>
          <View style={styles.formulaField}>
            {input ? <FormulaHighlight input={input} style={styles.formulaOverlay} /> : null}
            <RNTextInput
              value={input}
              onChangeText={handleValidateLive}
              placeholder="2d8 + сил + бм"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.formulaInput}
              underlineColorAndroid="transparent"
              selectionColor={COLORS.primary}
              textAlignVertical="center"
            />
          </View>

          <View style={styles.actionRow}>
            <Button mode="contained" onPress={handleRoll} disabled={!input.trim()}>
              Бросить
            </Button>
            <Button
              mode="outlined"
              onPress={() => openSaveModal()}
              disabled={!input.trim()}
            >
              Сохранить
            </Button>
            <Button mode="text" onPress={() => setLegendOpen((v) => !v)}>
              {legendOpen ? 'Скрыть справку' : 'Справка'}
            </Button>
          </View>
        </Card.Content>
      </Card>

      {legendOpen && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionLabel}>Обозначения</Text>
            {LEGEND_KEYWORDS.map((k) => (
              <Text key={k.token} style={styles.legendItem}>
                <Text style={styles.legendToken}>{k.token}</Text> — {k.description}
              </Text>
            ))}
            <Text style={styles.sectionLabelSmall}>Примеры</Text>
            {LEGEND_EXAMPLES.map((ex) => (
              <TouchableOpacity key={ex} onPress={() => { setInput(ex); handleValidateLive(ex); }}>
                <Text style={styles.exampleItem}>{ex}</Text>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {result && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionLabel}>Результат</Text>
            {renderBreakdown()}
            <Text style={styles.formulaEcho}>Формула: {result.formula}</Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Сохранённые формулы ({formulas.length})</Text>
          {formulas.length === 0 ? (
            <Text style={styles.muted}>Нет сохранённых формул. Бросьте и сохраните, чтобы потом быстро вызывать.</Text>
          ) : (
            <View>
              {formulas.map((entry) => {
                const catLabel = DICE_CATEGORIES.find((c) => c.value === entry.category)?.label ?? 'Другое';
                return (
                  <View key={entry.id} style={styles.savedRow}>
                    <TouchableOpacity
                      style={styles.savedRowTouch}
                      onPress={() => { setInput(entry.formula); handleValidateLive(entry.formula); }}
                    >
                      <Text style={styles.savedName}>{entry.name}</Text>
                      <Text style={styles.savedMeta}>{catLabel} · {entry.formula}</Text>
                    </TouchableOpacity>
                    <View style={styles.savedActions}>
                      <IconButton icon="pencil" size={20} iconColor={COLORS.textSecondary} onPress={() => openSaveModal(entry)} />
                      <IconButton icon="delete" size={20} iconColor={COLORS.danger} onPress={() => confirmDelete(entry.id, entry.name)} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back}>← Назад</Button>
      </View>

      <Modal visible={saveModalVisible} transparent animationType="fade" onRequestClose={() => setSaveModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSaveModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editId ? 'Редактировать формулу' : 'Сохранить формулу'}</Text>
            <TextInput
              label="Название"
              value={saveName}
              onChangeText={setSaveName}
              mode="outlined"
              style={styles.modalInput}
              placeholder="Атака"
            />
            <Text style={styles.modalLabel}>Категория</Text>
            <SegmentedButtons
              value={saveCategory}
              onValueChange={setSaveCategory}
              buttons={DICE_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              style={styles.modalButtons}
            />
            <TextInput
              label="Формула"
              value={saveFormula}
              onChangeText={setSaveFormula}
              mode="outlined"
              style={styles.modalInput}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="d20 + сил + бм"
            />
            <Divider style={styles.modalDivider} />
            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={() => setSaveModalVisible(false)}>Отмена</Button>
              <Button mode="contained" onPress={confirmSave}>Сохранить</Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: FONT.size.xxl, fontWeight: 'bold', color: COLORS.primary, padding: SPACING.md },
  section: { marginHorizontal: SPACING.md, marginVertical: SPACING.xs, backgroundColor: COLORS.surface },
  sectionLabel: { fontSize: FONT.size.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  sectionLabelSmall: { fontSize: FONT.size.sm, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.xs },
  characterPicker: { flexDirection: 'column' },
  charScroll: { flexGrow: 0 },
  charChip: {
    paddingHorizontal: SPACING.sm, paddingVertical: 6,
    backgroundColor: COLORS.surfaceVariant, borderRadius: 16,
    marginRight: SPACING.xs,
  },
  charChipSelected: { backgroundColor: COLORS.primary },
  charChipText: { color: COLORS.text, fontSize: FONT.size.sm },
  characterSummary: { color: COLORS.text, fontSize: FONT.size.sm, marginTop: SPACING.sm },
  muted: { color: COLORS.textSecondary, fontSize: FONT.size.sm, fontStyle: 'italic' },
  formulaField: {
    position: 'relative',
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 56,
    justifyContent: 'center',
  },
  formulaOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  formulaInput: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: FONT.size.lg,
    fontWeight: '700',
    color: 'transparent',
  },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, flexWrap: 'wrap' },
  legendItem: { fontSize: FONT.size.sm, color: COLORS.text, paddingVertical: 3 },
  legendToken: { fontWeight: 'bold', color: COLORS.accent },
  exampleItem: { fontSize: FONT.size.sm, color: COLORS.primary, paddingVertical: 4 },
  breakdown: { marginTop: SPACING.xs },
  breakdownTotal: { fontSize: FONT.size.xxl, fontWeight: 'bold', color: COLORS.accent },
  breakdownParts: { marginTop: SPACING.xs },
  partRow: { paddingVertical: 2 },
  partLabel: { fontSize: FONT.size.sm, color: COLORS.textSecondary },
  formulaEcho: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: SPACING.sm, fontStyle: 'italic' },
  savedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  savedRowTouch: { flex: 1 },
  savedName: { fontSize: FONT.size.md, fontWeight: '600', color: COLORS.primary },
  savedMeta: { fontSize: FONT.size.xs, color: COLORS.textSecondary, marginTop: 2 },
  savedActions: { flexDirection: 'row' },
  footer: { padding: SPACING.md },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, marginHorizontal: SPACING.lg, maxWidth: 380, width: '100%' },
  modalTitle: { fontSize: FONT.size.lg, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md },
  modalLabel: { fontSize: FONT.size.sm, color: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.xs },
  modalInput: { backgroundColor: COLORS.surface, marginVertical: SPACING.xs },
  modalButtons: { marginTop: SPACING.xs },
  modalDivider: { backgroundColor: COLORS.border, marginVertical: SPACING.md },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around' },
});
