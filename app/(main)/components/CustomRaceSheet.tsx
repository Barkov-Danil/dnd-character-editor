import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, FONT } from '../theme';
import { STAT_KEYS, STAT_LABELS, type CharacterStats, type CustomRace } from '../types';
import { abilityBonusSum, maxRaceBonusSum } from '../utils/rulesEngine';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (race: CustomRace) => void;
}

export function CustomRaceSheet({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bonuses, setBonuses] = useState<Partial<CharacterStats>>({});
  const [speed, setSpeed] = useState('30');
  const [size, setSize] = useState<'Small' | 'Medium'>('Medium');
  const [languages, setLanguages] = useState('Общий');
  const [traits, setTraits] = useState('');
  const [error, setError] = useState<string | null>(null);

  const maxSum = maxRaceBonusSum();
  const currentSum = abilityBonusSum(bonuses);

  const setBonus = (key: typeof STAT_KEYS[number], value: string) => {
    const n = value === '' ? 0 : Math.max(0, Math.min(4, Number(value)));
    setBonuses((b) => ({ ...b, [key]: n }));
  };

  const handleCreate = () => {
    if (!name.trim()) { setError('Введите название расы'); return; }
    if (currentSum > maxSum) { setError(`Сумма бонусов (${currentSum}) превышает лимит (${maxSum})`); return; }
    const id = `custom-race-${Date.now()}`;
    const race: CustomRace = {
      id,
      name: name.trim(),
      description: description.trim() || 'Пользовательская раса',
      abilityBonuses: bonuses,
      speed: Number(speed) || 30,
      size,
      languages: languages.split(',').map((s) => s.trim()).filter(Boolean),
      traits: traits.split(',').map((s) => s.trim()).filter(Boolean),
      isCustom: true,
    };
    onCreate(race);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName(''); setDescription(''); setBonuses({}); setSpeed('30');
    setSize('Medium'); setLanguages('Общий'); setTraits(''); setError(null);
  };

  const handleCancel = () => { resetForm(); onClose(); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={handleCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Хоумбрю: своя раса</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.label}>Название расы</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="напр. Драконорождённый-полукровка" placeholderTextColor={COLORS.textSecondary} />

            <Text style={styles.label}>Описание</Text>
            <TextInput style={[styles.input, { minHeight: 60 }]} value={description} onChangeText={setDescription} multiline placeholder="Краткое описание" placeholderTextColor={COLORS.textSecondary} />

            <Text style={styles.label}>Бонусы характеристик (сумма ≤ {maxSum}, сейчас {currentSum})</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {STAT_KEYS.map((k) => (
                <View key={k} style={styles.bonusCell}>
                  <Text style={styles.bonusLabel}>{STAT_LABELS[k]}</Text>
                  <TextInput
                    style={styles.bonusInput}
                    value={String(bonuses[k] ?? 0)}
                    onChangeText={(v) => setBonus(k, v)}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </View>
            {currentSum > maxSum && <Text style={styles.warn}>Превышен лимит бонусов!</Text>}

            <Text style={styles.label}>Скорость (фт.)</Text>
            <TextInput style={styles.input} value={speed} onChangeText={setSpeed} keyboardType="numeric" />

            <Text style={styles.label}>Размер</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['Small', 'Medium'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, size === s && styles.chipActive]}
                  onPress={() => setSize(s)}
                >
                  <Text style={[styles.chipText, size === s && styles.chipTextActive]}>
                    {s === 'Small' ? 'Малый' : 'Средний'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Языки (через запятую)</Text>
            <TextInput style={styles.input} value={languages} onChangeText={setLanguages} />

            <Text style={styles.label}>Особенности (через запятую)</Text>
            <TextInput style={[styles.input, { minHeight: 50 }]} value={traits} onChangeText={setTraits} multiline />

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.actions}>
              <Button mode="outlined" onPress={handleCancel}>Отмена</Button>
              <Button mode="contained" onPress={handleCreate}>Создать</Button>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  sheet: { backgroundColor: COLORS.surface, borderRadius: 12, width: 480, maxWidth: '94%', maxHeight: '88%', borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: FONT.size.lg, fontWeight: 'bold', color: COLORS.accent, flex: 1 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  body: { paddingHorizontal: 16, paddingVertical: 12 },
  label: { color: COLORS.primary, fontSize: FONT.size.xs, fontWeight: 'bold', marginTop: 12, marginBottom: 4, textTransform: 'uppercase' },
  input: { backgroundColor: COLORS.surfaceVariant, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, color: COLORS.text, fontSize: FONT.size.sm, borderWidth: 1, borderColor: COLORS.border },
  bonusCell: { width: 100, backgroundColor: COLORS.surfaceVariant, borderRadius: 6, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  bonusLabel: { color: COLORS.textSecondary, fontSize: FONT.size.xs },
  bonusInput: { color: COLORS.text, fontSize: FONT.size.md, fontWeight: 'bold', textAlign: 'center', minWidth: 40 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: COLORS.surfaceVariant, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: FONT.size.sm },
  chipTextActive: { color: '#fff' },
  warn: { color: COLORS.warning, fontSize: FONT.size.xs, marginTop: 6, fontWeight: '600' },
  error: { color: COLORS.danger, fontSize: FONT.size.sm, marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
});
