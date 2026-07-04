import { Character, Race, ClassInfo } from '../../shared/types/character.types';
import { ICharacterRepository } from '../../domain/repositories/ICharacterRepository';

// Для Android эмулятора: http://10.0.2.2:3001
// Для реального устройства: http://<IP сервера>:3001
const API_BASE = 'http://localhost:3001';

async function api(method: string, path: string, body?: unknown, token?: string | null) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export class ServerCharacterRepository implements ICharacterRepository {
  constructor(private getToken: () => string | null | Promise<string | null>) {}

  private async token() { return this.getToken(); }

  async save(character: Character): Promise<void> {
    await api('POST', '/api/characters', character, await this.token());
  }

  async load(id: string): Promise<Character | null> {
    const all = await this.loadAll();
    return all.find((c) => c.id === id) ?? null;
  }

  async loadAll(): Promise<Character[]> {
    const data = await api('GET', '/api/characters', undefined, await this.token());
    return data.characters as Character[];
  }

  async delete(id: string): Promise<void> {
    await api('DELETE', `/api/characters/${id}`, undefined, await this.token());
  }

  async duplicate(id: string): Promise<Character> {
    const original = await this.load(id);
    if (!original) throw new Error('Character not found');
    const copy: Character = {
      ...original,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: `${original.name} (копия)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.save(copy);
    return copy;
  }

  async saveCustomRace(_race: Race): Promise<void> {}
  async loadCustomRaces(): Promise<Race[]> { return []; }
  async deleteCustomRace(_id: string): Promise<void> {}
  async getCustomRace(_id: string): Promise<Race | null> { return null; }
  async saveCustomClass(_class: ClassInfo): Promise<void> {}
  async loadCustomClasses(): Promise<ClassInfo[]> { return []; }
  async deleteCustomClass(_id: string): Promise<void> {}
  async getCustomClass(_id: string): Promise<ClassInfo | null> { return null; }
}
