import { Character } from '../../shared/types/character.types';

export class CharacterSerializer {
  serialize(character: Character): string {
    return JSON.stringify(character);
  }

  deserialize(json: string): Character {
    const data = JSON.parse(json);
    return data as Character;
  }

  serializeMany(characters: Character[]): string {
    return JSON.stringify(characters);
  }

  deserializeMany(json: string): Character[] {
    const data = JSON.parse(json);
    return data as Character[];
  }
}