import { create } from 'zustand';
import { Property, RetroCalculationResult } from '../types';

interface RetroStore {
  property: Property | null;
  results: RetroCalculationResult | null;
  setProperty: (property: Property | null) => void;
  setResults: (results: RetroCalculationResult | null) => void;
  startCalculation: () => void;
  confirmCalculation: () => void;
  clearAll: () => void;
}

export const useRetroStore = create<RetroStore>((set) => ({
  property: null,
  results: null,
  setProperty: (property) => set({ property }),
  setResults: (results) => set({ results }),
  startCalculation: () => {
    // Logic for starting calculation
    console.log('Starting calculation...');
  },
  confirmCalculation: () => {
    // Logic for confirming calculation
    console.log('Confirming calculation...');
  },
  clearAll: () => set({ property: null, results: null })
}));