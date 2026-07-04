import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { DiceFormulaEntry } from '../utils/diceParser';

interface DiceFormulasStore {
  formulas: DiceFormulaEntry[];
  addFormula: (entry: Omit<DiceFormulaEntry, 'id' | 'createdAt'>) => string;
  updateFormula: (id: string, data: Partial<Omit<DiceFormulaEntry, 'id' | 'createdAt'>>) => void;
  deleteFormula: (id: string) => void;
}

export const useDiceFormulasStore = create<DiceFormulasStore>()(
  immer((set) => ({
    formulas: [],

    addFormula: (entry) => {
      const id = `dice-${Date.now()}`;
      set((state) => {
        state.formulas.push({ ...entry, id, createdAt: Date.now() });
      });
      return id;
    },

    updateFormula: (id, data) => {
      set((state) => {
        const f = state.formulas.find((x) => x.id === id);
        if (f) Object.assign(f, data);
      });
    },

    deleteFormula: (id) => {
      set((state) => {
        const idx = state.formulas.findIndex((x) => x.id === id);
        if (idx !== -1) state.formulas.splice(idx, 1);
      });
    },
  }))
);
