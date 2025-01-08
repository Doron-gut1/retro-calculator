import { create } from 'zustand';

interface RetroState {
  odbcName: string | null;
  jobNumber: number | null;
  property: any | null;
  isLoading: boolean;
  error: string | null;
  setSessionParams: (params: { odbcName: string; jobNumber: number }) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  odbcName: null,
  jobNumber: null,
  property: null,
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
  reset: () => set(initialState)
}));