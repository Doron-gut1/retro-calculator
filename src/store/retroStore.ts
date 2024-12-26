import create from 'zustand';
import { Property, RetroCalculation, CalculationResult } from '../types';

interface RetroState {
  property: Property | null;
  dateRange: { start: string; end: string };
  selectedChargeTypes: number[];
  calculationResults: CalculationResult[] | null;
  isCalculating: boolean;
  error: string | null;
  
  // Actions
  setProperty: (property: Property | null) => void;
  setDateRange: (range: { start: string; end: string }) => void;
  setChargeTypes: (types: number[]) => void;
  setCalculationResults: (results: CalculationResult[] | null) => void;
  setError: (error: string | null) => void;
}

export const useRetroStore = create<RetroState>((set) => ({
  property: null,
  dateRange: { start: '', end: '' },
  selectedChargeTypes: [],
  calculationResults: null,
  isCalculating: false,
  error: null,

  setProperty: (property) => set({ property }),
  setDateRange: (range) => set({ dateRange: range }),
  setChargeTypes: (types) => set({ selectedChargeTypes: types }),
  setCalculationResults: (results) => set({ calculationResults: results }),
  setError: (error) => set({ error })
}));