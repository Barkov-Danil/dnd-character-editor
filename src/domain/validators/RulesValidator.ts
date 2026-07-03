import { Character, ValidationResult } from '../../shared/types/character.types';
import { CLASSES } from '../../shared/constants/classes';
import { RACES } from '../../shared/constants/races';
import { StatGenerator } from '../rules/StatGenerator';

export class RulesValidator {
  private statGenerator = new StatGenerator();

  validate(character: Character): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!character.race || !RACES[character.race]) {
      errors.push('Раса не выбрана или не существует');
    }

    if (!character.class || !CLASSES[character.class]) {
      errors.push('Класс не выбран или не существует');
    }

    if (!character.name || character.name.trim().length === 0) {
      errors.push('Имя персонажа обязательно');
    }

    if (character.level < 1 || character.level > 20) {
      errors.push('Уровень должен быть от 1 до 20');
    }

    const stats = Object.values(character.stats);
    if (stats.some(s => s < 1 || s > 20)) {
      errors.push('Все характеристики должны быть от 1 до 20');
    }

    const classInfo = CLASSES[character.class];
    if (classInfo) {
      const skillCount = character.skills.filter(s => s.proficient).length;
      if (skillCount !== classInfo.skillChoices) {
        errors.push(
          `Должно быть выбрано ${classInfo.skillChoices} навыков ` +
          `(выбрано ${skillCount})`
        );
      }
    }

    const classInfoForWarnings = CLASSES[character.class];
    if (classInfoForWarnings) {
      const expectedHP = this.calculateHP(character);
      if (character.hitPoints !== expectedHP) {
        warnings.push(`HP должно быть ${expectedHP} (сейчас ${character.hitPoints})`);
      }

      const expectedProfBonus = this.getProficiencyBonus(character.level);
      if (character.proficiencyBonus !== expectedProfBonus) {
        warnings.push(
          `Бонус владения должен быть ${expectedProfBonus} ` +
          `для уровня ${character.level} (сейчас ${character.proficiencyBonus})`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  calculateHP(character: Character): number {
    const classInfo = CLASSES[character.class];
    if (!classInfo) return 10;
    
    const conMod = this.statGenerator.getModifier(character.stats.CON);
    
    if (character.level === 1) {
      return classInfo.hitDie + conMod;
    }
    
    const firstLevel = classInfo.hitDie + conMod;
    const otherLevels = (character.level - 1) * (Math.floor(classInfo.hitDie / 2) + 1 + conMod);
    
    return firstLevel + otherLevels;
  }

  getProficiencyBonus(level: number): number {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
  }
}