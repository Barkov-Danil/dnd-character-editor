import type { Character, CharacterStats } from '../types';
import { STAT_KEYS } from '../types';

export function calculateModifier(statValue: number): number {
  return Math.floor((statValue - 10) / 2);
}

export function formatModifier(statValue: number): string {
  const mod = calculateModifier(statValue);
  return mod >= 0 ? `+${mod}` : String(mod);
}

export function calculateHP(hitDie: number, level: number, conBonus: number): number {
  const avgRoll = Math.floor(hitDie / 2) + 1;
  return hitDie + conBonus + (level - 1) * (avgRoll + conBonus);
}

export function calculateAC(dexBonus: number): number {
  return 10 + dexBonus;
}

export function proficiencyBonusFor(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function validateCharacter(character: Character, skillPool: string[], skillChoices: number): string[] {
  const errors: string[] = [];

  for (const key of STAT_KEYS) {
    const value = character.stats[key];
    if (value < 8) errors.push(`Характеристика ${key} ниже 8 (${value})`);
    if (value > 20) errors.push(`Характеристика ${key} выше 20 (${value})`);
  }

  const proficientSkills = character.skills
    .filter((s) => s.proficient)
    .map((s) => s.skillId);

  if (proficientSkills.length !== skillChoices) {
    errors.push(`Выбрано ${proficientSkills.length} навыков, нужно ${skillChoices}`);
  }

  for (const skill of proficientSkills) {
    if (!skillPool.includes(skill)) errors.push(`Навык ${skill} недоступен для этого класса`);
  }

  if (character.level < 1 || character.level > 20) {
    errors.push(`Уровень должен быть от 1 до 20 (сейчас ${character.level})`);
  }

  return errors;
}

export type { CharacterStats };
