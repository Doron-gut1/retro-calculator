// Latest Version - After Store Centralization - 2024-01-08
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

const API_BASE_URL = 'https://localhost:5001/api';

console.log('Store initialization started');

// קריאה חד פעמית של הפרמטרים מה-URL
const urlParams = new URLSearchParams(window.location.search);
const initialOdbcName = urlParams.get('odbcName');
const initialJobNum = urlParams.get('jobNum');

console.log('Initial URL parameters:', { odbcName: initialOdbcName, jobNum: initialJobNum });

interface RetroState {
  odbcName: string | null;
  jobNumber: number | null;
  isInitialized: boolean;
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  calculateRetro: () => Promise<void>;
  reset: () => void;
}

const initialState: RetroState = {
  odbcName: initialOdbcName,
  jobNumber: initialJobNum ? parseInt(initialJobNum) : null,
  isInitialized: false,
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  isLoading: false,
  error: null
};

console.log('Creating store with initial state:', initialState);

export const useRetroStore = create<RetroState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedChargeTypes: (types) => {
        console.log('Setting charge types:', types);
        set({ selectedChargeTypes: types });
      },

      setStartDate: (dateStr) => {
        console.log('Setting start date:', dateStr);
        try {
          const date = dateStr ? new Date(dateStr) : null;
          console.log('Parsed start date:', date);
          set({ startDate: date });
        } catch (error) {
          console.error('Error setting start date:', error);
          set({ error: 'שגיאה בהגדרת תאריך התחלה' });
        }
      },

      setEndDate: (dateStr) => {
        console.log('Setting end date:', dateStr);
        try {
          const date = dateStr ? new Date(dateStr) : null;
          console.log('Parsed end date:', date);
          set({ endDate: date });
        } catch (error) {
          console.error('Error setting end date:', error);
          set({ error: 'שגיאה בהגדרת תאריך סיום' });
        }
      },

      searchProperty: async (propertyCode: string) => {
        const { odbcName } = get();
        if (!odbcName) {
          set({ error: 'לא נמצא חיבור לאקסס' });
          return;
        }

        try {
          console.log('Starting property search:', { propertyCode, odbcName });
          set({ isLoading: true, error: null });

          const url = new URL(`${API_BASE_URL}/Property/${propertyCode}?odbcName=${odbcName}`);
          console.log('API request URL:', url.toString());

          const response = await fetch(url.toString(), {
            headers: { 'Accept': 'application/json' }
          });

          console.log('API response status:', response.status);
          const text = await response.text();
          console.log('API raw response:', text);

          if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${text}`);
          }

          const data = text ? JSON.parse(text) : null;
          console.log('Parsed property data:', data);

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

      calculateRetro: async () => {
        const state = get();
        const { property, startDate, endDate, selectedChargeTypes, jobNumber } = state;

        if (!property || !startDate || !endDate || selectedChargeTypes.length === 0) {
          set({ error: 'אנא מלא את כל השדות הנדרשים' });
          return;
        }

        try {
          console.log('Starting retro calculation...');
          set({ isLoading: true, error: null });

          const requestBody = {
            propertyId: property.hskod,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            chargeTypes: selectedChargeTypes,
            jobNumber
          };

          console.log('Calculation request body:', requestBody);
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error('Retro calculation failed:', error);
          set({ error: error instanceof Error ? error.message : 'שגיאה בחישוב רטרו' });
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => {
        console.log('Resetting store state');
        set(initialState);
      }
    }),
    {
      name: 'retro-calculator-storage',
      partialize: (state) => ({
        odbcName: state.odbcName,
        jobNumber: state.jobNumber,
        property: state.property,
        selectedChargeTypes: state.selectedChargeTypes,
        startDate: state.startDate,
        endDate: state.endDate
      } as Partial<RetroState>)
    }
  )
);