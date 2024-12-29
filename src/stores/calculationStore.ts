import { create } from 'zustand';
import { CalculationPeriod, CalculationResult, ChargeType } from '../types';

interface CalculationState {
  period: CalculationPeriod | null;
  chargeTypes: ChargeType[];
  results: CalculationResult[];
  isCalculating: boolean;
  error: string | null;

  setPeriod: (period: CalculationPeriod) => void;
  setChargeTypes: (types: ChargeType[]) => void;
  toggleChargeType: (sugts: number) => void;
  setResults: (results: CalculationResult[]) => void;
  setCalculating: (isCalculating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCalculationStore = create<CalculationState>((set) => ({
  period: null,
  chargeTypes: [],
  results: [],
  isCalculating: false,
  error: null,

  setPeriod: (period) => set({ period }),
  setChargeTypes: (chargeTypes) => set({ chargeTypes }),
  toggleChargeType: (sugts) => set((state) => ({
    chargeTypes: state.chargeTypes.map(type =>
      type.sugts === sugts 
        ? { ...type, isSelected: !type.isSelected }
        : type
    )
  })),
  setResults: (results) => set({ results }),
  setCalculating: (isCalculating) => set({ isCalculating }),
  setError: (error) => set({ error }),
  reset: () => set({
    period: null,
    chargeTypes: [],
    results: [],
    isCalculating: false,
    error: null
  })
}));
