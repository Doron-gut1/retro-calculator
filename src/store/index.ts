import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

console.log('Initializing store...');

const API_BASE_URL = 'https://localhost:5001/api';

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
  setSessionParams: (params: { odbcName: string; jobNumber: number }) => void;
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

console.log('Creating store with initial state:', initialState);

export const useRetroStore = create<RetroState & Actions>(
  (set, get) => ({
    ...initialState,

    setSessionParams: ({ odbcName, jobNumber }) => {
      console.log('Setting session params:', { odbcName, jobNumber });
      set({ odbcName, jobNumber });
      console.log('Current state after setting params:', get());
    },

    searchProperty: async (propertyCode: string) => {
      const { odbcName } = get();
      if (!odbcName) {
        set({ error: 'לא נמצא חיבור לאקסס' });
        return;
      }

      try {
        set({ isLoading: true, error: null });
        
        console.log('Searching with params:', { propertyCode, odbcName });

        const url = new URL(`${API_BASE_URL}/Property/search`);
        url.searchParams.append('propertyCode', propertyCode);
        url.searchParams.append('odbcName', odbcName);
        
        console.log('Full URL:', url.toString());

        const response = await fetch(url.toString(), {
            headers: {
              'Accept': 'application/json'
            }
          });

        console.log('Response status:', response.status);
        
        const text = await response.text();
        console.log('Raw response:', text);

        if (!response.ok) {
          throw new Error(`API error: ${response.status} - ${text}`);
        }

        const data = text ? JSON.parse(text) : null;
        console.log('Parsed data:', data);

        if (data && Array.isArray(data) && data.length > 0) {
          set({ property: data[0] });
        } else {
          set({ error: 'לא נמצא נכס' });
        }
      } catch (error) {
        console.error('Property search failed:', error);
        set({ error: error instanceof Error ? error.message : 'שגיאה בחיפוש נכס' });
      } finally {
        set({ isLoading: false });
      }
    },

    setSelectedChargeTypes: (types: string[]) => set({ selectedChargeTypes: types }),
    setStartDate: (dateStr: string) => set({ startDate: new Date(dateStr) }),
    setEndDate: (dateStr: string) => set({ endDate: new Date(dateStr) }),

    calculateRetro: async () => {
      const state = get();
      const { property, startDate, endDate, selectedChargeTypes, jobNumber } = state;

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
          jobNumber
        };

        console.log('Calculation request:', requestBody);
        
      } catch (error) {
        console.error('שגיאה בחישוב רטרו:', error);
        set({ error: error instanceof Error ? error.message : 'שגיאה בחישוב רטרו' });
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () => set(initialState)
  })
);

console.log('Store initialization complete');