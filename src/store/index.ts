import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property, CalculationResult } from '../types';

interface RetroState {
  odbcName: string | null;
  jobNumber: number | null;
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  results: CalculationResult[];
  isLoading: boolean;
}

interface Actions {
  setSessionParams: ({ odbcName, jobNumber }: { odbcName: string; jobNumber: number }) => void;
  setProperty: (property: Property | null) => void;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  setResults: (results: CalculationResult[]) => void;
  setLoading: (isLoading: boolean) => void;
  handlePayerChange: (payerId: string) => void;
  reset: () => void;
}

const initialState: RetroState = {
  odbcName: null,
  jobNumber: null,
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

      setSessionParams: ({ odbcName, jobNumber }) => set({ odbcName, jobNumber }),

      setProperty: (property) => set({ property }),

      setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),

      setStartDate: (dateStr) => {
        const newDate = new Date(dateStr);
        if (isNaN(newDate.getTime())) {
          console.error('תאריך התחלה לא תקין');
          return;
        }
        set({ startDate: newDate });
      },

      setEndDate: (dateStr) => {
        const newDate = new Date(dateStr);
        if (isNaN(newDate.getTime())) {
          console.error('תאריך סיום לא תקין');
          return;
        }
        set({ endDate: newDate });
      },

      setResults: (results) => set({ results }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      handlePayerChange: (payerId) => {
        // TODO: Implement payer change logic
        console.log('Changing payer to:', payerId);
      },
      
      reset: () => set(initialState)
    }),
    {
      name: 'retro-calculator-storage',
      partialize: (state) => ({
        odbcName: state.odbcName,
        jobNumber: state.jobNumber,
        property: state.property,
        selectedChargeTypes: state.selectedChargeTypes,
        startDate: state.startDate,
        endDate: state.endDate,
        results: state.results,
        isLoading: state.isLoading
      })
    }
  )
);