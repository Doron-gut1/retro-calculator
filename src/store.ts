import { create } from 'zustand';

interface RetroState {
  // Session params
  odbcName: string | null;
  jobNumber: number | null;
  
  // Form state
  property: any | null;
  selectedChargeTypes: string[];
  startDate: string | null;
  endDate: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSessionParams: (params: { odbcName: string; jobNumber: number }) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  calculateRetro: () => Promise<void>;
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
  error: null
};

export const useRetroStore = create<RetroState>((set, get) => ({
  ...initialState,
  
  setSessionParams: (params) => set({
    odbcName: params.odbcName,
    jobNumber: params.jobNumber
  }),
  
  searchProperty: async (propertyCode) => {
    const state = get();
    if (!state.odbcName || !state.jobNumber) {
      set({ error: 'Missing session parameters' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5000/api/Property/search?odbcName=${state.odbcName}&propertyCode=${propertyCode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      const data = await response.json();
      set({ property: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
  
  setStartDate: (date) => set({ startDate: date }),
  
  setEndDate: (date) => set({ endDate: date }),
  
  calculateRetro: async () => {
    const state = get();
    if (!state.odbcName || !state.jobNumber) {
      set({ error: 'Missing session parameters' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/Retro/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          odbcName: state.odbcName,
          jobNumber: state.jobNumber,
          propertyId: state.property?.code,
          startDate: state.startDate,
          endDate: state.endDate,
          chargeTypes: state.selectedChargeTypes
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate retro');
      }
      
      const data = await response.json();
      // TODO: Handle calculation results
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  reset: () => set(initialState)
}));