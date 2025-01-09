import { create } from 'zustand';
import { Property, RetroState, SessionParams } from './types';

const initialState = {
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

interface ApiPropertyResponse {
  propertyId: string;
  payerId: number;
  payerNumber: string;
  payerName: string;
  size1: number;
  tariff1: number;
  tariff1Name: string;
  size2: number;
  tariff2: number;
  tariff2Name: string;
  size3: number;
  tariff3: number;
  tariff3Name: string;
  size4: number;
  tariff4: number;
  tariff4Name: string;
  size5: number;
  tariff5: number;
  tariff5Name: string;
  size6: number;
  tariff6: number;
  tariff6Name: string;
  size7: number;
  tariff7: number;
  tariff7Name: string;
  size8: number;
  tariff8: number;
  tariff8Name: string;
  validFrom: string | null;
  validTo: string | null;
}

export const useRetroStore = create<RetroState>((set, get) => ({
  ...initialState,

  setSessionParams: (params: SessionParams) => set({
    sessionParams: params
  }),

  searchProperty: async (propertyCode: string) => {
    const state = get();
    if (!state.sessionParams.odbcName) {
      set({ error: 'Missing ODBC connection' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`https://localhost:5001/api/Property/${propertyCode}?odbcName=${state.sessionParams.odbcName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.statusText}`);
      }
      const data: ApiPropertyResponse = await response.json();
      
      // מיפוי הנתונים למבנה הנדרש
      const property: Property = {
        hskod: data.propertyId,
        mspkod: data.payerId,
        maintz: data.payerNumber,
        fullname: data.payerName,
        godel: data.size1,
        mas: data.tariff1,
        masName: data.tariff1Name,
        gdl2: data.size2,
        mas2: data.tariff2,
        mas2Name: data.tariff2Name,
        gdl3: data.size3,
        mas3: data.tariff3,
        mas3Name: data.tariff3Name,
        gdl4: data.size4,
        mas4: data.tariff4,
        mas4Name: data.tariff4Name,
        gdl5: data.size5,
        mas5: data.tariff5,
        mas5Name: data.tariff5Name,
        gdl6: data.size6,
        mas6: data.tariff6,
        mas6Name: data.tariff6Name,
        gdl7: data.size7,
        mas7: data.tariff7,
        mas7Name: data.tariff7Name,
        gdl8: data.size8,
        mas8: data.tariff8,
        mas8Name: data.tariff8Name
      };

      set({ property });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error occurred while searching property' });
      set({ property: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedChargeTypes: (types: number[]) => set({ selectedChargeTypes: types }),

  setStartDate: (date: string) => set({ startDate: date }),

  setEndDate: (date: string) => set({ endDate: date }),

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

      const result = await response.json();
      set({ 
        success: 'Calculation completed successfully',
        results: result
      });

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