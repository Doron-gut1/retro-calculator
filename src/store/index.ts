import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property, RetroResultRow } from '../types';

interface RetroState {
  odbcName: string | null;
  jobNumber: number | null;
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  results: RetroResultRow[];
  isLoading: boolean;
}

interface Actions {
  setSessionParams: ({ odbcName, jobNumber }: { odbcName: string; jobNumber: number }) => void;
  setProperty: (property: Property | null) => void;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  setResults: (results: RetroResultRow[]) => void;
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

export const useRetroStore = create<RetroState & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setSessionParams: ({ odbcName, jobNumber }) => set({ odbcName, jobNumber }),
      setProperty: (property) => set({ property }),
      setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
      setStartDate: (dateStr) => set({ startDate: new Date(dateStr) }),
      setEndDate: (dateStr) => set({ endDate: new Date(dateStr) }),
      setResults: (results) => set({ results }),
      setLoading: (isLoading) => set({ isLoading }),
      handlePayerChange: (payerId) => console.log('Changing payer to:', payerId),
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
      } as RetroState)
    }
  )
);