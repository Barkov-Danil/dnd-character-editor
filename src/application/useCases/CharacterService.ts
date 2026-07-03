import { Character } from '../../shared/types/character.types';
import { ICharacterRepository } from '../../domain/repositories/ICharacterRepository';
import { RulesValidator } from '../../domain/validators/RulesValidator';
import { LIBRARY_CHARACTERS } from '../../shared/constants/library';

export class CharacterService {
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
}