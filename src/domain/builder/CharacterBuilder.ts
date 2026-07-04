import { Character, CharacterStats } from '../../shared/types/character.types';
import { RACES } from '../../shared/constants/races';
import { CLASSES } from '../../shared/constants/classes';
import { SKILLS } from '../../shared/constants/skills';
import { StatGenerator } from '../rules/StatGenerator';
import { RulesValidator } from '../validators/RulesValidator';
import { BackgroundGenerator } from '../services/BackgroundGenerator';

export class CharacterBuilder {
  private character: Partial<Character> = {};
  private statGenerator = new StatGenerator();
  private validator = new RulesValidator();
  private backgroundGenerator = new BackgroundGenerator();

  selectRace(raceId: string): this {
    const race = RACES[raceId];
    if (!race) throw new Error(`Раса "${raceId}" не найдена`);
    
    this.character.race = raceId;
    this.character.speed = race.speed;
    this.character.languages = [...race.languages];
    this.character.racialBonus = race.abilityBonuses;
    
    return this;
  }

  selectClass(classId: string): this {
    const classInfo = CLASSES[classId];
    if (!classInfo) throw new Error(`Класс "${classId}" не найден`);
    
    this.character.class = classId;
    this.character.proficiencyBonus = 2;
    
    return this;
  }

  generateStats(method: 'standard' | 'random'): this {
    let stats: CharacterStats;
    
    if (method === 'standard') {
      stats = this.statGenerator.generateStandardArray();
    } else {
      stats = this.statGenerator.generateRandom();
    }
    
    const race = RACES[this.character.race!];
    const finalStats = this.statGenerator.applyRacialBonus(stats, race.abilityBonuses);
    
    this.character.baseStats = stats;
    this.character.stats = finalStats;
    
    return this;
  }

  setStatsManually(stats: CharacterStats): this {
    const race = RACES[this.character.race!];
    if (!race) {
      this.character.baseStats = stats;
      this.character.stats = stats;
      return this;
    }
    
    const finalStats = this.statGenerator.applyRacialBonus(stats, race.abilityBonuses);
    this.character.baseStats = stats;
    this.character.stats = finalStats;
    
    return this;
  }

  selectSkills(skillIds: string[]): this {
    const classInfo = CLASSES[this.character.class!];
    if (!classInfo) throw new Error('Сначала выберите класс');
    
    if (skillIds.length !== classInfo.skillChoices) {
      throw new Error(
        `Должно быть выбрано ${classInfo.skillChoices} навыков, выбрано ${skillIds.length}`
      );
    }
    
    for (const skillId of skillIds) {
      if (!SKILLS[skillId]) {
        throw new Error(`Навык "${skillId}" не существует`);
      }
      else if (!classInfo.skillPool.includes(skillId)) {
        throw new Error(`Навык "${skillId}" недоступен для класса ${classInfo.name}`);
      }
    }
    
    this.character.skills = skillIds.map(id => ({
      skillId: id,
      proficient: true,
      expertise: false
    }));
    
    return this;
  }

  fillDetails(details: {
    name: string;
    background?: string;
    alignment?: string;
    characterSheet?: string;
    level?: number;
  }): this {
    this.character.name = details.name;
    this.character.background = details.background || '';
    this.character.alignment = details.alignment || 'Нейтральный';
    this.character.characterSheet = details.characterSheet || '';
    this.character.level = details.level || 1;
    
    return this;
  }

  calculateDerivedStats(): this {
    const classInfo = CLASSES[this.character.class!];
    const stats = this.character.stats!;
    const level = this.character.level || 1;
    
    this.character.hitPoints = this.validator.calculateHP({
      ...this.character,
      stats,
      level
    } as Character);
    this.character.maxHitPoints = this.character.hitPoints;
    
    const dexMod = this.statGenerator.getModifier(stats.DEX);
    this.character.armorClass = 10 + dexMod;
    
    this.character.proficiencyBonus = this.validator.getProficiencyBonus(level);
    
    if (classInfo) {
      this.character.savingThrows = {};
      classInfo.savingThrows.forEach(stat => {
        this.character.savingThrows![stat] = true;
      });
    }
    
    return this;
  }

  build(): Character {
    if (!this.character.race) throw new Error('Раса не выбрана');
    if (!this.character.class) throw new Error('Класс не выбран');
    if (!this.character.stats) throw new Error('Характеристики не сгенерированы');
    if (!this.character.name) throw new Error('Имя не заполнено');
    
    if (!this.character.skills || this.character.skills.length === 0) {
      throw new Error('Навыки не выбраны');
    }
    
    const character: Character = {
      id: this.character.id || this.generateId(),
      name: this.character.name,
      race: this.character.race,
      class: this.character.class,
      subClass: this.character.subClass || '',
      level: this.character.level || 1,
      background: this.character.background || '',
      backgroundId: this.character.backgroundId || '',
      alignment: this.character.alignment || 'Нейтральный',
      stats: this.character.stats,
      baseStats: this.character.baseStats || this.character.stats,
      racialBonus: this.character.racialBonus || {},
      skills: this.character.skills,
      savingThrows: this.character.savingThrows || {},
      hitPoints: this.character.hitPoints || 10,
      maxHitPoints: this.character.maxHitPoints || 10,
      armorClass: this.character.armorClass || 10,
      armorId: this.character.armorId || 'none',
      hasShield: this.character.hasShield || false,
      proficiencyBonus: this.character.proficiencyBonus || 2,
      speed: this.character.speed || 30,
      languages: this.character.languages || ['Common'],
      features: this.character.features || [],
      inventory: this.character.inventory || [],
      coins: this.character.coins || { pp: 0, gp: 0, sp: 0, cp: 0 },
      experiencePoints: this.character.experiencePoints || 0,
      backstory: this.character.backstory || '',
      characterSheet: this.character.characterSheet || '',
      isLibrary: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const result = this.validator.validate(character);
    if (!result.valid) {
      throw new Error(`Персонаж невалиден: ${result.errors.join(', ')}`);
    }

    if (!this.character.characterSheet || this.character.characterSheet.length === 0) {
      const tempCharacter = { ...this.character } as Character;
      tempCharacter.stats = this.character.stats!;
      tempCharacter.race = this.character.race!;
      tempCharacter.class = this.character.class!;
      
      try {
        this.character.characterSheet = this.backgroundGenerator.generateOnly(tempCharacter);
      } catch (error) {
        console.warn('Не удалось сгенерировать историю:', error);
        this.character.characterSheet = 'История этого героя ждёт своего рассказчика...';
      }
    }
    
    return character;
  }

  reset(): this {
    this.character = {};
    return this;
  }

  getState(): Partial<Character> {
    return { ...this.character };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  generateBackground(): this {
    if (!this.character.name) {
      throw new Error('Сначала заполните имя персонажа');
    }
    
    const tempCharacter = this.build();
    const background = this.backgroundGenerator.generateOnly(tempCharacter);
    this.character.characterSheet = background;
    
    return this;
  }

  setBackgroundManually(text: string): this {
    this.character.characterSheet = text;
    return this;
  }
}