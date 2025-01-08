import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

interface RetroState {
  odbcName: string | null;
  jobNumber: number | null;
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  setSessionParams: ({ odbcName, jobNumber }: { odbcName: string; jobNumber: number }) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
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
  isLoading: false,
  error: null
};

export const useRetroStore = create<RetroState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSessionParams: ({ odbcName, jobNumber }) => set({ odbcName, jobNumber }),

      searchProperty: async (propertyCode: string) => {
        const { odbcName } = get();
        if (!odbcName) {
          set({ error: 'לא נמצא חיבור לאקסס' });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          const url = new URL(`${API_BASE_URL}/Property/search`);
          url.searchParams.append('propertyCode', propertyCode);
          url.searchParams.append('odbcName', odbcName);
          
          const response = await fetch(url.toString(), {
            headers: {
              'Accept': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const results = await response.json();
          if (results && results.length > 0) {
            set({ property: results[0] });
          } else {
            set({ error: 'לא נמצא נכס' });
          }
        } catch (error) {
          console.error('Property search failed:', error);
          set({ error: 'שגיאה בחיפוש נכס' });
        } finally {
          set({ isLoading: false });
        }
      },

      setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),

      setStartDate: (dateStr) => set({ startDate: new Date(dateStr) }),
      setEndDate: (dateStr) => set({ endDate: new Date(dateStr) }),

      calculateRetro: async () => {
        const state = get();
        const { property, startDate, endDate, selectedChargeTypes, odbcName } = state;

        if (!property || !startDate || !endDate || selectedChargeTypes.length === 0) {
          set({ error: 'אנא מלא את כל השדות הנדרשים' });
          return;
        }

        try {
          set({ isLoading: true, error: null });

          const requestBody = {
            propertyId: property.hskod,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            chargeTypes: selectedChargeTypes,
            jobNumber: get().jobNumber
          };

          // TODO: הוספת קריאה ל-API אמיתי
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error('שגיאה בחישוב רטרו:', error);
          set({ error: 'שגיאה בחישוב רטרו' });
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