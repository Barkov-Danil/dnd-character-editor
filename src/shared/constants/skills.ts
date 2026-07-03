import { StatName } from '../types/character.types';

export const SKILLS: Record<string, { name: string; stat: StatName }> = {
  acrobatics: { name: 'Акробатика', stat: 'DEX' },
  animal_handling: { name: 'Уход за животными', stat: 'WIS' },
  arcana: { name: 'Магия', stat: 'INT' },
  athletics: { name: 'Атлетика', stat: 'STR' },
  deception: { name: 'Обман', stat: 'CHA' },
  history: { name: 'История', stat: 'INT' },
  insight: { name: 'Проницательность', stat: 'WIS' },
  intimidation: { name: 'Запугивание', stat: 'CHA' },
  investigation: { name: 'Расследование', stat: 'INT' },
  medicine: { name: 'Медицина', stat: 'WIS' },
  nature: { name: 'Природа', stat: 'INT' },
  perception: { name: 'Восприятие', stat: 'WIS' },
  performance: { name: 'Выступление', stat: 'CHA' },
  persuasion: { name: 'Убеждение', stat: 'CHA' },
  religion: { name: 'Религия', stat: 'INT' },
  sleight_of_hand: { name: 'Ловкость рук', stat: 'DEX' },
  stealth: { name: 'Скрытность', stat: 'DEX' },
  survival: { name: 'Выживание', stat: 'WIS' },
};