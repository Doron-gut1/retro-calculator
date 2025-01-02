import { create } from 'zustand';
import type { Property, CalculationResult } from '../types';

interface RetroState {
  property: Property | null;
  setProperty: (property: Property | null) => void;
  selectedChargeTypes: string[];
  setSelectedChargeTypes: (types: string[]) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  results: CalculationResult[];
  setResults: (results: CalculationResult[]) => void;
}

export const useRetroStore = create<RetroState>((set) => ({
  property: null,
  setProperty: (property) => set({ property }),
  selectedChargeTypes: [],
  setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
  startDate: null,
  setStartDate: (date) => set({ startDate: date }),
  endDate: null,
  setEndDate: (date) => set({ endDate: date }),
  results: [],
  setResults: (results) => set({ results })
}));
