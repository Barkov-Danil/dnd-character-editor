import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Character, CharacterStats, Race, ClassInfo, SkillProficiency, WizardState } from '../types';
import { RACES, CHARACTER_CLASSES } from '../utils/gameData';

type WizardStats = CharacterStats | null;

interface CharacterStore extends WizardState {
  savedCharacters: Character[];
  libraryCharacters: Character[];
  setSavedCharacters: (chars: Character[]) => void;
  setLibraryCharacters: (chars: Character[]) => void;
  addCharacter: (char: Character) => void;
  deleteCharacter: (id: string) => void;
  updateCharacter: (id: string, data: Partial<Character>) => void;
  setWizardStep: (step: number) => void;
  setSelectedRace: (raceId: string) => void;
  setSelectedClass: (classId: string) => void;
  setStats: (stats: WizardStats) => void;
  setSelectedSkills: (skills: SkillProficiency[]) => void;
  setCharacterName: (name: string) => void;
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
  stats: null,
  selectedSkills: [],
  characterName: '',
  characterBackground: '',
  characterAlignment: '',
};

const newWizardState = (): WizardState => ({ ...initialWizardState, selectedSkills: [] });

export const useCharacterStore = create<CharacterStore>()(
  immer((set) => ({
    ...newWizardState(),
    savedCharacters: [],
    libraryCharacters: [],

    setSavedCharacters: (chars) => {
      set((state) => { state.savedCharacters = chars; });
    },
    setLibraryCharacters: (chars) => {
      set((state) => { state.libraryCharacters = chars; });
    },
    addCharacter: (char) => {
      set((state) => { state.savedCharacters.push(char); });
    },
    deleteCharacter: (id) => {
      set((state) => {
        const idx = state.savedCharacters.findIndex((c) => c.id === id);
        if (idx !== -1) state.savedCharacters.splice(idx, 1);
      });
    },
    updateCharacter: (id, data) => {
      set((state) => {
        const char = state.savedCharacters.find((c) => c.id === id);
        if (char) Object.assign(char, data, { updatedAt: Date.now() });
      });
    },
    setWizardStep: (step) => {
      set((state) => { state.currentStep = step; });
    },
    setSelectedRace: (raceId) => {
      set((state) => {
        state.selectedRace = raceId;
        state.selectedRaceObject = (RACES[raceId] as Race) ?? null;
      });
    },
    setSelectedClass: (classId) => {
      set((state) => {
        state.selectedClass = classId;
        state.selectedClassObject = (CHARACTER_CLASSES[classId] as ClassInfo) ?? null;
      });
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
    setCharacterBackground: (bg) => {
      set((state) => { state.characterBackground = bg; });
    },
    setCharacterAlignment: (alignment) => {
      set((state) => { state.characterAlignment = alignment; });
    },
    resetWizard: () => {
      set((state) => { Object.assign(state, newWizardState()); });
    },
  }))
);
