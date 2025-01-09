import { create } from 'zustand';
import { RetroState } from './types';

type SessionParams = {
  odbcName: string | null;
  jobNumber: number | null;
};

interface ApiPropertyResponse {
  propertyId: string;
  payerId: number;
  payerNumber: number;
  payerName: string;
  size1: number;
  tariff1: number;
  size2: number;
  tariff2: number;
  size3: number;
  tariff3: number;
  size4: number;
  tariff4: number;
  size5: number;
  tariff5: number;
  size6: number;
  tariff6: number;
  size7: number;
  tariff7: number;
  size8: number;
  tariff8: number;
}

type State = {
  sessionParams: SessionParams;
  property: RetroState['property'];
  selectedChargeTypes: number[];
  startDate: Date | null;
  endDate: Date | null;
  results: RetroState['results'];
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

type Actions = {
  setSessionParams: (params: SessionParams) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  setSelectedChargeTypes: (types: number[]) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  calculateRetro: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}

const initialState: State = {
  sessionParams: {
    odbcName: null,
    jobNumber: null
  },
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  results: [],
  isLoading: false,
  error: null,
  success: null
};

export const useRetroStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setSessionParams: (params: SessionParams) => {
    console.log('Setting session params:', params);
    set({ sessionParams: params });
  },
  
  searchProperty: async (propertyCode: string) => {
    const state = get();
    console.log('Searching property with state:', state);
    
    if (!state.sessionParams.odbcName) {
      set({ error: 'Missing ODBC connection' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const url = `https://localhost:5001/api/Property/${propertyCode}?odbcName=${state.sessionParams.odbcName}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.statusText}`);
      }
      const apiData: ApiPropertyResponse = await response.json();
      console.log('Received data:', apiData);
      
      // מיפוי הנתונים למבנה הנכון
      const property = {
        hskod: apiData.propertyId,
        mspkod: apiData.payerId,
        maintz: apiData.payerNumber.toString(),
        fullname: apiData.payerName,
        godel: apiData.size1,
        mas: apiData.tariff1,
        gdl2: apiData.size2 || undefined,
        mas2: apiData.tariff2 || undefined,
        gdl3: apiData.size3 || undefined,
        mas3: apiData.tariff3 || undefined,
        gdl4: apiData.size4 || undefined,
        mas4: apiData.tariff4 || undefined,
        gdl5: apiData.size5 || undefined,
        mas5: apiData.tariff5 || undefined,
        gdl6: apiData.size6 || undefined,
        mas6: apiData.tariff6 || undefined,
        gdl7: apiData.size7 || undefined,
        mas7: apiData.tariff7 || undefined,
        gdl8: apiData.size8 || undefined,
        mas8: apiData.tariff8 || undefined
      };
      
      set({ property });
      console.log('Updated store state:', get());
    } catch (error) {
      console.error('Error in searchProperty:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch property',
        property: null
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedChargeTypes: (types: number[]) => set({ selectedChargeTypes: types }),

  setStartDate: (date: Date | null) => set({ startDate: date }),

  setEndDate: (date: Date | null) => set({ endDate: date }),

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          odbcName: state.sessionParams.odbcName,
          jobNumber: state.sessionParams.jobNumber,
          propertyId: state.property.hskod,
          startDate: state.startDate,
          endDate: state.endDate,
          chargeTypes: state.selectedChargeTypes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate retro');
      }

      const results = await response.json();
      set({ results, success: 'Calculation completed successfully' });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to calculate retro'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  clearSuccess: () => set({ success: null }),

  reset: () => set(initialState)
}));