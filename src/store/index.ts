import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property, CalculationResult, ValidationError } from '../types';

interface RetroState {
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  results: CalculationResult[];
  isLoading: boolean;
}

interface Actions {
  setProperty: (property: Property | null) => void;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  setResults: (results: CalculationResult[]) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

const initialState: RetroState = {
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  results: [],
  isLoading: false
};

export const useRetroStore = create(
  persist<RetroState & Actions>(
    (set, get) => ({
      ...initialState,

      setProperty: (property) => set({ property }),
      setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
      setStartDate: (dateStr) => {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          set({ startDate: date });
        }
      },
      setEndDate: (dateStr) => {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          set({ endDate: date });
        }
      },
      setResults: (results) => set({ results }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () => set(initialState)
    }),
    {
      name: 'retro-calculator-storage',
      partialize: (state) => ({
        property: state.property,
        selectedChargeTypes: state.selectedChargeTypes,
        startDate: state.startDate,
        endDate: state.endDate
      })
    }
  )
);