import { ClassInfo } from '../types/character.types';

export const CLASSES: Record<string, ClassInfo> = {
  fighter: {
    id: 'fighter',
    name: 'Воин',
    hitDie: 10,
    primaryStat: 'STR',
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['Лёгкая', 'Средняя', 'Тяжёлая', 'Щиты'],
    weaponProficiencies: ['Простое', 'Воинское'],
    skillChoices: 2,
    skillPool: ['acrobatics', 'animal_handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    featuresByLevel: {
      1: ['Боевой стиль', 'Второе дыхание'],
      2: ['Порыв действия'],
      3: ['Архетип воина'],
    },
    subClasses: [
      { id: 'champion', name: 'Чемпион', levelUnlock: 3, featuresByLevel: { 3: ['Улучшенный критический удар'], 7: ['Замечательный атлет'] } },
      { id: 'battle_master', name: 'Мастер боя', levelUnlock: 3, featuresByLevel: { 3: ['Манёвры'], 7: ['Тактическое превосходство'] } },
    ],
  },
  wizard: {
    id: 'wizard',
    name: 'Волшебник',
    hitDie: 6,
    primaryStat: 'INT',
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: [],
    weaponProficiencies: ['Кинжалы', 'Дротики', 'Пращи', 'Посохи', 'Арбалеты'],
    skillChoices: 2,
    skillPool: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
    featuresByLevel: {
      1: ['Заклинания', 'Магическое восстановление'],
      2: ['Традиция магии'],
    },
    spellcaster: 'full',
    subClasses: [
      { id: 'evocation', name: 'Школа воплощения', levelUnlock: 2, featuresByLevel: { 2: ['Воплощение'], 6: ['Могущественное заклинание'] } },
      { id: 'abjuration', name: 'Школа ограждения', levelUnlock: 2, featuresByLevel: { 2: ['Магический щит'], 6: ['Проект'] } },
    ],
  },
  rogue: {
    id: 'rogue',
    name: 'Плут',
    hitDie: 8,
    primaryStat: 'DEX',
    savingThrows: ['DEX', 'INT'],
    armorProficiencies: ['Лёгкая'],
    weaponProficiencies: ['Простое', 'Арбалеты', 'Длинные мечи', 'Рапиры', 'Короткие мечи'],
    skillChoices: 4,
    skillPool: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight_of_hand', 'stealth'],
    featuresByLevel: {
      1: ['Скрытая атака', 'Знание языка'],
      2: ['Ловкие руки'],
      3: ['Архетип плута'],
    },
    subClasses: [
      { id: 'thief', name: 'Вор', levelUnlock: 3, featuresByLevel: { 3: ['Быстрые руки'], 9: ['Надёжность'] } },
      { id: 'assassin', name: 'Убийца', levelUnlock: 3, featuresByLevel: { 3: ['Имитация'], 9: ['Отравление'] } },
    ],
  },
  cleric: {
    id: 'cleric',
    name: 'Жрец',
    hitDie: 8,
    primaryStat: 'WIS',
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Лёгкая', 'Средняя', 'Щиты'],
    weaponProficiencies: ['Простое'],
    skillChoices: 2,
    skillPool: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    featuresByLevel: {
      1: ['Божественное вдохновение', 'Священный символ'],
      2: ['Канал божественной энергии'],
    },
    spellcaster: 'full',
    subClasses: [
      { id: 'life', name: 'Домен жизни', levelUnlock: 1, featuresByLevel: { 1: ['Бонусные заклинания'], 2: ['Канал божественной энергии'] } },
      { id: 'light', name: 'Домен света', levelUnlock: 1, featuresByLevel: { 1: ['Бонусные заклинания'], 2: ['Канал божественной энергии'] } },
    ],
  },
};