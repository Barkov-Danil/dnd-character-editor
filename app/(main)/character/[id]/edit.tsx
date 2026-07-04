import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONT, SPACING } from '../../theme';
import { useCharacterStore } from '../../store/characterStore';
import { proficiencyBonusFor, calculateModifier, calculateACFromArmor, calculateHP } from '../../utils/rulesEngine';
import { STAT_KEYS, STAT_LABELS, type Character, type StatKey, type Race, type ClassInfo, type CustomRace, type CustomClass } from '../../types';
import { RACES, CHARACTER_CLASSES, ARMORS, SHIELD, ALIGNMENTS } from '../../utils/gameData';

export default function EditCharacterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const savedCharacters = useCharacterStore((s) => s.savedCharacters);
  const libraryCharacters = useCharacterStore((s) => s.libraryCharacters);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);
  const customRaces = useCharacterStore((s) => s.customRaces);
  const customClasses = useCharacterStore((s) => s.customClasses);

  const all = [...savedCharacters, ...libraryCharacters];
  const original = all.find((c) => c.id === id) ?? null;

  const [name, setName] = useState('');
  const [level, setLevel] = useState('1');
  const [cla, setCla] = useState('');
  const [race, setRace] = useState('');
  const [background, setBackground] = useState('');
  const [alignment, setAlignment] = useState('');
  const [armorId, setArmorId] = useState('none');
  const [hasShield, setHasShield] = useState(false);
  const [hp, setHp] = useState('');
  const [maxHp, setMaxHp] = useState('');
  const [autoHp, setAutoHp] = useState(true);
  const [speed, setSpeed] = useState('');
  const [coins, setCoins] = useState({ pp: '0', gp: '0', sp: '0', cp: '0' });
  const [stats, setStats] = useState<Record<StatKey, string>>({
    STR: '10', DEX: '10', CON: '10', INT: '10', WIS: '10', CHA: '10',
  });

  const [raceOpen, setRaceOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [alignOpen, setAlignOpen] = useState(false);
  const [armorOpen, setArmorOpen] = useState(false);

  useEffect(() => {
    if (original) {
      setName(original.name);
      setLevel(String(original.level));
      setCla(original.class);
      setRace(original.race);
      setBackground(original.background);
      setAlignment(original.alignment);
      setArmorId(original.armorId ?? 'none');
      setHasShield(original.hasShield ?? false);
      setHp(String(original.hitPoints));
      setMaxHp(String(original.maxHitPoints));
      setSpeed(String(original.speed));
      setCoins({
        pp: String(original.coins?.pp ?? 0),
        gp: String(original.coins?.gp ?? 0),
        sp: String(original.coins?.sp ?? 0),
        cp: String(original.coins?.cp ?? 0),
      });
      setStats({
        STR: String(original.stats.STR),
        DEX: String(original.stats.DEX),
        CON: String(original.stats.CON),
        INT: String(original.stats.INT),
        WIS: String(original.stats.WIS),
        CHA: String(original.stats.CHA),
      });
    }
  }, [id]);

  const allRaces: Race[] = useMemo(
    () => [...customRaces, ...Object.values(RACES)],
    [customRaces],
  );
  const allClasses: ClassInfo[] = useMemo(
    () => [...customClasses, ...Object.values(CHARACTER_CLASSES)],
    [customClasses],
  );
  const armorList = useMemo(() => ARMORS, []);

  const findRaceName = (raceId: string, char: Character | undefined): string => {
    if (char?.customRace && char.customRace.id === raceId) return char.customRace.name;
    return allRaces.find((r) => r.id === raceId)?.name ?? raceId;
  };
  const findClassName = (classId: string, char: Character | undefined): string => {
    if (char?.customClass && char.customClass.id === classId) return char.customClass.name;
    return allClasses.find((c) => c.id === classId)?.name ?? classId;
  };

  if (!original) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Персонаж не найден</Text>
        <Button mode="contained" onPress={() => router.back()}>Назад</Button>
      </View>
    );
  }

  const lvlNum = Math.max(1, Math.min(20, parseInt(level, 10) || 1));
  const profBonus = proficiencyBonusFor(lvlNum);
  const dexNum = parseInt(stats.DEX, 10) || 10;
  const dexMod = calculateModifier(dexNum);
  const conNum = parseInt(stats.CON, 10) || 10;
  const conMod = calculateModifier(conNum);
  const selectedArmor = armorList.find((a) => a.id === armorId) ?? armorList[0];
  const ac = calculateACFromArmor(selectedArmor, dexMod, hasShield);

  const selectedClassInfo: ClassInfo | undefined =
    allClasses.find((c) => c.id === cla) ??
    (original?.customClass && original.customClass.id === cla ? original.customClass : undefined);
  const hitDie = selectedClassInfo?.hitDie ?? 8;
  const autoMaxHp = calculateHP(hitDie, lvlNum, conMod);
  const effectiveMaxHp = autoHp ? autoMaxHp : (parseInt(maxHp, 10) || 0);

  const handleSave = () => {
    const parsedStats = {} as Record<StatKey, number>;
    for (const k of STAT_KEYS) parsedStats[k] = parseInt(stats[k], 10) || 10;
    const patch: Partial<Character> = {
      name: name.trim() || original.name,
      level: lvlNum,
      class: cla || original.class,
      race: race || original.race,
      background: background.trim(),
      alignment: alignment || original.alignment,
      stats: parsedStats,
      hitPoints: Math.min(parseInt(hp, 10) || 0, effectiveMaxHp) || effectiveMaxHp,
      maxHitPoints: effectiveMaxHp,
      armorClass: ac,
      armorId: selectedArmor.id,
      hasShield,
      speed: Math.max(0, parseInt(speed, 10) || 0),
      proficiencyBonus: profBonus,
      coins: {
        pp: parseInt(coins.pp, 10) || 0,
        gp: parseInt(coins.gp, 10) || 0,
        sp: parseInt(coins.sp, 10) || 0,
        cp: parseInt(coins.cp, 10) || 0,
      },
    };
    updateCharacter(original.id, patch);
    router.back();
  };

  const closeAllDropdowns = () => {
    setRaceOpen(false);
    setClassOpen(false);
    setAlignOpen(false);
    setArmorOpen(false);
  };

  const fmtMod = (n: number) => (n >= 0 ? `+${n}` : String(n));

  const SelectField = ({
    label, value, open, setOpen, children,
  }: {
    label: string;
    value: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    children: React.ReactNode;
  }) => (
    <View style={styles.selectWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.selectTrigger}
        onPress={() => { closeAllDropdowns(); setOpen(!open); }}
        activeOpacity={0.8}
      >
        <Text style={styles.selectValue} numberOfLines={1}>{value}</Text>
        <Text style={styles.selectChevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.dropdownOverlay}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdownSheet}>
            <Text style={styles.dropdownSheetTitle}>{label}</Text>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {children}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Редактирование персонажа</Text>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Основное</Text>
          <TextInput
            label="Имя"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.row2}>
            <View style={styles.flex1}>
              <Text style={styles.fieldLabel}>Уровень</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setLevel(String(Math.max(1, lvlNum - 1)))}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <TextInput
                  value={level}
                  onChangeText={setLevel}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.stepInput}
                  contentStyle={styles.stepInputContent}
                />
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setLevel(String(Math.min(20, lvlNum + 1)))}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.flex1}>
              <Text style={styles.fieldLabel}>Бонус мастерства</Text>
              <View style={styles.profBox}>
                <Text style={styles.profText}>+{profBonus}</Text>
                <Text style={styles.profHint}>зависит от уровня</Text>
              </View>
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.flex1}>
              <SelectField
                label="Раса"
                value={findRaceName(race, original)}
                open={raceOpen}
                setOpen={setRaceOpen}
              >
                {allRaces.map((r) => {
                  const isCustom = (r as CustomRace).isCustom === true;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[styles.dropdownItem, r.id === race && styles.dropdownItemActive]}
                      onPress={() => { setRace(r.id); setRaceOpen(false); }}
                    >
                      <Text style={styles.dropdownItemText}>{r.name}{isCustom ? ' ✦' : ''}</Text>
                      {r.id === race && <Text style={styles.checkMark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </SelectField>
            </View>
            <View style={styles.flex1}>
              <SelectField
                label="Класс"
                value={findClassName(cla, original)}
                open={classOpen}
                setOpen={setClassOpen}
              >
                {allClasses.map((c) => {
                  const isCustom = (c as CustomClass).isCustom === true;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.dropdownItem, c.id === cla && styles.dropdownItemActive]}
                      onPress={() => { setCla(c.id); setClassOpen(false); }}
                    >
                      <Text style={styles.dropdownItemText}>{c.name}{isCustom ? ' ✦' : ''}</Text>
                      {c.id === cla && <Text style={styles.checkMark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </SelectField>
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.flex1}>
              <TextInput
                label="Предыстория"
                value={background}
                onChangeText={setBackground}
                mode="outlined"
                style={styles.input}
              />
            </View>
            <View style={styles.flex1}>
              <SelectField
                label="Мировоззрение"
                value={alignment || '—'}
                open={alignOpen}
                setOpen={setAlignOpen}
              >
                {ALIGNMENTS.map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={[styles.dropdownItem, a === alignment && styles.dropdownItemActive]}
                    onPress={() => { setAlignment(a); setAlignOpen(false); }}
                  >
                    <Text style={styles.dropdownItemText}>{a}</Text>
                    {a === alignment && <Text style={styles.checkMark}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </SelectField>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Характеристики</Text>
          {STAT_KEYS.map((k) => (
            <View key={k} style={styles.statRow}>
              <Text style={styles.statKey}>{STAT_LABELS[k]}</Text>
              <Text style={styles.statMod}>
                {(() => {
                  const m = calculateModifier(parseInt(stats[k], 10) || 10);
                  return m >= 0 ? `+${m}` : String(m);
                })()}
              </Text>
              <TextInput
                value={stats[k]}
                onChangeText={(v) => setStats((s) => ({ ...s, [k]: v.replace(/[^0-9]/g, '') }))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.statInput}
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Броня и КД</Text>
          <View style={styles.row2}>
            <View style={styles.flex1}>
              <SelectField
                label="Броня"
                value={selectedArmor.name}
                open={armorOpen}
                setOpen={setArmorOpen}
              >
                {armorList.map((a) => (
                  <TouchableOpacity
                    key={a.id}
                    style={[styles.dropdownItem, a.id === armorId && styles.dropdownItemActive]}
                    onPress={() => { setArmorId(a.id); setArmorOpen(false); }}
                  >
                    <View style={styles.armorItemRow}>
                      <View style={styles.flex1}>
                        <Text style={styles.dropdownItemText}>{a.name}</Text>
                        <Text style={styles.armorMeta}>
                          {a.kind === 'none' ? 'без брони' : a.kind === 'light' ? 'лёгкая' : a.kind === 'medium' ? 'средняя' : 'тяжёлая'}
                          {' · КД '}{a.baseAC}{a.dexCap !== null ? ` (макс. +${a.dexCap})` : ''}
                        </Text>
                      </View>
                      {a.id === armorId && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
              </SelectField>
            </View>
          </View>
          <TouchableOpacity
            style={styles.shieldToggle}
            onPress={() => setHasShield((v) => !v)}
          >
            <View style={[styles.checkbox, hasShield && styles.checkboxActive]}>
              {hasShield && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <Text style={styles.shieldLabel}>
              Щит (+{SHIELD.bonus} к КД)
            </Text>
          </TouchableOpacity>
          <View style={styles.kdRow}>
            <Text style={styles.kdLabel}>Класс доспеха (КД)</Text>
            <Text style={styles.kdValue}>{ac}</Text>
          </View>
          <Text style={styles.kdHint}>
            {selectedArmor.kind === 'none'
              ? `10 + мод. Ловкости (${dexMod >= 0 ? `+${dexMod}` : dexMod})`
              : `${selectedArmor.baseAC} + мод. Ловкости${selectedArmor.dexCap !== null ? ` (макс. +${selectedArmor.dexCap})` : ''} (${dexMod >= 0 ? `+${dexMod}` : dexMod})`}
            {hasShield && ' + щит (+2)'}
            {' = '}{ac}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Боевые показатели</Text>
          <View style={styles.hpAutoRow}>
            <TouchableOpacity
              style={[styles.checkbox, autoHp && styles.checkboxActive]}
              onPress={() => setAutoHp(true)}
            >
              {autoHp && <Text style={styles.checkboxMark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.shieldLabel}>
              Авто-расчёт макс. HP от уровня/КХ/Телосложения
            </Text>
          </View>
          {autoHp ? (
            <View style={styles.kdRow}>
              <Text style={styles.kdLabel}>Макс. HP (ур. {lvlNum}, d{hitDie}, CON {fmtMod(conMod)})</Text>
              <Text style={styles.kdValue}>{autoMaxHp}</Text>
            </View>
          ) : (
            <View style={styles.row2}>
              <View style={styles.flex1}>
                <TextInput
                  label="Макс. HP"
                  value={maxHp}
                  onChangeText={(v) => setMaxHp(v.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                />
              </View>
            </View>
          )}
          <View style={styles.row2}>
            <View style={styles.flex1}>
              <TextInput
                label="Текущие HP"
                value={hp}
                onChangeText={(v) => setHp(v.replace(/[^0-9-]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.flex1}>
              <TextInput
                label="Скорость"
                value={speed}
                onChangeText={(v) => setSpeed(v.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionLabel}>Монеты</Text>
          <View style={styles.row4}>
            <View style={styles.flex1}>
              <Text style={styles.coinLabel}>Платина</Text>
              <TextInput
                value={coins.pp}
                onChangeText={(v) => setCoins((c) => ({ ...c, pp: v.replace(/[^0-9]/g, '') }))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.coinInput}
                contentStyle={styles.coinInputContent}
              />
              <Text style={styles.coinSuffix}>pp</Text>
            </View>
            <View style={styles.flex1}>
              <Text style={styles.coinLabel}>Золото</Text>
              <TextInput
                value={coins.gp}
                onChangeText={(v) => setCoins((c) => ({ ...c, gp: v.replace(/[^0-9]/g, '') }))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.coinInput}
                contentStyle={styles.coinInputContent}
              />
              <Text style={styles.coinSuffix}>gp</Text>
            </View>
            <View style={styles.flex1}>
              <Text style={styles.coinLabel}>Серебро</Text>
              <TextInput
                value={coins.sp}
                onChangeText={(v) => setCoins((c) => ({ ...c, sp: v.replace(/[^0-9]/g, '') }))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.coinInput}
                contentStyle={styles.coinInputContent}
              />
              <Text style={styles.coinSuffix}>sp</Text>
            </View>
            <View style={styles.flex1}>
              <Text style={styles.coinLabel}>Медь</Text>
              <TextInput
                value={coins.cp}
                onChangeText={(v) => setCoins((c) => ({ ...c, cp: v.replace(/[^0-9]/g, '') }))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.coinInput}
                contentStyle={styles.coinInputContent}
              />
              <Text style={styles.coinSuffix}>cp</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={router.back}>Отмена</Button>
        <Button mode="contained" onPress={handleSave}>Сохранить</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: FONT.size.xxl, fontWeight: 'bold', color: COLORS.primary, padding: SPACING.md },
  section: { marginHorizontal: SPACING.md, marginVertical: SPACING.xs, backgroundColor: COLORS.surface },
  sectionLabel: { fontSize: FONT.size.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.surface, marginVertical: SPACING.xs },
  row2: { flexDirection: 'row', gap: SPACING.sm, marginVertical: SPACING.xs },
  row4: { flexDirection: 'row', gap: SPACING.xs, marginVertical: SPACING.xs },
  flex1: { flex: 1 },
  fieldLabel: { color: COLORS.textSecondary, fontSize: FONT.size.xs, marginBottom: SPACING.xs },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  stepBtn: {
    width: 40, height: 40, borderRadius: 6,
    backgroundColor: COLORS.surfaceVariant, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  stepBtnText: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  stepInput: { flex: 1, backgroundColor: COLORS.surface },
  stepInputContent: { textAlign: 'center' },
  profBox: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.xs, paddingVertical: 8 },
  profText: { color: COLORS.primary, fontSize: 24, fontWeight: 'bold' },
  profHint: { color: COLORS.textSecondary, fontSize: FONT.size.xs, fontStyle: 'italic' },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs },
  statKey: { flex: 1, color: COLORS.text, fontSize: FONT.size.sm, fontWeight: '600' },
  statMod: { width: 44, color: COLORS.accent, fontSize: FONT.size.sm },
  statInput: { width: 90, backgroundColor: COLORS.surface },

  selectWrap: { position: 'relative', zIndex: 10 },
  selectTrigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceVariant, borderRadius: 4,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 12, paddingVertical: 14, minHeight: 50,
  },
  selectValue: { color: COLORS.text, fontSize: FONT.size.md, flex: 1 },
  selectChevron: { color: COLORS.textSecondary, fontSize: 10, marginLeft: 8 },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dropdownSheet: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    width: 380,
    maxWidth: '92%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownSheetTitle: {
    color: COLORS.primary,
    fontSize: FONT.size.md,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownScroll: {},
  dropdownItem: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dropdownItemActive: { backgroundColor: COLORS.surfaceVariant },
  dropdownItemText: { color: COLORS.text, fontSize: FONT.size.sm },
  checkMark: { color: COLORS.success, fontSize: 14, fontWeight: 'bold' },
  armorItemRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  armorMeta: { color: COLORS.textSecondary, fontSize: FONT.size.xs, marginTop: 2 },

  shieldToggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.sm },
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxMark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  shieldLabel: { color: COLORS.text, fontSize: FONT.size.sm },

  kdRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant, borderRadius: 6,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
  },
  kdLabel: { color: COLORS.text, fontSize: FONT.size.md, fontWeight: '600' },
  kdValue: { color: COLORS.accent, fontSize: FONT.size.xxl, fontWeight: 'bold' },
  hpAutoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  kdHint: { color: COLORS.textSecondary, fontSize: FONT.size.xs, marginTop: SPACING.xs, fontStyle: 'italic' },

  coinLabel: { color: COLORS.textSecondary, fontSize: FONT.size.xs, textAlign: 'center', marginBottom: 4 },
  coinInput: { backgroundColor: COLORS.surface, paddingHorizontal: 4 },
  coinInputContent: { textAlign: 'center' },
  coinSuffix: { color: COLORS.accent, fontSize: FONT.size.xs, textAlign: 'center', marginTop: 2 },

  footer: { flexDirection: 'row', justifyContent: 'space-around', padding: SPACING.md },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  notFoundText: { color: COLORS.text, fontSize: FONT.size.lg, marginBottom: SPACING.md },
  dropdownBackdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 5, width: 9999, height: 9999,
  },
});
