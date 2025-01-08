import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

interface RetroState {
  odbcName: string | null;
  jobNumber: number | null;
  property: Property | null;
  selectedChargeTypes: number[];
  startDate: Date | null;
  endDate: Date | null;
  isLoading: boolean;
}

interface Actions {
  setSessionParams: ({ odbcName, jobNumber }: { odbcName: string; jobNumber: number }) => void;
  setProperty: (property: Property | null) => void;
  setSelectedChargeTypes: (types: number[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  setLoading: (isLoading: boolean) => void;
  calculateRetro: () => Promise<void>;
  reset: () => void;
}

const initialState: RetroState = {
  odbcName: null,
  jobNumber: null,
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  isLoading: false
};

export const useRetroStore = create<RetroState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setSessionParams: ({ odbcName, jobNumber }) => set({ odbcName, jobNumber }),
      setProperty: (property) => set({ property }),
      setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
      setStartDate: (dateStr) => set({ startDate: new Date(dateStr) }),
      setEndDate: (dateStr) => set({ endDate: new Date(dateStr) }),
      setLoading: (isLoading) => set({ isLoading }),

      calculateRetro: async () => {
        const state = get();
        const { property, startDate, endDate, selectedChargeTypes, odbcName } = state;

        // Validation
        if (!property || !startDate || !endDate || selectedChargeTypes.length === 0) {
          throw new Error('אנא מלא את כל השדות הנדרשים');
        }

        try {
          set({ isLoading: true });

          const requestBody = {
            propertyId: property.hskod,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            chargeTypes: selectedChargeTypes
          };

          // TODO: Implement actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error('שגיאה בחישוב רטרו:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
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
        isLoading: state.isLoading
      } as RetroState)
    }
  )
);