import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

const API_BASE_URL = 'https://localhost:5001/api';

console.log('Store initialization started');

// קריאה ראשונית של הפרמטרים מה-URL - קורה רק פעם אחת בטעינת הקובץ
const urlParams = new URLSearchParams(window.location.search);
const initialOdbcName = urlParams.get('odbcName');
const initialJobNum = urlParams.get('jobNum');

console.log('Initial URL parameters:', { odbcName: initialOdbcName, jobNum: initialJobNum });

interface RetroState {
  // Basic initialization parameters
  odbcName: string | null;
  jobNumber: number | null;
  isInitialized: boolean;
  
  // Form operational data
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  
  // UI states
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  setInitialized: (initialized: boolean) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  calculateRetro: () => Promise<void>;
  reset: () => void;
}

const initialState: RetroState = {
  // Basic params - initialized from URL
  odbcName: initialOdbcName,
  jobNumber: initialJobNum ? parseInt(initialJobNum) : null,
  isInitialized: false,

  // Form data - starts empty
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  
  // UI states
  isLoading: false,
  error: null
};

console.log('Creating store with initial state:', initialState);

export const useRetroStore = create<RetroState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setInitialized: (initialized) => {
        console.log('Setting initialized state:', initialized);
        set({ isInitialized: initialized });
      },

      searchProperty: async (propertyCode: string) => {
        const { odbcName } = get();
        if (!odbcName) {
          console.error('ODBC connection not found');
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

      setSelectedChargeTypes: (types) => {
        console.log('Setting charge types:', types);
        set({ selectedChargeTypes: types });
      },

      setStartDate: (dateStr) => {
        console.log('Setting start date:', dateStr);
        set({ startDate: new Date(dateStr) });
      },

      setEndDate: (dateStr) => {
        console.log('Setting end date:', dateStr);
        set({ endDate: new Date(dateStr) });
      },

      calculateRetro: async () => {
        const state = get();
        const { property, startDate, endDate, selectedChargeTypes, jobNumber } = state;

        if (!property || !startDate || !endDate || selectedChargeTypes.length === 0) {
          console.error('Missing required fields for calculation');
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
          await new Promise(resolve => setTimeout(resolve, 1000)); // TODO: Replace with actual API call
          
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
