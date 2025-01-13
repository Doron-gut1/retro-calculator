import { create } from 'zustand';
import { RetroState, Property, RetroResult } from './types';
import axios from 'axios';

type SessionParams = {
  odbcName: string | null;
  jobNumber: number | null;
};

export interface TariffDto {
  kodln: string | number;  // קוד התעריף
  teur: string;   // תיאור התעריף
}

interface TariffState {
  tariffs: TariffDto[];         
  isLoading: boolean;           
  error: string | null;         
  
  fetchTariffs: (odbcName: string) => Promise<void>;
  clearTariffs: () => void;
}

export const useTariffStore = create<TariffState>((set) => ({
  tariffs: [],
  isLoading: false,
  error: null,
  selectedTariff: null,

  fetchTariffs: async (odbcName) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.get(`https://localhost:5001/api/Property/tariffs?odbcName=${odbcName}`);
      set({ tariffs: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tariffs', 
        isLoading: false 
      });
      console.error('Error fetching tariffs:', error);
    }
  },

  clearTariffs: () => set({ tariffs: [], error: null })
}));

interface ApiPropertyResponse {
  propertyId: string;
  payerId: number;
  payerNumber: number;
  payerName: string;
  address: string;
  propertyType: number;
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
  calculationResults: {
    success: boolean;
    results?: RetroResult[];
    error?: string;
  } | null;
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
  clearResults: () => void;
  reset: () => void;
  addSize: () => void;
  deleteSize: (index: number) => void;
  updateTariff: (index: number, tariffKodln: string, tariffName: string) => void;
  updateSize: (index: number, newSize: number) => void;
};

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
  success: null,
  calculationResults: null
};

export const useRetroStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setSessionParams: (params: SessionParams) => {
    console.log('Setting session params:', params);
    set({ sessionParams: params });
  },
  
  searchProperty: async (propertyCode: string) => {
    const state = get();
    if (!state.sessionParams.odbcName) {
      set({ error: 'Missing ODBC connection' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const url = `https://localhost:5001/api/Property/${propertyCode}`;
      const response = await axios.get(url, {
        params: { odbcName: state.sessionParams.odbcName }
      });
      
      const apiData: ApiPropertyResponse = response.data;
      const property = {
        hskod: apiData.propertyId,
        ktovet: apiData.address || '',
        mspkod: apiData.payerId,
        maintz: apiData.payerNumber.toString(),
        fullname: apiData.payerName,
        sughs: apiData.propertyType || 0,
        godel: apiData.size1,
        mas: apiData.tariff1,
        masName: apiData.tariff1Name,
        gdl2: apiData.size2 || undefined,
        mas2: apiData.tariff2 || undefined,
        mas2Name: apiData.tariff2Name,
        gdl3: apiData.size3 || undefined,
        mas3: apiData.tariff3 || undefined,
        mas3Name: apiData.tariff3Name,
        gdl4: apiData.size4 || undefined,
        mas4: apiData.tariff4 || undefined,
        mas4Name: apiData.tariff4Name,
        gdl5: apiData.size5 || undefined,
        mas5: apiData.tariff5 || undefined,
        mas5Name: apiData.tariff5Name,
        gdl6: apiData.size6 || undefined,
        mas6: apiData.tariff6 || undefined,
        mas6Name: apiData.tariff6Name,
        gdl7: apiData.size7 || undefined,
        mas7: apiData.tariff7 || undefined,
        mas7Name: apiData.tariff7Name,
        gdl8: apiData.size8 || undefined,
        mas8: apiData.tariff8 || undefined,
        mas8Name: apiData.tariff8Name
      };
      
      set({ property });
    } catch (error) {
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
      const sizes = [];
      for (let i = 1; i <= 8; i++) {
        const sizeKey = i === 1 ? 'godel' : `gdl${i}`;
        const tariffKey = i === 1 ? 'mas' : `mas${i}`;
        const size = state.property[sizeKey as keyof typeof state.property];
        const tariff = state.property[tariffKey as keyof typeof state.property];
        
        if (size !== undefined && size !== null) {
          sizes.push({
            index: i,
            size: size,
            tariffCode: tariff || 0
          });
        }
      }

      const response = await fetch(`https://localhost:5001/api/Retro/calculate?odbcName=${state.sessionParams.odbcName}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          propertyId: state.property.hskod,
          startDate: state.startDate.toISOString(),
          endDate: state.endDate.toISOString(),
          chargeTypes: state.selectedChargeTypes,
          jobNumber: state.sessionParams.jobNumber,
          hkarn: 0,
          sizes: sizes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate retro');
      }

      const data = await response.json();
      set({ 
        calculationResults: {
          success: true,
          results: data.rows
        },
        success: 'Calculation completed successfully'
      });
    } catch (error) {
      set({
        calculationResults: {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to calculate retro'
        }
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),
  clearResults: () => set({ calculationResults: null }),
  reset: () => set(initialState),

  addSize: () => {
    const { property } = get();
    if (!property) return;
  
    const sizeProps = ['godel', 'gdl2', 'gdl3', 'gdl4', 'gdl5', 'gdl6', 'gdl7', 'gdl8'] as const;
    const emptyIndex = sizeProps.findIndex(prop => !property[prop] && property[prop] !== 0);
    
    if (emptyIndex === -1) {
      set({ error: 'לא ניתן להוסיף יותר גדלים' });
      return;
    }
  
    const newProperty = { ...property };
    const prop = sizeProps[emptyIndex];
    newProperty[prop] = 0;
    
    const tariffProp = `mas${emptyIndex === 0 ? '' : emptyIndex + 1}` as const;
    (newProperty as any)[tariffProp] = 0;
    
    set({ property: newProperty });
  },

  deleteSize: (index: number) => {
    const { property } = get();
    if (!property) return;
  
    const newProperty = { ...property };
    const baseProp = index === 1 ? '' : index;
  
    delete newProperty[`gdl${baseProp}` as keyof Property];
    delete newProperty[`mas${baseProp}` as keyof Property];
    delete newProperty[`mas${baseProp}Name` as keyof Property];
    
    set({ property: newProperty });
  },

  updateTariff: (index: number, tariffKodln: string, tariffName: string) => {
    const { property } = get();
    if (!property) return;
  
    const newProperty = { ...property };
    const baseProp = index === 1 ? '' : index;
    
    (newProperty as any)[`mas${baseProp}`] = parseInt(tariffKodln, 10);
    (newProperty as any)[`mas${baseProp}Name`] = tariffName;
  
    set({ property: newProperty });
  },
  
  updateSize: (index: number, newSize: number) => {
    const { property } = get();
    if (!property) return;
  
    const newProperty = { ...property };
    const prop = index === 1 ? 'godel' : `gdl${index}`;
    (newProperty as any)[prop] = newSize;
    
    set({ property: newProperty });
  }
}));