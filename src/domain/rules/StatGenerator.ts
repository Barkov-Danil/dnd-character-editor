import { CharacterStats } from '../../shared/types/character.types';
import { DiceRoller } from './DiceRoller';

export class StatGenerator {
  private dice = new DiceRoller();

  getModifier(stat: number): number {
    return Math.floor((stat - 10) / 2);
  }

  generateStandardArray(): CharacterStats {
    return { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 };
  }

  generateRandom(): CharacterStats {
    const statKeys: (keyof CharacterStats)[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    const values = Array.from({ length: 6 }, () => this.dice.roll4d6DropLowest())
      .sort((a, b) => b - a);
    
    const stats: CharacterStats = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    statKeys.forEach((key, index) => {
      stats[key] = values[index] || 10;
    });
    
    return stats;
  }

  applyRacialBonus(base: CharacterStats, bonus: Partial<CharacterStats>): CharacterStats {
    const result = { ...base };
    const keys: (keyof CharacterStats)[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    keys.forEach(key => {
      if (bonus[key] !== undefined) {
        result[key] = (result[key] || 0) + (bonus[key] || 0);
      }
    });
    return result;
  }
}