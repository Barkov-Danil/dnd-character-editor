export type StatName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

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
  experiencePoints: number;
  characterSheet: string;
  createdAt: number;
  updatedAt: number;
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

export interface SubRace {
  id: string;
  name: string;
  abilityBonuses: Partial<CharacterStats>;
  traits: string[];
}

export interface ClassInfo {
  id: string;
  name: string;
  hitDie: number; // 6, 8, 10, 12
  primaryStat: StatName;
  savingThrows: [StatName, StatName];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  skillChoices: number;
  skillPool: string[];
  featuresByLevel: { [level: number]: string[] };
  spellcaster?: 'full' | 'half' | 'third' | 'pact' | 'none';
  subClasses: SubClass[];
}

export interface SubClass {
  id: string;
  name: string;
  levelUnlock: number;
  featuresByLevel: { [level: number]: string[] };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}