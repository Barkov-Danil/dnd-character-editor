export type StatName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export const STAT_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
export type StatKey = typeof STAT_KEYS[number];

export const STAT_LABELS: Record<StatKey, string> = {
  STR: 'Сила',
  DEX: 'Ловкость',
  CON: 'Тел.',
  INT: 'Инт.',
  WIS: 'Мудрость',
  CHA: 'Харизма',
};

export interface CharacterStats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

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
  size: 'Small' | 'Medium';
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
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  equipped: boolean;
}

export interface BackgroundItem {
  name: string;
  quantity: number;
}

export interface Background {
  id: string;
  name: string;
  description: string;
  skillProficiencies: string[];
  items: BackgroundItem[];
  coins: Partial<Coins>;
  feature: string;
}

export interface CustomRace extends Race {
  isCustom: true;
}

export interface CustomClass extends ClassInfo {
  isCustom: true;
}

export interface CustomBackground extends Background {
  isCustom: true;
}

export interface Armor {
  id: string;
  name: string;
  kind: 'none' | 'light' | 'medium' | 'heavy';
  baseAC: number;
  dexCap: number | null;
  description: string;
  cost: { pp?: number; gp?: number; sp?: number; cp?: number };
  weight: number;
  strengthRequired?: number;
  stealthDisadvantage?: boolean;
}

export interface Shield {
  id: string;
  name: string;
  bonus: number;
  description: string;
  cost: { gp: number };
  weight: number;
  strengthRequired?: number;
}

export interface Coins {
  pp: number;
  gp: number;
  sp: number;
  cp: number;
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  subClass?: string;
  level: number;
  background: string;
  backgroundId?: string;
  alignment: string;
  stats: CharacterStats;
  baseStats: CharacterStats;
  racialBonus: Partial<CharacterStats>;
  skills: SkillProficiency[];
  savingThrows: { [key: string]: boolean };
  hitPoints: number;
  maxHitPoints: number;
  armorClass: number;
  armorId: string;
  hasShield: boolean;
  proficiencyBonus: number;
  speed: number;
  languages: string[];
  features: string[];
  inventory: InventoryItem[];
  coins: Coins;
  seenLevel?: number;
  experiencePoints: number;
  backstory: string;
  characterSheet: string;
  isLibrary: boolean;
  customRace?: CustomRace;
  customClass?: CustomClass;
  customBackground?: CustomBackground;
  createdAt: number;
  updatedAt: number;
}

export interface WizardState {
  currentStep: number;
  selectedRace: string | null;
  selectedRaceObject: Race | null;
  selectedClass: string | null;
  selectedClassObject: ClassInfo | null;
  selectedBackgroundId: string | null;
  selectedBackgroundObject: Background | null;
  stats: CharacterStats | null;
  selectedSkills: SkillProficiency[];
  characterName: string;
  characterBackground: string;
  characterAlignment: string;
  backstory: string;
  characterSheet: string;
  customRaces: CustomRace[];
  customClasses: CustomClass[];
  customBackgrounds: CustomBackground[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}