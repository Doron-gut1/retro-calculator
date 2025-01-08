import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

const API_BASE_URL = 'https://localhost:5001/api';

// קריאת פרמטרים מה-URL
const urlParams = new URLSearchParams(window.location.search);
const initialOdbcName = urlParams.get('odbcName');
const initialJobNum = urlParams.get('jobNum');

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
  odbcName: initialOdbcName,  // אתחול מה-URL
  jobNumber: initialJobNum ? parseInt(initialJobNum) : null,  // אתחול מה-URL
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
          
          console.log('Searching with params:', { propertyCode, odbcName });

          const url = new URL(`${API_BASE_URL}/Property/${propertyCode}?odbcName=${odbcName}`);
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

      setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
      setStartDate: (dateStr) => set({ startDate: new Date(dateStr) }),
      setEndDate: (dateStr) => set({ endDate: new Date(dateStr) }),

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

          // TODO: הוספת קריאה ל-API אמיתי
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Calculation request:', requestBody);
          
        } catch (error) {
          console.error('שגיאה בחישוב רטרו:', error);
          set({ error: error instanceof Error ? error.message : 'שגיאה בחישוב רטרו' });
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