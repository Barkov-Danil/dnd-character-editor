import type { CharacterStats } from '../types';
import { STAT_KEYS } from '../types';
import { STANDARD_ARRAY } from './gameData';

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function rollStat(): number {
  const rolls = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)];
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

export function generateRandomStats(): CharacterStats {
  const stats = {} as CharacterStats;
  for (const key of STAT_KEYS) {
    stats[key] = rollStat();
  }
  return stats;
}

export function generateStandardArray(): CharacterStats {
  return { ...STANDARD_ARRAY };
}
