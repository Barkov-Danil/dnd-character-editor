import { Character } from '../../shared/types/character.types';

export interface ICharacterRepository {
  save(character: Character): Promise<void>;
  load(id: string): Promise<Character | null>;
  loadAll(): Promise<Character[]>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<Character>;
}