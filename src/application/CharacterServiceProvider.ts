import { CharacterService } from './useCases/CharacterService';
import { CharacterRepositoryImpl } from '../infrastructure/database/CharacterRepositoryImpl';
import { AsyncStorageAdapter } from '../infrastructure/database/StorageAdapter';
import { ServerCharacterRepository } from '../infrastructure/database/ServerCharacterRepository';
import { RulesValidator } from '../domain/validators/RulesValidator';

const localRepo = new CharacterRepositoryImpl(new AsyncStorageAdapter());
const localValidator = new RulesValidator();
const localService = new CharacterService(localRepo, localValidator);

let serverService: CharacterService | null = null;
let serverRepo: ServerCharacterRepository | null = null;

export function initServerService(getToken: () => string | null | Promise<string | null>) {
  serverRepo = new ServerCharacterRepository(getToken);
  serverService = new CharacterService(serverRepo, localValidator);
}

export function getCharacterService(): CharacterService {
  if (serverService && serverRepo) return serverService;
  return localService;
}

export function isServerMode(): boolean {
  return serverService !== null;
}
