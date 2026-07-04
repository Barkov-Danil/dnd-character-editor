import { Character } from '../../shared/types/character.types';
import { Race, ClassInfo } from '../../shared/types/character.types';
import { ICharacterRepository } from '../../domain/repositories/ICharacterRepository';
import { IStorageAdapter, AsyncStorageAdapter } from '../database/StorageAdapter';

export class CharacterRepositoryImpl implements ICharacterRepository {
  private charactersKey = 'characters';
  private customRacesKey = 'customRaces';
  private customClassesKey = 'customClasses';

  constructor(private storage: IStorageAdapter = new AsyncStorageAdapter()) {}

  private async loadData<T>(key: string): Promise<T[]> {
    const data = await this.storage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private async saveData<T>(key: string, items: T[]): Promise<void> {
    await this.storage.setItem(key, JSON.stringify(items));
  }

  async save(character: Character): Promise<void> {
    const characters = await this.loadData<Character>(this.charactersKey);
    const index = characters.findIndex(c => c.id === character.id);
    
    if (index !== -1) {
      characters[index] = character;
    } else {
      characters.push(character);
    }
    
    await this.saveData(this.charactersKey, characters);
  }

  async load(id: string): Promise<Character | null> {
    const characters = await this.loadData<Character>(this.charactersKey);
    return characters.find(c => c.id === id) || null;
  }

  async loadAll(): Promise<Character[]> {
    return await this.loadData<Character>(this.charactersKey);
  }

  async delete(id: string): Promise<void> {
    const characters = await this.loadData<Character>(this.charactersKey);
    const filtered = characters.filter(c => c.id !== id);
    await this.saveData(this.charactersKey, filtered);
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

  async saveCustomRace(race: Race): Promise<void> {
    const races = await this.loadData<Race>(this.customRacesKey);
    const index = races.findIndex(r => r.id === race.id);
    
    if (index !== -1) {
      races[index] = race;
    } else {
      races.push(race);
    }
    
    await this.saveData(this.customRacesKey, races);
  }

  async loadCustomRaces(): Promise<Race[]> {
    return await this.loadData<Race>(this.customRacesKey);
  }

  async deleteCustomRace(id: string): Promise<void> {
    const races = await this.loadData<Race>(this.customRacesKey);
    const filtered = races.filter(r => r.id !== id);
    await this.saveData(this.customRacesKey, filtered);
  }

  async getCustomRace(id: string): Promise<Race | null> {
    const races = await this.loadData<Race>(this.customRacesKey);
    return races.find(r => r.id === id) || null;
  }

  async saveCustomClass(classInfo: ClassInfo): Promise<void> {
    const classes = await this.loadData<ClassInfo>(this.customClassesKey);
    const index = classes.findIndex(c => c.id === classInfo.id);
    
    if (index !== -1) {
      classes[index] = classInfo;
    } else {
      classes.push(classInfo);
    }
    
    await this.saveData(this.customClassesKey, classes);
  }

  async loadCustomClasses(): Promise<ClassInfo[]> {
    return await this.loadData<ClassInfo>(this.customClassesKey);
  }

  async deleteCustomClass(id: string): Promise<void> {
    const classes = await this.loadData<ClassInfo>(this.customClassesKey);
    const filtered = classes.filter(c => c.id !== id);
    await this.saveData(this.customClassesKey, filtered);
  }

  async getCustomClass(id: string): Promise<ClassInfo | null> {
    const classes = await this.loadData<ClassInfo>(this.customClassesKey);
    return classes.find(c => c.id === id) || null;
  }
}