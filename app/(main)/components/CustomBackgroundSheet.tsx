import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, FONT } from '../theme';
import { type CustomBackground, type BackgroundItem, type Coins } from '../types';
import { SKILLS_LIST } from '../utils/gameData';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (bg: CustomBackground) => void;
}

type ItemDraft = BackgroundItem & { draftId: string };

export function CustomBackgroundSheet({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skillProficiencies, setSkillProficiencies] = useState<string[]>([]);
  const [feature, setFeature] = useState('');
  const [items, setItems] = useState<ItemDraft[]>([{ name: '', quantity: 1, draftId: 'i1' }]);
  const [coins, setCoins] = useState<Partial<Coins>>({ gp: 10 });
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (id: string) => {
    setSkillProficiencies((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const updateItem = (id: string, patch: Partial<ItemDraft>) => {
    setItems((cur) => cur.map((it) => (it.draftId === id ? { ...it, ...patch } : it)));
  };
  const addItem = () => setItems((cur) => [...cur, { name: '', quantity: 1, draftId: `i${Date.now()}` }]);
  const removeItem = (id: string) => setItems((cur) => cur.filter((it) => it.draftId !== id));

  const handleCreate = () => {
    if (!name.trim()) { setError('Введите название предыстории'); return; }
    const validItems = items.filter((it) => it.name.trim());
    const id = `custom-bg-${Date.now()}`;
    const bg: CustomBackground = {
      id,
      name: name.trim(),
      description: description.trim() || 'Пользовательская предыстория',
      skillProficiencies,
      items: validItems.map(({ name, quantity }) => ({ name, quantity })),
      coins,
      feature: feature.trim() || 'Хоумбрю-особенность',
      isCustom: true,
    };
    onCreate(bg);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName(''); setDescription(''); setSkillProficiencies([]); setFeature('');
    setItems([{ name: '', quantity: 1, draftId: 'i1' }]); setCoins({ gp: 10 }); setError(null);
  };

  const handleCancel = () => { resetForm(); onClose(); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={handleCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Хоумбрю: своя предыстория</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.label}>Название предыстории</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="напр. Корсар" placeholderTextColor={COLORS.textSecondary} />

            <Text style={styles.label}>Описание</Text>
            <TextInput style={[styles.input, { minHeight: 60 }]} value={description} onChangeText={setDescription} multiline />

            <Text style={styles.label}>Особенность предыстории</Text>
            <TextInput style={styles.input} value={feature} onChangeText={setFeature} placeholder="напр. Боевой товарищ" placeholderTextColor={COLORS.textSecondary} />

            <Text style={styles.label}>Владение навыками</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {SKILLS_LIST.map((s) => (
                <TouchableOpacity key={s.id} style={[styles.chip, skillProficiencies.includes(s.id) && styles.chipActive]} onPress={() => toggleSkill(s.id)}>
                  <Text style={[styles.chipText, skillProficiencies.includes(s.id) && styles.chipTextActive]}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Стартовые монеты</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['pp', 'gp', 'sp', 'cp'] as (keyof Coins)[]).map((k) => (
                <View key={k} style={styles.coinCell}>
                  <Text style={styles.coinLabel}>{k}</Text>
                  <TextInput
                    style={styles.coinInput}
                    value={String(coins[k] ?? 0)}
                    onChangeText={(v) => setCoins((c) => ({ ...c, [k]: Math.max(0, Number(v) || 0) }))}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </View>

            <Text style={styles.label}>Стартовые предметы</Text>
            {items.map((it) => (
              <View key={it.draftId} style={styles.itemRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={it.name}
                  onChangeText={(v) => updateItem(it.draftId, { name: v })}
                  placeholder="Название предмета"
                  placeholderTextColor={COLORS.textSecondary}
                />
                <TextInput
                  style={[styles.input, { width: 60, marginLeft: 8, textAlign: 'center' }]}
                  value={String(it.quantity)}
                  onChangeText={(v) => updateItem(it.draftId, { quantity: Math.max(1, Number(v) || 1) })}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => removeItem(it.draftId)} style={styles.removeItemBtn}>
                  <Text style={styles.removeItemText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Button mode="outlined" onPress={addItem} style={{ marginTop: 8 }}>+ Добавить предмет</Button>

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
  coinCell: { width: 70, backgroundColor: COLORS.surfaceVariant, borderRadius: 6, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  coinLabel: { color: COLORS.textSecondary, fontSize: FONT.size.xs, fontWeight: 'bold' },
  coinInput: { color: COLORS.text, fontSize: FONT.size.md, fontWeight: 'bold', textAlign: 'center', minWidth: 40 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  removeItemBtn: { width: 32, height: 32, marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  removeItemText: { color: COLORS.danger, fontSize: 16, fontWeight: 'bold' },
  error: { color: COLORS.danger, fontSize: FONT.size.sm, marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
});
