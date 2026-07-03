export interface CharacterStats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export const STAT_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
export type StatKey = typeof STAT_KEYS[number];

export const STAT_LABELS: Record<StatKey, string> = {
  STR: 'Сила',
  DEX: 'Ловкость',
  CON: 'Телосложение',
  INT: 'Интеллект',
  WIS: 'Мудрость',
  CHA: 'Харизма',
};

export interface SkillProficiency {
  skillId: string;
  proficient: boolean;
  expertise: boolean;
}

export interface SubRace {
  id: string;
  name: string;
  abilityBonuses: Partial<CharacterStats>;
  traits: string[];
}

export interface Race {
  id: string;
  name: string;
  description: string;
  abilityBonuses: Partial<CharacterStats>;
  speed: number;
  size: string;
  languages: string[];
  traits: string[];
  subRaces?: SubRace[];
}

export interface SpellSlot {
  level: number;
  used: number;
  total: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  primaryStat: string;
  savingThrows: StatKey[];
  skillPool: string[];
  skillChoices: number;
  armorProficiencies: string[];
  weaponProficiencies: string[];
  featuresByLevel: Record<number, string[]>;
  spellcaster: 'none' | 'half' | 'full';
  spellSlots?: SpellSlot[];
  subClasses: string[];
}

export interface SkillInfo {
  id: string;
  name: string;
  stat: StatKey;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  equipped: boolean;
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  subClass?: string;
  level: number;
  background: string;
  alignment: string;
  stats: CharacterStats;
  baseStats: CharacterStats;
  racialBonus: Partial<CharacterStats>;
  skills: SkillProficiency[];
  savingThrows: { [key: string]: boolean };
  hitPoints: number;
  maxHitPoints: number;
  armorClass: number;
  proficiencyBonus: number;
  speed: number;
  languages: string[];
  features: string[];
  inventory: InventoryItem[];
  experiencePoints: number;
  characterSheet: string;
  isLibrary: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface WizardState {
  currentStep: number;
  selectedRace: string | null;
  selectedRaceObject: Race | null;
  selectedClass: string | null;
  selectedClassObject: ClassInfo | null;
  stats: CharacterStats | null;
  selectedSkills: SkillProficiency[];
  characterName: string;
  characterBackground: string;
  characterAlignment: string;
}
