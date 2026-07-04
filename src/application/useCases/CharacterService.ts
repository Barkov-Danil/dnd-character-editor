import { Character, Race, ClassInfo } from '../../shared/types/character.types';
import { ICharacterRepository } from '../../domain/repositories/ICharacterRepository';
import { RulesValidator } from '../../domain/validators/RulesValidator';
import { LIBRARY_CHARACTERS } from '../../shared/constants/library';
import { RACES } from '../../shared/constants/races';
import { CLASSES } from '../../shared/constants/classes';
import { BackgroundGenerator } from '../../domain/services/BackgroundGenerator';

export class CharacterService {
  private backgroundGenerator = new BackgroundGenerator();

  constructor(
    private repository: ICharacterRepository,
    private validator: RulesValidator
  ) {}

  async saveCharacter(character: Character): Promise<void> {
    const result = this.validator.validate(character);
    if (!result.valid) {
      throw new Error(`Невалидный персонаж: ${result.errors.join(', ')}`);
    }

    character.updatedAt = Date.now();

    await this.repository.save(character);
  }

  async loadCharacter(id: string): Promise<Character | null> {
    return await this.repository.load(id);
  }

  async loadAllCharacters(): Promise<Character[]> {
    return await this.repository.loadAll();
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async duplicateCharacter(id: string): Promise<Character> {
    return await this.repository.duplicate(id);
  }

  async exportCharacter(id: string): Promise<string> {
    const character = await this.repository.load(id);
    if (!character) throw new Error('Персонаж не найден');
    return JSON.stringify(character, null, 2);
  }

  async importCharacter(json: string): Promise<Character> {
    const character = JSON.parse(json) as Character;
    
    character.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    character.createdAt = Date.now();
    character.updatedAt = Date.now();
    
    await this.saveCharacter(character);
    return character;
  }

  getLibraryCharacters(): Character[] {
    return LIBRARY_CHARACTERS;
  }

  async loadLibraryCharacter(id: string): Promise<Character> {
    const libraryChar = LIBRARY_CHARACTERS.find(c => c.id === id);
    if (!libraryChar) {
      throw new Error('Библиотечный персонаж не найден');
    }
    
    const character: Character = {
      ...libraryChar,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: `${libraryChar.name} (копия)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await this.saveCharacter(character);
    return character;
  }

  async clearAllCharacters(): Promise<void> {
    const characters = await this.loadAllCharacters();
    for (const char of characters) {
      await this.deleteCharacter(char.id);
    }
  }

  async countCharacters(): Promise<number> {
    const characters = await this.loadAllCharacters();
    return characters.length;
  }

  async searchCharacters(query: string): Promise<Character[]> {
    const characters = await this.loadAllCharacters();
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return characters;
    
    return characters.filter(char => 
      char.name.toLowerCase().includes(lowerQuery) ||
      char.race.toLowerCase().includes(lowerQuery) ||
      char.class.toLowerCase().includes(lowerQuery)
    );
  }

  async getCharactersByClass(classId: string): Promise<Character[]> {
    const characters = await this.loadAllCharacters();
    return characters.filter(char => char.class === classId);
  }

  async getCharactersByRace(raceId: string): Promise<Character[]> {
    const characters = await this.loadAllCharacters();
    return characters.filter(char => char.race === raceId);
  }

  async generateBackgroundForCharacter(id: string): Promise<Character> {
    const character = await this.repository.load(id);
    if (!character) throw new Error('Персонаж не найден');
    
    const updated = this.backgroundGenerator.generateAndAttach(character);
    await this.saveCharacter(updated);
    return updated;
  }

  generateBackgroundWithoutSave(character: Character): string {
    return this.backgroundGenerator.generateOnly(character);
  }

  async saveCustomRace(race: Race): Promise<void> {
    await this.repository.saveCustomRace(race);
  }

  async loadCustomRaces(): Promise<Race[]> {
    return await this.repository.loadCustomRaces();
  }

  async deleteCustomRace(id: string): Promise<void> {
    await this.repository.deleteCustomRace(id);
  }

  async getCustomRace(id: string): Promise<Race | null> {
    return await this.repository.getCustomRace(id);
  }

  async saveCustomClass(classInfo: ClassInfo): Promise<void> {
    await this.repository.saveCustomClass(classInfo);
  }

  async loadCustomClasses(): Promise<ClassInfo[]> {
    return await this.repository.loadCustomClasses();
  }

  async deleteCustomClass(id: string): Promise<void> {
    await this.repository.deleteCustomClass(id);
  }

  async getCustomClass(id: string): Promise<ClassInfo | null> {
    return await this.repository.getCustomClass(id);
  }

  async getAllRaces(): Promise<Race[]> {
    const customRaces = await this.repository.loadCustomRaces();
    const standardRaces = Object.values(RACES);
    return [...standardRaces, ...customRaces];
  }

  async getAllClasses(): Promise<ClassInfo[]> {
    const customClasses = await this.repository.loadCustomClasses();
    const standardClasses = Object.values(CLASSES);
    return [...standardClasses, ...customClasses];
  }

  async getRace(id: string): Promise<Race | null> {
    if (RACES[id]) return RACES[id];
    return await this.repository.getCustomRace(id);
  }

  async getClass(id: string): Promise<ClassInfo | null> {
    if (CLASSES[id]) return CLASSES[id];
    return await this.repository.getCustomClass(id);
  }

  validateCustomRace(race: Partial<Race>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!race.id) errors.push('ID расы обязателен');
    if (!race.name || race.name.length < 1) errors.push('Название расы обязательно');
    if (!race.speed || race.speed < 0) errors.push('Скорость должна быть положительным числом');
    if (!race.size || !['Small', 'Medium'].includes(race.size)) {
      errors.push('Размер должен быть Small или Medium');
    }
    
    return { valid: errors.length === 0, errors };
  }

  validateCustomClass(classInfo: Partial<ClassInfo>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!classInfo.id) errors.push('ID класса обязателен');
    if (!classInfo.name || classInfo.name.length < 1) errors.push('Название класса обязательно');
    if (!classInfo.hitDie || ![6, 8, 10, 12].includes(classInfo.hitDie)) {
      errors.push('Кость хитов должна быть 6, 8, 10 или 12');
    }
    if (!classInfo.primaryStat) errors.push('Основная характеристика обязательна');
    
    return { valid: errors.length === 0, errors };
  }

  async exportCustomData(): Promise<string> {
    const races = await this.repository.loadCustomRaces();
    const classes = await this.repository.loadCustomClasses();
    
    return JSON.stringify({
      version: '1.0',
      exportedAt: Date.now(),
      customRaces: races,
      customClasses: classes
    }, null, 2);
  }

  async importCustomData(json: string): Promise<{ races: number; classes: number }> {
    const data = JSON.parse(json);
    
    if (!data.customRaces && !data.customClasses) {
      throw new Error('Некорректный формат данных');
    }
    
    let raceCount = 0;
    let classCount = 0;
    
    if (data.customRaces && Array.isArray(data.customRaces)) {
      for (const race of data.customRaces) {
        await this.repository.saveCustomRace(race);
        raceCount++;
      }
    }
    
    if (data.customClasses && Array.isArray(data.customClasses)) {
      for (const classInfo of data.customClasses) {
        await this.repository.saveCustomClass(classInfo);
        classCount++;
      }
    }
    
    return { races: raceCount, classes: classCount };
  }
}