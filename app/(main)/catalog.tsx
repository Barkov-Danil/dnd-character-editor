import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING } from './theme';
import { RACES, CHARACTER_CLASSES, ARMORS, SHIELD, SKILLS_LIST } from './utils/gameData';
import { STAT_LABELS, type StatKey } from './types';
import { calculateModifier } from './utils/rulesEngine';
import { FEATURES_DATA, getFeatureInfo } from './utils/featuresData';

type Tab = 'classes' | 'races' | 'armors' | 'features' | 'skills';

export default function CatalogScreen() {
  const [tab, setTab] = useState<Tab>('classes');
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button mode="text" onPress={router.back} labelStyle={styles.backLabel}>← Назад</Button>
        <Text style={styles.title}>Каталог</Text>
      </View>

      <View style={styles.tabs}>
        {(['classes', 'races', 'armors', 'features', 'skills'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => { setTab(t); setOpenId(null); }}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'classes' ? 'Классы' : t === 'races' ? 'Расы' : t === 'armors' ? 'Броня' : t === 'features' ? 'Способности' : 'Навыки'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'classes' && (
        <View>
          {Object.values(CHARACTER_CLASSES).map((c) => (
            <Card key={c.id} style={styles.entryCard}>
              <TouchableOpacity onPress={() => toggle(c.id)} activeOpacity={0.8}>
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryName}>{c.name}</Text>
                    <Text style={styles.chevron}>{openId === c.id ? '▲' : '▼'}</Text>
                  </View>
                  <Text style={styles.entryShort}>{c.description}</Text>
                  <Text style={styles.entryMeta}>
                    Кость HP: d{c.hitDie} · Осн. характеристика: {STAT_LABELS[c.primaryStat as StatKey]} ·
                    {' '}Заклинатель: {c.spellcaster === 'none' ? 'нет' : c.spellcaster === 'half' ? 'полу-' : 'полный'}
                  </Text>
                </Card.Content>
              </TouchableOpacity>
              {openId === c.id && (
                <Card.Content style={styles.detail}>
                  <Text style={styles.detailLabel}>Спасброски</Text>
                  <Text style={styles.detailValue}>
                    {c.savingThrows.map((s) => STAT_LABELS[s as StatKey]).join(', ')}
                  </Text>

                  <Text style={styles.detailLabel}>Доступные навыки</Text>
                  <Text style={styles.detailValue}>
                    {c.skillPool.length} на выбор (брать {c.skillChoices})
                  </Text>

                  {c.subClasses.length > 0 && (
                    <>
                      <Text style={styles.detailLabel}>Подклассы</Text>
                      <Text style={styles.detailValue}>{c.subClasses.join(', ')}</Text>
                    </>
                  )}

                  {Object.keys(c.featuresByLevel).length > 0 && (
                    <>
                      <Text style={styles.detailLabel}>Способности по уровням</Text>
                      {Object.entries(c.featuresByLevel).map(([lvl, feats]) => (
                        <View key={lvl} style={styles.featRow}>
                          <Text style={styles.featLvl}>Ур. {lvl}</Text>
                          <Text style={styles.featList}>{feats.join(', ')}</Text>
                        </View>
                      ))}
                    </>
                  )}

                  {c.spellSlots && c.spellSlots.length > 0 && (
                    <>
                      <Text style={styles.detailLabel}>Ячейки заклинаний</Text>
                      <Text style={styles.detailValue}>
                        {c.spellSlots.map((s) => `Ур.${s.level}: ${s.total}`).join(' · ')}
                      </Text>
                    </>
                  )}
                </Card.Content>
              )}
            </Card>
          ))}
        </View>
      )}

      {tab === 'races' && (
        <View>
          {Object.values(RACES).map((r) => (
            <Card key={r.id} style={styles.entryCard}>
              <TouchableOpacity onPress={() => toggle(r.id)} activeOpacity={0.8}>
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryName}>{r.name}</Text>
                    <Text style={styles.chevron}>{openId === r.id ? '▲' : '▼'}</Text>
                  </View>
                  <Text style={styles.entryShort}>{r.description}</Text>
                  <Text style={styles.entryMeta}>
                    Скорость: {r.speed} · Размер: {r.size === 'Small' ? 'Малый' : 'Средний'}
                  </Text>
                </Card.Content>
              </TouchableOpacity>
              {openId === r.id && (
                <Card.Content style={styles.detail}>
                  <Text style={styles.detailLabel}>Бонусы характеристик</Text>
                  <Text style={styles.detailValue}>
                    {Object.entries(r.abilityBonuses).map(([k, v]) =>
                      `${STAT_LABELS[k as StatKey]} +${v}`).join(', ')}
                  </Text>

                  <Text style={styles.detailLabel}>Языки</Text>
                  <Text style={styles.detailValue}>{r.languages.join(', ')}</Text>

                  <Text style={styles.detailLabel}>Особенности</Text>
                  {r.traits.map((t, i) => (
                    <Text key={i} style={styles.traitItem}>• {t}</Text>
                  ))}

                  {r.subRaces && r.subRaces.length > 0 && (
                    <>
                      <Text style={styles.detailLabel}>Подрасы</Text>
                      {r.subRaces.map((sr) => (
                        <View key={sr.id} style={styles.subraceRow}>
                          <Text style={styles.subraceName}>{sr.name}</Text>
                          <Text style={styles.subraceTraits}>
                            {Object.entries(sr.abilityBonuses).map(([k, v]) =>
                              `${STAT_LABELS[k as StatKey]} +${v}`).join(', ')}
                            {' · '}{sr.traits.join(', ')}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}
                </Card.Content>
              )}
            </Card>
          ))}
        </View>
      )}

      {tab === 'armors' && (
        <View>
          {ARMORS.map((a) => (
            <Card key={a.id} style={styles.entryCard}>
              <TouchableOpacity onPress={() => toggle(a.id)} activeOpacity={0.8}>
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryName}>{a.name}</Text>
                    <Text style={styles.chevron}>{openId === a.id ? '▲' : '▼'}</Text>
                  </View>
                  <Text style={styles.entryMeta}>
                    {a.kind === 'none' ? 'Без брони' : a.kind === 'light' ? 'Лёгкая' : a.kind === 'medium' ? 'Средняя' : 'Тяжёлая'}
                    {' · Базовый КД: '}{a.baseAC}
                    {a.dexCap !== null ? ` (макс. +${a.dexCap} Лов)` : ' (+полный Лов)'}
                    {a.stealthDisadvantage ? ' · Помеха Stealth' : ''}
                  </Text>
                </Card.Content>
              </TouchableOpacity>
              {openId === a.id && (
                <Card.Content style={styles.detail}>
                  <Text style={styles.detailLabel}>Описание</Text>
                  <Text style={styles.detailValue}>{a.description}</Text>

                  <Text style={styles.detailLabel}>Стоимость</Text>
                  <Text style={styles.detailValue}>
                    {[
                      a.cost.pp && `${a.cost.pp} pp`,
                      a.cost.gp && `${a.cost.gp} gp`,
                      a.cost.sp && `${a.cost.sp} sp`,
                      a.cost.cp && `${a.cost.cp} cp`,
                    ].filter(Boolean).join(', ') || 'бесплатно'}
                  </Text>

                  <Text style={styles.detailLabel}>Вес</Text>
                  <Text style={styles.detailValue}>{a.weight} фунтов</Text>

                  {a.strengthRequired && (
                    <>
                      <Text style={styles.detailLabel}>Требуется Сила</Text>
                      <Text style={styles.detailValue}>{a.strengthRequired}</Text>
                    </>
                  )}

                  <Text style={styles.detailLabel}>Примеры значений КД (лвл 1, Лов 8–20)</Text>
                  <View style={styles.acGrid}>
                    {[8, 10, 12, 14, 16, 18, 20].map((dexVal) => {
                      const dexMod = calculateModifier(dexVal);
                      const cap = a.dexCap !== null ? Math.min(dexMod, a.dexCap) : dexMod;
                      const acFin = a.baseAC + (cap > 0 ? cap : 0);
                      return (
                        <View key={dexVal} style={styles.acCell}>
                          <Text style={styles.acCellLabel}>Лов {dexVal}</Text>
                          <Text style={styles.acCellValue}>{acFin}</Text>
                        </View>
                      );
                    })}
                  </View>

                  {a.stealthDisadvantage && (
                    <Text style={styles.warnText}>⚠ Помеха на проверки Скрытности</Text>
                  )}
                </Card.Content>
              )}
            </Card>
          ))}

          <Card style={styles.entryCard}>
            <TouchableOpacity onPress={() => toggle('shield')} activeOpacity={0.8}>
              <Card.Content>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryName}>{SHIELD.name}</Text>
                  <Text style={styles.chevron}>{openId === 'shield' ? '▲' : '▼'}</Text>
                </View>
                <Text style={styles.entryMeta}>+{SHIELD.bonus} к КД · занимает одну руку</Text>
              </Card.Content>
            </TouchableOpacity>
            {openId === 'shield' && (
              <Card.Content style={styles.detail}>
                <Text style={styles.detailLabel}>Описание</Text>
                <Text style={styles.detailValue}>{SHIELD.description}</Text>
                <Text style={styles.detailLabel}>Стоимость</Text>
                <Text style={styles.detailValue}>{SHIELD.cost.gp} gp</Text>
                <Text style={styles.detailLabel}>Вес</Text>
                <Text style={styles.detailValue}>{SHIELD.weight} фунтов</Text>
              </Card.Content>
            )}
          </Card>
        </View>
      )}

      {tab === 'features' && (
        <View>
          {Object.values(FEATURES_DATA).map((f) => {
            const info = getFeatureInfo(f.name) ?? f;
            const sourceLabel = f.source === 'shared' ? 'Общий' : f.source === 'fighter' ? 'Воин' : f.source === 'wizard' ? 'Волшебник' : f.source === 'rogue' ? 'Плут' : 'Жрец';
            return (
              <Card key={f.id} style={styles.entryCard}>
                <TouchableOpacity onPress={() => toggle(f.id)} activeOpacity={0.8}>
                  <Card.Content>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryName}>{f.name}</Text>
                      <Text style={styles.chevron}>{openId === f.id ? '▲' : '▼'}</Text>
                    </View>
                    <Text style={styles.entryMeta}>Источник: {sourceLabel}</Text>
                  </Card.Content>
                </TouchableOpacity>
                {openId === f.id && (
                  <Card.Content style={styles.detail}>
                    <Text style={styles.detailLabel}>Описание</Text>
                    <Text style={styles.detailValue}>{info.description}</Text>
                  </Card.Content>
                )}
              </Card>
            );
          })}
        </View>
      )}

      {tab === 'skills' && (
        <View>
          {SKILLS_LIST.map((skill) => (
            <Card key={skill.id} style={styles.entryCard}>
              <TouchableOpacity onPress={() => toggle(skill.id)} activeOpacity={0.8}>
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryName}>{skill.name}</Text>
                    <Text style={styles.chevron}>{openId === skill.id ? '▲' : '▼'}</Text>
                  </View>
                  <Text style={styles.entryMeta}>
                    Характеристика: {STAT_LABELS[skill.stat as StatKey]}
                  </Text>
                </Card.Content>
              </TouchableOpacity>
              {openId === skill.id && (
                <Card.Content style={styles.detail}>
                  <Text style={styles.detailLabel}>Описание</Text>
                  <Text style={styles.detailValue}>{skill.description}</Text>
                </Card.Content>
              )}
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm },
  backLabel: { color: COLORS.textSecondary, fontSize: FONT.size.sm },
  title: { fontSize: FONT.size.xxl, fontWeight: 'bold', color: COLORS.primary, paddingVertical: SPACING.md },

  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.xs },
  tab: {
    flex: 1, paddingVertical: 10, paddingHorizontal: SPACING.sm,
    borderRadius: 6, backgroundColor: COLORS.surfaceVariant,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { color: COLORS.textSecondary, fontSize: FONT.size.sm, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  entryCard: { marginHorizontal: SPACING.md, marginVertical: SPACING.xs, backgroundColor: COLORS.surface },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryName: { color: COLORS.accent, fontSize: FONT.size.lg, fontWeight: 'bold' },
  entryShort: { color: COLORS.textSecondary, fontSize: FONT.size.sm, marginTop: SPACING.xs },
  entryMeta: { color: COLORS.text, fontSize: FONT.size.xs, marginTop: 4 },
  chevron: { color: COLORS.textSecondary, fontSize: 10 },

  detail: { paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.sm },
  detailLabel: { color: COLORS.primary, fontSize: FONT.size.xs, fontWeight: 'bold', marginTop: SPACING.xs, textTransform: 'uppercase' },
  detailValue: { color: COLORS.text, fontSize: FONT.size.sm, marginTop: 2 },

  featRow: { flexDirection: 'row', marginTop: SPACING.xs, gap: SPACING.sm },
  featLvl: { color: COLORS.accent, fontSize: FONT.size.sm, fontWeight: '600', minWidth: 50 },
  featList: { color: COLORS.text, fontSize: FONT.size.sm, flex: 1 },

  traitItem: { color: COLORS.text, fontSize: FONT.size.sm, paddingVertical: 2 },

  subraceRow: { paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  subraceName: { color: COLORS.text, fontSize: FONT.size.sm, fontWeight: '600' },
  subraceTraits: { color: COLORS.textSecondary, fontSize: FONT.size.xs, marginTop: 2 },

  acGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.xs },
  acCell: {
    backgroundColor: COLORS.surfaceVariant, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 6,
    alignItems: 'center', minWidth: 60,
  },
  acCellLabel: { color: COLORS.textSecondary, fontSize: FONT.size.xs },
  acCellValue: { color: COLORS.accent, fontSize: FONT.size.lg, fontWeight: 'bold' },

  warnText: { color: COLORS.warning, fontSize: FONT.size.sm, marginTop: SPACING.sm, fontWeight: '600' },
});
