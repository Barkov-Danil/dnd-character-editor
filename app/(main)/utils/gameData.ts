import type { Race, ClassInfo, SkillInfo, Character } from '../types';

export const CHARACTER_CLASSES: Record<string, ClassInfo> = {
  fighter: {
    id: 'fighter', name: 'Воин', description: 'Мастер боевых искусств и оружия.',
    hitDie: 10, primaryStat: 'STR',
    savingThrows: ['STR', 'CON'],
    skillPool: ['acrobatics', 'animal_handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    skillChoices: 2,
    armorProficiencies: [], weaponProficiencies: [],
    featuresByLevel: {}, spellcaster: 'none',
    subClasses: [],
  },
  wizard: {
    id: 'wizard', name: 'Волшебник', description: 'Заклинатель тайной магии.',
    hitDie: 6, primaryStat: 'INT',
    savingThrows: ['INT', 'WIS'],
    skillPool: ['arcana', 'history', 'investigation', 'medicine', 'religion'],
    skillChoices: 2,
    armorProficiencies: [], weaponProficiencies: [],
    featuresByLevel: {}, spellcaster: 'full',
    spellSlots: [{ level: 1, used: 0, total: 2 }],
    subClasses: [],
  },
  rogue: {
    id: 'rogue', name: 'Плут', description: 'Хитрый мастер скрытности и ловкости.',
    hitDie: 8, primaryStat: 'DEX',
    savingThrows: ['DEX', 'INT'],
    skillPool: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight_of_hand', 'stealth'],
    skillChoices: 4,
    armorProficiencies: [], weaponProficiencies: [],
    featuresByLevel: {}, spellcaster: 'none',
    subClasses: [],
  },
  cleric: {
    id: 'cleric', name: 'Жрец', description: 'Слуга богов, владеющий божественной магией.',
    hitDie: 8, primaryStat: 'WIS',
    savingThrows: ['WIS', 'CHA'],
    skillPool: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    skillChoices: 2,
    armorProficiencies: [], weaponProficiencies: [],
    featuresByLevel: {}, spellcaster: 'full',
    spellSlots: [{ level: 1, used: 0, total: 2 }],
    subClasses: [],
  },
};

export const RACES: Record<string, Race> = {
  human: {
    id: 'human', name: 'Человек',
    description: 'Универсальная раса, адаптивная и амбициозная.',
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    speed: 30, size: 'Medium',
    languages: ['Общий'],
    traits: ['+1 ко всем характеристикам', 'Дополнительный язык'],
  },
  elf: {
    id: 'elf', name: 'Эльф',
    description: 'Грациозные существа с древней магией.',
    abilityBonuses: { DEX: 2, INT: 1 },
    speed: 30, size: 'Medium',
    languages: ['Общий', 'Эльфийский'],
    traits: ['Тёмное зрение 60ft', 'Наследие фей', 'Транс'],
    subRaces: [
      { id: 'high_elf', name: 'Высший эльф', abilityBonuses: { INT: 1 }, traits: ['+1 ИНТ'] },
      { id: 'wood_elf', name: 'Лесной эльф', abilityBonuses: { WIS: 1 }, traits: ['+1 МУД', 'Маскировка в лесу'] },
    ],
  },
  dwarf: {
    id: 'dwarf', name: 'Дварф',
    description: 'Стойкие подземные жители, мастера ремесла.',
    abilityBonuses: { CON: 2, WIS: 1 },
    speed: 25, size: 'Medium',
    languages: ['Общий', 'Дварфийский'],
    traits: ['Тёмное зрение 60ft', 'Дварфийская стойкость'],
    subRaces: [
      { id: 'hill_dwarf', name: 'Холмовой дварф', abilityBonuses: { WIS: 1 }, traits: ['Дварфийская выносливость'] },
    ],
  },
  halfling: {
    id: 'halfling', name: 'Халфлинг',
    description: 'Маленькие, удачливые и ловкие.',
    abilityBonuses: { DEX: 2, CHA: 1 },
    speed: 25, size: 'Small',
    languages: ['Общий', 'Халфлингийский'],
    traits: ['Удачливость', 'Храбрость'],
  },
};

export const ALIGNMENTS = [
  'Законно-добрый', 'Нейтрально-добрый', 'Хаотично-добрый',
  'Законно-нейтральный', 'Нейтральный', 'Хаотично-нейтральный',
  'Законно-злой', 'Нейтрально-злой', 'Хаотично-злой',
];

export const SKILLS_LIST: SkillInfo[] = [
  { id: 'acrobatics', name: 'Акробатика', stat: 'DEX' },
  { id: 'animal_handling', name: 'Уход за животными', stat: 'WIS' },
  { id: 'arcana', name: 'Магия', stat: 'INT' },
  { id: 'athletics', name: 'Атлетика', stat: 'STR' },
  { id: 'deception', name: 'Обман', stat: 'CHA' },
  { id: 'history', name: 'История', stat: 'INT' },
  { id: 'insight', name: 'Проницательность', stat: 'WIS' },
  { id: 'intimidation', name: 'Запугивание', stat: 'CHA' },
  { id: 'investigation', name: 'Расследование', stat: 'INT' },
  { id: 'medicine', name: 'Медицина', stat: 'WIS' },
  { id: 'nature', name: 'Природа', stat: 'INT' },
  { id: 'perception', name: 'Восприятие', stat: 'WIS' },
  { id: 'performance', name: 'Выступление', stat: 'CHA' },
  { id: 'persuasion', name: 'Убеждение', stat: 'CHA' },
  { id: 'religion', name: 'Религия', stat: 'INT' },
  { id: 'sleight_of_hand', name: 'Ловкость рук', stat: 'DEX' },
  { id: 'stealth', name: 'Скрытность', stat: 'DEX' },
  { id: 'survival', name: 'Выживание', stat: 'WIS' },
];

export const WIZARD_STEPS = ['Раса', 'Класс', 'Характеристики', 'Навыки', 'Детали', 'Обзор'];

export const STAT_METHODS = [
  { value: '4d6', label: '4d6 бросок' },
  { value: 'standard', label: 'Стандартный массив' },
];

export const STANDARD_ARRAY = { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 };

export const LIBRARY_CHARACTERS: Character[] = [
  {
    id: 'lib_warrior', name: 'Гром Железный', race: 'dwarf', class: 'fighter', level: 1,
    background: 'Солдат', alignment: 'Законно-добрый',
    stats: { STR: 16, DEX: 12, CON: 14, INT: 10, WIS: 12, CHA: 8 },
    baseStats: { STR: 14, DEX: 12, CON: 12, INT: 10, WIS: 12, CHA: 8 },
    racialBonus: { STR: 2, CON: 2 },
    skills: [
      { skillId: 'athletics', proficient: true, expertise: false },
      { skillId: 'intimidation', proficient: true, expertise: false },
    ],
    savingThrows: { STR: true, CON: true },
    hitPoints: 12, maxHitPoints: 12, armorClass: 16, proficiencyBonus: 2, speed: 25,
    languages: ['Общий', 'Дварфийский'], features: ['Второе дыхание', 'Боевой стиль'],
    inventory: [{ id: 'i1', name: 'Длинный меч', quantity: 1, equipped: true }],
    experiencePoints: 0, characterSheet: 'Бывший солдат наёмной дружины.',
    createdAt: 0, updatedAt: 0, isLibrary: true,
  },
  {
    id: 'lib_wizard', name: 'Лирель Звёздная', race: 'elf', class: 'wizard', level: 1,
    background: 'Учёный', alignment: 'Нейтрально-добрый',
    stats: { STR: 8, DEX: 14, CON: 12, INT: 16, WIS: 12, CHA: 10 },
    baseStats: { STR: 8, DEX: 14, CON: 12, INT: 16, WIS: 12, CHA: 10 },
    racialBonus: { DEX: 2 },
    skills: [
      { skillId: 'arcana', proficient: true, expertise: false },
      { skillId: 'history', proficient: true, expertise: false },
    ],
    savingThrows: { INT: true, WIS: true },
    hitPoints: 8, maxHitPoints: 8, armorClass: 12, proficiencyBonus: 2, speed: 30,
    languages: ['Общий', 'Эльфийский'], features: ['Арканное восстановление', 'Заклинания'],
    inventory: [{ id: 'i2', name: 'Посох', quantity: 1, equipped: true }],
    experiencePoints: 0, characterSheet: 'Молодая волшебница из Академии.',
    createdAt: 0, updatedAt: 0, isLibrary: true,
  },
  {
    id: 'lib_rogue', name: 'Шэдоу', race: 'halfling', class: 'rogue', level: 1,
    background: 'Преступник', alignment: 'Хаотично-нейтральный',
    stats: { STR: 10, DEX: 17, CON: 12, INT: 14, WIS: 10, CHA: 8 },
    baseStats: { STR: 10, DEX: 17, CON: 12, INT: 14, WIS: 10, CHA: 8 },
    racialBonus: { DEX: 2 },
    skills: [
      { skillId: 'sleight_of_hand', proficient: true, expertise: false },
      { skillId: 'stealth', proficient: true, expertise: false },
      { skillId: 'deception', proficient: true, expertise: false },
    ],
    savingThrows: { DEX: true, INT: true },
    hitPoints: 9, maxHitPoints: 9, armorClass: 14, proficiencyBonus: 2, speed: 25,
    languages: ['Общий', 'Халфлингийский'], features: ['Скрытая атака', 'Воровской жаргон'],
    inventory: [{ id: 'i3', name: 'Короткий лук', quantity: 1, equipped: true }],
    experiencePoints: 0, characterSheet: 'Бывший шулер из портового города.',
    createdAt: 0, updatedAt: 0, isLibrary: true,
  },
  {
    id: 'lib_cleric', name: 'Брат Алдрик', race: 'human', class: 'cleric', level: 1,
    background: 'Жрец', alignment: 'Законно-добрый',
    stats: { STR: 12, DEX: 8, CON: 14, INT: 10, WIS: 16, CHA: 12 },
    baseStats: { STR: 12, DEX: 8, CON: 14, INT: 10, WIS: 16, CHA: 12 },
    racialBonus: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    skills: [
      { skillId: 'medicine', proficient: true, expertise: false },
      { skillId: 'religion', proficient: true, expertise: false },
    ],
    savingThrows: { WIS: true, CHA: true },
    hitPoints: 10, maxHitPoints: 10, armorClass: 16, proficiencyBonus: 2, speed: 30,
    languages: ['Общий', 'Эльфийский'], features: ['Божественная воля', 'Изгнание нежити'],
    inventory: [{ id: 'i4', name: 'Кольчуга', quantity: 1, equipped: true }],
    experiencePoints: 0, characterSheet: 'Послушник храма Солнца.',
    createdAt: 0, updatedAt: 0, isLibrary: true,
  },
];
