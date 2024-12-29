import { create } from 'zustand';
import { PropertyDetails } from '../types/property';

interface RetroState {
  property: PropertyDetails | null;
  calculationResults: any[] | null;
  isCalculating: boolean;
  error: string | null;

  setProperty: (property: PropertyDetails | null) => void;
  setCalculationResults: (results: any[] | null) => void;
  setCalculating: (isCalculating: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRetroStore = create<RetroState>((set) => ({
  property: null,
  calculationResults: null,
  isCalculating: false,
  error: null,

  setProperty: (property) => set({ property }),
  setCalculationResults: (results) => set({ calculationResults: results }),
  setCalculating: (isCalculating) => set({ isCalculating }),
  setError: (error) => set({ error })
}));
