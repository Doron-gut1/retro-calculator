import { create } from 'zustand';
import { Property, RetroState, SessionParams } from './types';

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
      const data: ApiPropertyResponse = await response.json();
      
      // מיפוי הנתונים למבנה הנדרש
      const property: Property = {
        hskod: data.propertyId,
        mspkod: data.payerId,
        maintz: data.payerNumber,
        fullname: data.payerName,
        godel: data.size1,
        mas: data.tariff1,
        mas_name: data.tariff1Name,
        gdl2: data.size2,
        mas2: data.tariff2,
        mas2_name: data.tariff2Name,
        gdl3: data.size3,
        mas3: data.tariff3,
        mas3_name: data.tariff3Name,
        gdl4: data.size4,
        mas4: data.tariff4,
        mas4_name: data.tariff4Name,
        gdl5: data.size5,
        mas5: data.tariff5,
        mas5_name: data.tariff5Name,
        gdl6: data.size6,
        mas6: data.tariff6,
        mas6_name: data.tariff6Name,
        gdl7: data.size7,
        mas7: data.tariff7,
        mas7_name: data.tariff7Name,
        gdl8: data.size8,
        mas8: data.tariff8,
        mas8_name: data.tariff8Name
      };

      set({ property });
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
    // ... שאר הקוד נשאר אותו דבר
  },

  clearError: () => set({ error: null }),

  clearSuccess: () => set({ success: null }),

  reset: () => set(initialState)
}));