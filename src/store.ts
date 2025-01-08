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
  // Session params
  odbcName: null,
  jobNumber: null,
  
  // Form state
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  isLoading: false,
  error: null
};

export const useRetroStore = create<RetroState>((set) => ({
  ...initialState,
  
  setSessionParams: (params) => set({
    odbcName: params.odbcName,
    jobNumber: params.jobNumber
  }),
  
  searchProperty: async (propertyCode) => {
    set({ isLoading: true, error: null });
    try {
      const mockProperty = { code: propertyCode, name: 'Test Property' };
      set({ property: mockProperty });
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
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  reset: () => set(initialState)
}));