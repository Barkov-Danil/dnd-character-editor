import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { useCharacterStore } from '../../store/characterStore';
import { StatBlock, DetailLabel, DetailValue } from '../../components';
import { STAT_LABELS, type StatKey, type Coins, type SkillInfo } from '../../types';
import { CHARACTER_CLASSES, SKILLS_LIST } from '../../utils/gameData';
import { calculateModifier } from '../../utils/rulesEngine';
import { getFeatureInfo, type FeatureInfo } from '../../utils/featuresData';

type CoinKey = keyof Coins;

const COIN_META: Record<CoinKey, { label: string; short: string; color: string }> = {
  pp: { label: 'Платина', short: 'pp', color: '#cbd5e1' },
  gp: { label: 'Золото', short: 'gp', color: COLORS.accent },
  sp: { label: 'Серебро', short: 'sp', color: '#9ca3af' },
  cp: { label: 'Медь', short: 'cp', color: '#b45309' },
};

export default function CharacterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const savedCharacters = useCharacterStore((s) => s.savedCharacters);
  const libraryCharacters = useCharacterStore((s) => s.libraryCharacters);
  const setCurrentCharacterId = useCharacterStore((s) => s.setCurrentCharacterId);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);
  const all = [...savedCharacters, ...libraryCharacters];
  const character = all.find((c) => c.id === id);

  const [selectedSkill, setSelectedSkill] = useState<SkillInfo | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<{ level: number; name: string } | null>(null);
  const [newFeatures, setNewFeatures] = useState<{ level: number; name: string }[]>([]);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');

  useEffect(() => {
    if (character) {
      setCurrentCharacterId(character.id);
      const cls = character.customClass ?? CHARACTER_CLASSES[character.class];
      if (cls) {
        const seen = character.seenLevel ?? 0;
        const cur = character.level;
        if (cur > seen) {
          const gained: { level: number; name: string }[] = [];
          for (const lvlStr of Object.keys(cls.featuresByLevel).map(Number).sort((a, b) => a - b)) {
            if (lvlStr > seen && lvlStr <= cur) {
              for (const f of cls.featuresByLevel[lvlStr]) gained.push({ level: lvlStr, name: f });
            }
          }
          if (gained.length > 0) setNewFeatures(gained);
        }
      }
    }
  }, [character?.id]);

  const classInfo = useMemo(
    () => (character ? (character.customClass ?? CHARACTER_CLASSES[character.class]) : undefined),
    [character?.class, character?.customClass],
  );

  const raceInfo = character?.customRace;

  if (!character) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Персонаж не найден</Text>
        <Button mode="contained" onPress={() => router.replace('/')} style={styles.notFoundBackBtn}>
          На главную
        </Button>
      </View>
    );
  }

  const featuresUpToLevel = useMemo(() => {
    const feats: { level: number; name: string }[] = [];
    if (!classInfo) return feats;
    for (const lvl of Object.keys(classInfo.featuresByLevel).map(Number).sort((a, b) => a - b)) {
      if (lvl <= character.level) {
        for (const f of classInfo.featuresByLevel[lvl]) feats.push({ level: lvl, name: f });
      }
    }
    return feats;
  }, [classInfo, character.level]);

  const dismissNewFeatures = () => {
    if (character) updateCharacter(character.id, { seenLevel: character.level });
    setNewFeatures([]);
  };

  const adjustCoinLive = (key: CoinKey, delta: number) => {
    if (!character) return;
    const next = Math.max(0, character.coins[key] + delta);
    updateCharacter(character.id, { coins: { ...character.coins, [key]: next } });
  };

  const adjustHp = (delta: number) => {
    if (!character) return;
    const next = Math.max(0, character.hitPoints + delta);
    updateCharacter(character.id, { hitPoints: next });
  };

  const adjustItemQty = (itemId: string, delta: number) => {
    if (!character) return;
    const inventory = character.inventory.map((it) =>
      it.id === itemId
        ? { ...it, quantity: Math.max(0, it.quantity + delta) }
        : it
    );
    updateCharacter(character.id, { inventory });
  };

  const removeItem = (itemId: string) => {
    if (!character) return;
    const inventory = character.inventory.filter((it) => it.id !== itemId);
    updateCharacter(character.id, { inventory });
  };

  const addItem = () => {
    if (!character || !newItemName.trim()) return;
    const id = `item-${Date.now()}`;
    const quantity = Math.max(1, Number(newItemQty) || 1);
    const inventory = [
      ...character.inventory,
      { id, name: newItemName.trim(), quantity, equipped: false },
    ];
    updateCharacter(character.id, { inventory });
    setNewItemName('');
    setNewItemQty('1');
    setItemDialogOpen(false);
  };

  const skillBonus = (skill: { stat: StatKey; id: string }): number => {
    const base = calculateModifier(character.stats[skill.stat]);
    const prof = character.skills.find((s) => s.skillId === skill.id)?.proficient;
    const expertise = character.skills.find((s) => s.skillId === skill.id)?.expertise;
    const profBonus = prof ? character.proficiencyBonus * (expertise ? 2 : 1) : 0;
    return base + profBonus;
  };

  const fmtMod = (n: number) => (n >= 0 ? `+${n}` : String(n));

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.name}>{character.name}</Text>
          <Text style={styles.subtitle}>
            {(raceInfo?.name ?? character.race)} / {(classInfo?.name ?? character.class)} · Ур. {character.level}
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
          <View style={styles.hpStepperRow}>
            <TouchableOpacity style={styles.coinStepBtn} onPress={() => adjustHp(-1)}>
              <Text style={styles.coinStepText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.coinStepBtn} onPress={() => adjustHp(1)}>
              <Text style={styles.coinStepText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>КД</Text>
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

      <Text style={styles.sectionLabel}>Монеты</Text>
      <View style={styles.coinsGrid}>
        {(['pp', 'gp', 'sp', 'cp'] as CoinKey[]).map((key) => {
          const meta = COIN_META[key];
          return (
            <View key={key} style={styles.coinCard}>
              <Text style={[styles.coinShort, { color: meta.color }]}>{meta.short}</Text>
              <Text style={styles.coinAmount}>{character.coins[key]}</Text>
              <View style={styles.coinStepperRow}>
                <TouchableOpacity style={styles.coinStepBtn} onPress={() => adjustCoinLive(key, -1)}>
                  <Text style={styles.coinStepText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.coinStepBtn} onPress={() => adjustCoinLive(key, 1)}>
                  <Text style={styles.coinStepText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Навыки</Text>
      <Card style={styles.skillsCard}>
        <Card.Content style={styles.skillsContent}>
          {SKILLS_LIST.map((skill) => {
            const bonus = skillBonus(skill);
            const prof = character.skills.find((s) => s.skillId === skill.id)?.proficient;
            return (
              <TouchableOpacity
                key={skill.id}
                style={[styles.skillRow, prof && styles.skillRowProf]}
                onPress={() => setSelectedSkill(skill)}
                activeOpacity={0.7}
              >
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillStat}>[{STAT_LABELS[skill.stat]}]</Text>
                <Text style={[styles.skillBonus, prof && styles.skillBonusProf]}>
                  {prof ? '★' : '·'} {fmtMod(bonus)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Card.Content>
      </Card>

      <Text style={styles.sectionLabel}>Особенности класса</Text>
      <Card style={styles.featuresCard}>
        <Card.Content style={styles.featuresContent}>
          <Text style={styles.featureSummary}>
            {classInfo?.name ?? '—'} · Уровень {character.level}
          </Text>
          {featuresUpToLevel.length === 0 ? (
            <Text style={styles.emptyText}>Нет особенностей на этом уровне.</Text>
          ) : (
            featuresUpToLevel.map((f, i) => {
              const info = getFeatureInfo(f.name);
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.featureRow}
                  onPress={() => setSelectedFeature(f)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.featureLvl}>Ур. {f.level}</Text>
                  <Text style={styles.featureName}>
                    {f.name}
                    {info ? ' ⓘ' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </Card.Content>
      </Card>

      <Text style={styles.sectionLabel}>Инвентарь</Text>
      <Card style={styles.inventoryCard}>
        <Card.Content style={styles.inventoryContent}>
          {character.inventory.length === 0 ? (
            <Text style={styles.emptyText}>Нет предметов.</Text>
          ) : (
            character.inventory.map((it) => (
              <View key={it.id} style={styles.inventoryRow}>
                <Text style={styles.inventoryName}>• {it.name}</Text>
                <Text style={styles.inventoryQty}>×{it.quantity}</Text>
                <TouchableOpacity style={styles.invActionBtn} onPress={() => adjustItemQty(it.id, -1)}>
                  <Text style={styles.invActionText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.invActionBtn} onPress={() => adjustItemQty(it.id, 1)}>
                  <Text style={styles.invActionText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.invRemoveBtn} onPress={() => removeItem(it.id)}>
                  <Text style={styles.invRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addItemBtn} onPress={() => setItemDialogOpen(true)}>
            <Text style={styles.addItemBtnText}>+ Добавить предмет</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {character.backstory ? (
        <>
          <Text style={styles.sectionLabel}>Личная предыстория</Text>
          <Card style={styles.notesCard}>
            <Card.Content>
              <Text style={styles.backstoryText}>{character.backstory}</Text>
            </Card.Content>
          </Card>
        </>
      ) : null}

      <Text style={styles.sectionLabel}>Заметки</Text>
      <Card style={styles.notesCard}>
        <Card.Content>
          <TextInput
            style={styles.notesInput}
            value={character.characterSheet}
            onChangeText={(text) => updateCharacter(character.id, { characterSheet: text })}
            placeholder="Запишите предысторию, цели, контакты, сведения о партии…"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('/')}>
          <Text style={styles.saveBtnText}>Сохранить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/')}>
          <Text style={styles.backBtnText}>← Назад</Text>
        </TouchableOpacity>
        <IconButton
          icon="calculator-variant"
          mode="contained"
          size={28}
          iconColor="#FFFFFF"
          containerColor="#D85336"
          style={styles.calcFab}
          onPress={() => router.push('/calculator' as `/calculator`)}
        />
      </View>

      <Modal visible={selectedFeature !== null} transparent animationType="fade" onRequestClose={() => setSelectedFeature(null)}>
        <TouchableOpacity activeOpacity={1} style={styles.skillModalOverlay} onPress={() => setSelectedFeature(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.skillModalCard} onPress={() => {}}>
            {selectedFeature && (() => {
              const info: FeatureInfo | undefined = getFeatureInfo(selectedFeature.name);
              return (
                <>
                  <Text style={styles.skillModalName}>{selectedFeature.name}</Text>
                  <View style={styles.featureLevelBadge}>
                    <Text style={styles.featureLevelText}>Получено на {selectedFeature.level} уровне</Text>
                  </View>
                  {info ? (
                    <>
                      <DetailLabel>Описание</DetailLabel>
                      <DetailValue>{info.description}</DetailValue>
                    </>
                  ) : (
                    <Text style={styles.emptyText}>Подробного описания пока нет. Особенность: {selectedFeature.name}.</Text>
                  )}
                </>
              );
            })()}
            <View style={styles.skillModalActions}>
              <Button mode="contained" onPress={() => setSelectedFeature(null)}>Закрыть</Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={newFeatures.length > 0} transparent animationType="fade" onRequestClose={dismissNewFeatures}>
        <TouchableOpacity activeOpacity={1} style={styles.skillModalOverlay} onPress={dismissNewFeatures}>
          <TouchableOpacity activeOpacity={1} style={styles.levelUpCard} onPress={() => {}}>
            <Text style={styles.levelUpTitle}>Новые особенности!</Text>
            <Text style={styles.levelUpSubtitle}>
              {character.name} достиг {character.level} уровня и получил:
            </Text>
            <ScrollView style={styles.levelUpScroll} nestedScrollEnabled>
              {newFeatures.map((f, i) => {
                const info = getFeatureInfo(f.name);
                return (
                  <View key={i} style={styles.levelUpFeature}>
                    <Text style={styles.levelUpFeatureHeader}>⭐ {f.name}</Text>
                    <Text style={styles.levelUpFeatureLvl}>Уровень {f.level}</Text>
                    {info && <Text style={styles.levelUpFeatureDesc}>{info.description}</Text>}
                  </View>
                );
              })}
            </ScrollView>
            <Button mode="contained" onPress={dismissNewFeatures} style={styles.levelUpBtn}>
              Отлично!
            </Button>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={selectedSkill !== null} transparent animationType="fade" onRequestClose={() => setSelectedSkill(null)}>
        <TouchableOpacity activeOpacity={1} style={styles.skillModalOverlay} onPress={() => setSelectedSkill(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.skillModalCard} onPress={() => {}}>
            {selectedSkill && (() => {
              const bonus = skillBonus(selectedSkill);
              const prof = character.skills.find((s) => s.skillId === selectedSkill.id)?.proficient;
              const expertise = character.skills.find((s) => s.skillId === selectedSkill.id)?.expertise;
              const baseMod = calculateModifier(character.stats[selectedSkill.stat]);
              return (
                <>
                  <Text style={styles.skillModalName}>{selectedSkill.name}</Text>
                  <View style={styles.skillModalBonusBox}>
                    <Text style={styles.skillModalBonusLabel}>Текущий бонус</Text>
                    <Text style={styles.skillModalBonusValue}>{fmtMod(bonus)}</Text>
                  </View>
                  <DetailLabel>Описание</DetailLabel>
                  <DetailValue>{selectedSkill.description}</DetailValue>
                  <DetailLabel>Зависит от</DetailLabel>
                  <DetailValue>{STAT_LABELS[selectedSkill.stat]} (модификатор {fmtMod(baseMod)})</DetailValue>
                  <DetailLabel>Владение</DetailLabel>
                  <DetailValue>
                    {prof ? (expertise ? 'Эксперт (×2 бонус мастерства)' : 'Доступно (+бонус мастерства)') : 'Не владеет'}
                  </DetailValue>
                  <DetailLabel>Формула</DetailLabel>
                  <DetailValue>
                    {fmtMod(baseMod)} {prof ? `+ ${character.proficiencyBonus}${expertise ? ` × 2 = +${character.proficiencyBonus * 2}` : ` = +${character.proficiencyBonus}`} ` : ''}= {fmtMod(bonus)}
                  </DetailValue>
                </>
              );
            })()}
            <View style={styles.skillModalActions}>
              <Button mode="contained" onPress={() => setSelectedSkill(null)}>Закрыть</Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={itemDialogOpen} transparent animationType="fade" onRequestClose={() => setItemDialogOpen(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.skillModalOverlay} onPress={() => setItemDialogOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.itemModalCard} onPress={() => {}}>
            <Text style={styles.itemModalTitle}>Добавить предмет</Text>
            <Text style={styles.detailLabel}>Название</Text>
            <TextInput
              style={styles.itemInput}
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="напр. Зелье лечения"
              placeholderTextColor={COLORS.textSecondary}
            />
            <Text style={styles.detailLabel}>Количество</Text>
            <TextInput
              style={[styles.itemInput, { width: 80, textAlign: 'center' }]}
              value={newItemQty}
              onChangeText={setNewItemQty}
              keyboardType="numeric"
            />
            <View style={styles.coinsModalActions}>
              <Button mode="outlined" onPress={() => { setNewItemName(''); setNewItemQty('1'); setItemDialogOpen(false); }}>Отмена</Button>
              <Button mode="contained" onPress={addItem} disabled={!newItemName.trim()}>Добавить</Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  notFoundText: { color: COLORS.text, fontSize: FONT.size.lg, marginBottom: SPACING.md },
  notFoundBackBtn: { marginTop: SPACING.md },
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

  coinsGrid: {
    flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.xs,
  },
  coinCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 8,
    paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  coinShort: { fontSize: FONT.size.xs, fontWeight: 'bold', letterSpacing: 1 },
  coinAmount: { color: COLORS.text, fontSize: FONT.size.xxl, fontWeight: 'bold', marginTop: 2 },
  coinStepperRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  hpStepperRow: { flexDirection: 'row', gap: 6, marginTop: 6, justifyContent: 'center' },
  coinStepBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  coinStepText: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },

  skillsCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.surface },
  skillsContent: { paddingVertical: SPACING.xs },
  skillRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  skillRowProf: { backgroundColor: 'rgba(46,160,67,0.08)' },
  skillName: { flex: 1, color: COLORS.text, fontSize: FONT.size.sm },
  skillStat: { color: COLORS.textSecondary, fontSize: FONT.size.xs, marginRight: 8, minWidth: 50 },
  skillBonus: { color: COLORS.textSecondary, fontSize: FONT.size.sm, fontWeight: '600', minWidth: 40, textAlign: 'right' },
  skillBonusProf: { color: COLORS.success, fontWeight: 'bold' },

  featuresCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.surface },
  featuresContent: { paddingVertical: SPACING.xs },
  featureSummary: { color: COLORS.accent, fontSize: FONT.size.sm, fontWeight: '600', marginBottom: 8 },
  featureRow: { flexDirection: 'row', paddingVertical: 3, gap: 10 },
  featureLvl: { color: COLORS.accent, fontSize: FONT.size.sm, fontWeight: 'bold', minWidth: 50 },
  featureName: { color: COLORS.text, fontSize: FONT.size.sm, flex: 1 },
  emptyText: { color: COLORS.textSecondary, fontSize: FONT.size.sm, fontStyle: 'italic' },
  detailLabel: { color: COLORS.primary, fontSize: FONT.size.xs, fontWeight: 'bold', marginTop: SPACING.xs, textTransform: 'uppercase' },
  coinsModalActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  footer: { flexDirection: 'row', gap: 12, padding: SPACING.md },
  calcFab: {
    backgroundColor: '#D85336',
    borderRadius: 28,
  },
  saveBtn: {
    flex: 1, height: 44, borderRadius: 14, backgroundColor: '#D85336',
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { color: '#DBDBDB', fontSize: 16, fontWeight: '600' },
  backBtn: {
    flex: 1, height: 44, borderRadius: 14, borderWidth: 1, borderColor: '#D85336',
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent',
  },
  backBtnText: { color: '#DBDBDB', fontSize: 16, fontWeight: '600' },

  inventoryCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.surface },
  inventoryContent: { paddingVertical: SPACING.xs },
  inventoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 6 },
  inventoryName: { flex: 1, color: COLORS.text, fontSize: FONT.size.sm },
  inventoryQty: { color: COLORS.accent, fontSize: FONT.size.sm, fontWeight: 'bold', minWidth: 36 },
  invActionBtn: {
    width: 28, height: 28, borderRadius: 6, backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  invActionText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  invRemoveBtn: {
    width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
  },
  invRemoveText: { color: COLORS.danger, fontSize: 14, fontWeight: 'bold' },
  addItemBtn: {
    marginTop: SPACING.sm, paddingVertical: 10, borderRadius: 6,
    backgroundColor: COLORS.surfaceVariant, borderWidth: 1, borderColor: COLORS.accent,
    borderStyle: 'dashed', alignItems: 'center',
  },
  addItemBtnText: { color: COLORS.accent, fontSize: FONT.size.sm, fontWeight: '600' },
  notesCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.surface },
  backstoryText: {
    color: COLORS.text, fontSize: FONT.size.sm, lineHeight: 20,
  },
  notesInput: {
    backgroundColor: COLORS.surfaceVariant, borderRadius: 8, padding: 12,
    color: COLORS.text, fontSize: FONT.size.sm, minHeight: 120,
    borderWidth: 1, borderColor: COLORS.border, fontFamily: undefined,
  },
  itemModalCard: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 20,
    width: 360, maxWidth: '92%', borderWidth: 1, borderColor: COLORS.border,
  },
  itemModalTitle: {
    color: COLORS.primary, fontSize: FONT.size.lg, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 12,
  },
  itemInput: {
    backgroundColor: COLORS.surfaceVariant, borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 8, marginTop: 4,
    color: COLORS.text, fontSize: FONT.size.sm, borderWidth: 1, borderColor: COLORS.border,
  },

  coinsModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  skillModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  skillModalCard: {
    backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 20, width: 380, maxWidth: '92%', maxHeight: '80%',
    borderWidth: 1, borderColor: COLORS.border,
  },
  skillModalName: {
    color: COLORS.primary, fontSize: FONT.size.xl, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 12,
  },
  skillModalBonusBox: {
    backgroundColor: COLORS.surfaceVariant, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 10,
    alignItems: 'center', marginBottom: 12,
  },
  skillModalBonusLabel: { color: COLORS.textSecondary, fontSize: FONT.size.xs },
  skillModalBonusValue: { color: COLORS.accent, fontSize: FONT.size.xxl, fontWeight: 'bold' },
  skillModalActions: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  featureLevelBadge: {
    backgroundColor: COLORS.surfaceVariant, borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    alignSelf: 'center', marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  featureLevelText: { color: COLORS.accent, fontSize: FONT.size.xs, fontWeight: '600' },

  levelUpCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 24, width: 400, maxWidth: '94%', maxHeight: '85%',
    borderWidth: 2, borderColor: COLORS.primary, alignItems: 'stretch',
  },
  levelUpTitle: {
    color: COLORS.primary, fontSize: FONT.size.xxl, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 6,
  },
  levelUpSubtitle: {
    color: COLORS.textSecondary, fontSize: FONT.size.sm,
    textAlign: 'center', marginBottom: 12,
  },
  levelUpScroll: { maxHeight: 400 },
  levelUpFeature: {
    backgroundColor: COLORS.surfaceVariant, borderRadius: 8,
    padding: 12, marginVertical: 6, borderWidth: 1, borderColor: COLORS.border,
  },
  levelUpFeatureHeader: { color: COLORS.accent, fontSize: FONT.size.md, fontWeight: 'bold' },
  levelUpFeatureLvl: { color: COLORS.textSecondary, fontSize: FONT.size.xs, marginTop: 2 },
  levelUpFeatureDesc: { color: COLORS.text, fontSize: FONT.size.sm, marginTop: 6, lineHeight: 18 },
  levelUpBtn: { marginTop: 16, alignSelf: 'stretch' },
});
