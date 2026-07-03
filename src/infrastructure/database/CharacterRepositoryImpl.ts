import { Character } from '../../shared/types/character.types';
import { ICharacterRepository } from '../../domain/repositories/ICharacterRepository';
import { CharacterSerializer } from '../serializers/CharacterSerializer';
import { StorageAdapter } from '../database/StorageAdapter';

export class CharacterRepositoryImpl implements ICharacterRepository {
  private serializer = new CharacterSerializer();
  private storage = new StorageAdapter();

  async save(character: Character): Promise<void> {
    const characters = await this.loadAll();
    const index = characters.findIndex(c => c.id === character.id);
    
    if (index !== -1) {
      characters[index] = character;
    } else {
      characters.push(character);
    }
    
    const json = this.serializer.serializeMany(characters);
    await this.storage.saveData(json);
  }

  async load(id: string): Promise<Character | null> {
    const characters = await this.loadAll();
    return characters.find(c => c.id === id) || null;
  }

  async loadAll(): Promise<Character[]> {
    const json = await this.storage.loadData();
    if (!json) return [];
    return this.serializer.deserializeMany(json);
  }

  async delete(id: string): Promise<void> {
    const characters = await this.loadAll();
    const filtered = characters.filter(c => c.id !== id);
    const json = this.serializer.serializeMany(filtered);
    await this.storage.saveData(json);
  }

  async duplicate(id: string): Promise<Character> {
    const character = await this.load(id);
    if (!character) throw new Error(`Персонаж с ID ${id} не найден`);
    
    const copy: Character = {
      ...character,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: `${character.name} (копия)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await this.save(copy);
    return copy;
  }
}