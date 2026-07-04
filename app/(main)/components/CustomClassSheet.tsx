import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, FONT } from '../theme';
import { STAT_KEYS, STAT_LABELS, type StatKey, type CustomClass } from '../types';
import { SKILLS_LIST } from '../utils/gameData';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (cls: CustomClass) => void;
}

export function CustomClassSheet({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hitDie, setHitDie] = useState('8');
  const [primaryStat, setPrimaryStat] = useState<StatKey>('STR');
  const [savingThrows, setSavingThrows] = useState<StatKey[]>(['STR', 'CON']);
  const [skillChoices, setSkillChoices] = useState('2');
  const [skillPool, setSkillPool] = useState<string[]>([]);
  const [spellcaster, setSpellcaster] = useState<'none' | 'half' | 'full'>('none');
  const [error, setError] = useState<string | null>(null);

  const toggleSavingThrow = (k: StatKey) => {
    setSavingThrows((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  };

  const toggleSkill = (id: string) => {
    setSkillPool((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const handleCreate = () => {
    if (!name.trim()) { setError('Введите название класса'); return; }
    if (savingThrows.length === 0) { setError('Выберите минимум 1 спасбросок'); return; }
    const sc = Number(skillChoices);
    if (!sc || sc < 1 || sc > skillPool.length) { setError('Некорректное число навыков'); return; }
    const id = `custom-class-${Date.now()}`;
    const cls: CustomClass = {
      id,
      name: name.trim(),
      description: description.trim() || 'Пользовательский класс',
      hitDie: Number(hitDie) || 8,
      primaryStat,
      savingThrows,
      skillPool,
      skillChoices: sc,
      armorProficiencies: [],
      weaponProficiencies: [],
      featuresByLevel: { 1: ['Особенность 1 уровня (хоумбрю)'] },
      spellcaster,
      subClasses: [],
      isCustom: true,
    };
    onCreate(cls);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName(''); setDescription(''); setHitDie('8'); setPrimaryStat('STR');
    setSavingThrows(['STR', 'CON']); setSkillChoices('2'); setSkillPool([]);
    setSpellcaster('none'); setError(null);
  };

  const handleCancel = () => { resetForm(); onClose(); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={handleCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Хоумбрю: свой класс</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.label}>Название класса</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="напр. Кровавый маг" placeholderTextColor={COLORS.textSecondary} />

            <Text style={styles.label}>Описание</Text>
            <TextInput style={[styles.input, { minHeight: 60 }]} value={description} onChangeText={setDescription} multiline placeholder="Описание класса" placeholderTextColor={COLORS.textSecondary} />

            <Text style={styles.label}>Кость хитов (d6/d8/d10/d12)</Text>
            <TextInput style={styles.input} value={hitDie} onChangeText={setHitDie} keyboardType="numeric" />

            <Text style={styles.label}>Основная характеристика</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {STAT_KEYS.map((k) => (
                <TouchableOpacity key={k} style={[styles.chip, primaryStat === k && styles.chipActive]} onPress={() => setPrimaryStat(k)}>
                  <Text style={[styles.chipText, primaryStat === k && styles.chipTextActive]}>{STAT_LABELS[k]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Спасброски (выберите 2)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {STAT_KEYS.map((k) => (
                <TouchableOpacity key={k} style={[styles.chip, savingThrows.includes(k) && styles.chipActive]} onPress={() => toggleSavingThrow(k)}>
                  <Text style={[styles.chipText, savingThrows.includes(k) && styles.chipTextActive]}>{STAT_LABELS[k]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Заклинатель</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {(['none', 'half', 'full'] as const).map((s) => (
                <TouchableOpacity key={s} style={[styles.chip, spellcaster === s && styles.chipActive]} onPress={() => setSpellcaster(s)}>
                  <Text style={[styles.chipText, spellcaster === s && styles.chipTextActive]}>
                    {s === 'none' ? 'Нет' : s === 'half' ? 'Полу-' : 'Полный'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Навыков на выбор: {skillChoices}</Text>
            <TextInput style={styles.input} value={skillChoices} onChangeText={setSkillChoices} keyboardType="numeric" />

            <Text style={styles.label}>Пул навыков (выбрано {skillPool.length})</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {SKILLS_LIST.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.chip, skillPool.includes(s.id) && styles.chipActive]}
                  onPress={() => toggleSkill(s.id)}
                >
                  <Text style={[styles.chipText, skillPool.includes(s.id) && styles.chipTextActive]}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

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
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: COLORS.surfaceVariant, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: FONT.size.xs },
  chipTextActive: { color: '#fff' },
  error: { color: COLORS.danger, fontSize: FONT.size.sm, marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
});
