import { create } from 'zustand';

interface Property {
  code: string;
  payerId: number;
  payerName: string;
  sizes: Array<{
    index: number;
    size: number;
    tariffCode: number;
    tariffName: string;
  }>;
}

interface RetroState {
  // Session params
  odbcName: string | null;
  jobNumber: number | null;

  // Property data
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: string | null;
  endDate: string | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // Actions
  setSessionParams: (params: { odbcName: string; jobNumber: number }) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  calculateRetro: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}

const initialState = {
  odbcName: null,
  jobNumber: null,
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  isLoading: false,
  error: null,
  success: null
};

export const useRetroStore = create<RetroState>((set, get) => ({
  ...initialState,

  setSessionParams: (params) => set({
    odbcName: params.odbcName,
    jobNumber: params.jobNumber
  }),

  searchProperty: async (propertyCode) => {
    const state = get();
    if (!state.odbcName) {
      set({ error: 'Missing ODBC connection' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`https://localhost:5001/api/Property/${propertyCode}?odbcName=${state.odbcName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.statusText}`);
      }
      const data = await response.json();
      set({ property: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error occurred while searching property' });
      set({ property: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),

  setStartDate: (date) => set({ startDate: date }),

  setEndDate: (date) => set({ endDate: date }),

  calculateRetro: async () => {
    const state = get();
    if (!state.property || !state.startDate || !state.endDate || state.selectedChargeTypes.length === 0) {
      set({ error: 'Please fill all required fields before calculation' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('https://localhost:5001/api/Retro/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          odbcName: state.odbcName,
          jobNumber: state.jobNumber,
          propertyId: state.property.code,
          startDate: state.startDate,
          endDate: state.endDate,
          chargeTypes: state.selectedChargeTypes,
          sizes: state.property.sizes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate retro');
      }

      const result = await response.json();
      set({ success: 'Calculation completed successfully' });
      return result;

    } catch (error) {
      set({ 
        error: error instanceof Error 
          ? error.message 
          : 'Unknown error occurred during calculation'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  clearSuccess: () => set({ success: null }),

  reset: () => set(initialState)
}));
