import { Character } from '../../shared/types/character.types';
import { Race, ClassInfo } from '../../shared/types/character.types';

export interface ICharacterRepository {
  save(character: Character): Promise<void>;
  load(id: string): Promise<Character | null>;
  loadAll(): Promise<Character[]>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<Character>;

  saveCustomRace(race: Race): Promise<void>;
  loadCustomRaces(): Promise<Race[]>;
  deleteCustomRace(id: string): Promise<void>;
  getCustomRace(id: string): Promise<Race | null>;

  saveCustomClass(classInfo: ClassInfo): Promise<void>;
  loadCustomClasses(): Promise<ClassInfo[]>;
  deleteCustomClass(id: string): Promise<void>;
  getCustomClass(id: string): Promise<ClassInfo | null>;
}