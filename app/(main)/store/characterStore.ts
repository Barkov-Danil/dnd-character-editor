import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Character, CharacterStats, Race, ClassInfo, SkillProficiency, WizardState, Background, CustomRace, CustomClass, CustomBackground } from '../types';
import { RACES, CHARACTER_CLASSES, BACKGROUNDS } from '../utils/gameData';
import { getCharacterService } from '../../../src/application/CharacterServiceProvider';

type WizardStats = CharacterStats | null;

interface CharacterStore extends WizardState {
  savedCharacters: Character[];
  libraryCharacters: Character[];
  currentCharacterId: string | null;
  setCurrentCharacterId: (id: string | null) => void;
  setSavedCharacters: (chars: Character[]) => void;
  setLibraryCharacters: (chars: Character[]) => void;
  addCharacter: (char: Character) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  updateCharacter: (id: string, data: Partial<Character>) => Promise<void>;
  loadSavedCharacters: () => Promise<void>;
  loadLibraryCharacters: () => void;
  setWizardStep: (step: number) => void;
  setSelectedRace: (raceId: string) => void;
  setSelectedRaceObject: (race: Race | null) => void;
  setSelectedClass: (classId: string) => void;
  setSelectedClassObject: (cls: ClassInfo | null) => void;
  setSelectedBackground: (bgId: string) => void;
  addCustomRace: (race: CustomRace) => void;
  addCustomClass: (cls: CustomClass) => void;
  addCustomBackground: (bg: CustomBackground) => void;
  setStats: (stats: WizardStats) => void;
  setSelectedSkills: (skills: SkillProficiency[]) => void;
  setCharacterName: (name: string) => void;
  setCharacterSheet: (sheet: string) => void;
  setBackstory: (story: string) => void;
  setCharacterBackground: (bg: string) => void;
  setCharacterAlignment: (alignment: string) => void;
  resetWizard: () => void;
}

const initialWizardState: WizardState = {
  currentStep: 0,
  selectedRace: null,
  selectedRaceObject: null,
  selectedClass: null,
  selectedClassObject: null,
  selectedBackgroundId: null,
  selectedBackgroundObject: null,
  stats: null,
  selectedSkills: [],
  characterName: '',
  characterBackground: '',
  characterAlignment: '',
  backstory: '',
  characterSheet: '',
  customRaces: [],
  customClasses: [],
  customBackgrounds: [],
};

const newWizardState = (): WizardState => ({ ...initialWizardState, selectedSkills: [] });

export const useCharacterStore = create<CharacterStore>()(
  persist(
    immer((set) => ({
      ...newWizardState(),
      savedCharacters: [],
      libraryCharacters: [],
      currentCharacterId: null,

      setCurrentCharacterId: (id) => {
        set((state) => { state.currentCharacterId = id; });
      },
      setSavedCharacters: (chars) => {
        set((state) => { state.savedCharacters = chars; });
      },
      setLibraryCharacters: (chars) => {
        set((state) => { state.libraryCharacters = chars; });
      },
      addCharacter: async (char) => {
        const service = getCharacterService();
        await service.saveCharacter(char);
        const chars = await service.loadAllCharacters();
        set((state) => { state.savedCharacters = chars; });
      },
      deleteCharacter: async (id) => {
        const service = getCharacterService();
        await service.deleteCharacter(id);
        set((state) => {
          const idx = state.savedCharacters.findIndex((c) => c.id === id);
          if (idx !== -1) state.savedCharacters.splice(idx, 1);
        });
      },
      updateCharacter: async (id, data) => {
        const service = getCharacterService();
        const char = await service.loadCharacter(id);
        if (char) {
          Object.assign(char, data, { updatedAt: Date.now() });
          await service.saveCharacter(char);
          set((state) => {
            const existing = state.savedCharacters.find((c) => c.id === id);
            if (existing) Object.assign(existing, data, { updatedAt: Date.now() });
          });
        }
      },
      loadSavedCharacters: async () => {
        const service = getCharacterService();
        const chars = await service.loadAllCharacters();
        set((state) => { state.savedCharacters = chars; });
      },
      loadLibraryCharacters: () => {
        const chars = getCharacterService().getLibraryCharacters();
        set((state) => { state.libraryCharacters = chars; });
      },
      setWizardStep: (step) => {
        set((state) => { state.currentStep = step; });
      },
      setSelectedRace: (raceId) => {
        set((state) => {
          state.selectedRace = raceId;
          const custom = state.customRaces.find((r) => r.id === raceId);
          state.selectedRaceObject = (custom as Race) ?? (RACES[raceId] as Race) ?? null;
        });
      },
      setSelectedRaceObject: (race) => {
        set((state) => { state.selectedRaceObject = race; state.selectedRace = race?.id ?? null; });
      },
      setSelectedClass: (classId) => {
        set((state) => {
          state.selectedClass = classId;
          const custom = state.customClasses.find((c) => c.id === classId);
          state.selectedClassObject = (custom as ClassInfo) ?? (CHARACTER_CLASSES[classId] as ClassInfo) ?? null;
        });
      },
      setSelectedClassObject: (cls) => {
        set((state) => { state.selectedClassObject = cls; state.selectedClass = cls?.id ?? null; });
      },
      setSelectedBackground: (bgId) => {
        set((state) => {
          state.selectedBackgroundId = bgId;
          const custom = state.customBackgrounds.find((b) => b.id === bgId);
          state.selectedBackgroundObject = (custom as Background) ?? (BACKGROUNDS.find((b) => b.id === bgId) as Background) ?? null;
        });
      },
      addCustomRace: (race) => {
        set((state) => { state.customRaces.push(race); });
      },
      addCustomClass: (cls) => {
        set((state) => { state.customClasses.push(cls); });
      },
      addCustomBackground: (bg) => {
        set((state) => { state.customBackgrounds.push(bg); });
      },
      setStats: (stats) => {
        set((state) => { state.stats = stats; });
      },
      setSelectedSkills: (skills) => {
        set((state) => { state.selectedSkills = skills; });
      },
      setCharacterName: (name) => {
        set((state) => { state.characterName = name; });
      },
      setCharacterSheet: (sheet) => {
        set((state) => { state.characterSheet = sheet; });
      },
      setBackstory: (story) => {
        set((state) => { state.backstory = story; });
      },
      setCharacterBackground: (bg) => {
        set((state) => { state.characterBackground = bg; });
      },
      setCharacterAlignment: (alignment) => {
        set((state) => { state.characterAlignment = alignment; });
      },
      resetWizard: () => {
        set((state) => { Object.assign(state, newWizardState()); });
      },
    })),
    {
      name: 'dnd-character-wizard',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedRace: state.selectedRace,
        selectedRaceObject: state.selectedRaceObject,
        selectedClass: state.selectedClass,
        selectedClassObject: state.selectedClassObject,
        selectedBackgroundId: state.selectedBackgroundId,
        selectedBackgroundObject: state.selectedBackgroundObject,
        stats: state.stats,
        selectedSkills: state.selectedSkills,
        characterName: state.characterName,
        characterBackground: state.characterBackground,
        characterAlignment: state.characterAlignment,
        backstory: state.backstory,
        characterSheet: state.characterSheet,
        customRaces: state.customRaces,
        customClasses: state.customClasses,
        customBackgrounds: state.customBackgrounds,
        currentCharacterId: state.currentCharacterId,
      }),
    }
  )
);
