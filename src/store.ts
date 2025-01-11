import { create } from 'zustand';
import { RetroState ,Property} from './types';
import axios from 'axios';

type SessionParams = {
  odbcName: string | null;
  jobNumber: number | null;
};


export interface TariffDto {
  kodln: string;  // קוד התעריף
  teur: string;   // תיאור התעריף
}
interface TariffState {
  tariffs: TariffDto[];         // מערך התעריפים
  isLoading: boolean;           // מצב טעינה
  error: string | null;         // הודעות שגיאה
  
  // פונקציות לניהול התעריפים
  fetchTariffs: (odbcName: string) => Promise<void>;
  clearTariffs: () => void;
}

export const useTariffStore = create<TariffState>((set) => ({
  tariffs: [],
  isLoading: false,
  error: null,

  fetchTariffs: async (odbcName) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.get(`/api/property/tariffs`, {
        params: { odbcName }
      });
      
      set({ 
        tariffs: response.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to fetch tariffs', 
        isLoading: false 
      });
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
  addSize: () => void;
  deleteSize: (index: number) => void;
  setAvailableTariffs: (tariffs: TariffResponse[]) => void;  // עדכון רשימת התעריפים
  fetchTariffs: (odbcName: string) => Promise<void>;  // טעינת התעריפים מהשרת
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
    
   
    set({ isLoading: true, error: null });
    try {
      const url = `https://localhost:5001/api/Property/${propertyCode}`;
      console.log('Fetching from URL:', url);
      
      const response = await axios.get(url, {
        params: { 
          odbcName: state.sessionParams.odbcName 
        }
      });
      
      const apiData: ApiPropertyResponse = response.data;
      console.log('Received data:', apiData);
      
      // מיפוי הנתונים למבנה הנכון
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

  reset: () => set(initialState),

  addSize: () => {
    const { property } = get();
    if (!property) return;
  
    const sizeProps = ['godel', 'gdl2', 'gdl3', 'gdl4', 'gdl5', 'gdl6', 'gdl7', 'gdl8'] as const;
    const emptyIndex = sizeProps.findIndex(prop => property[prop] === undefined);
    
    if (emptyIndex === -1) {
      set({ error: 'לא ניתן להוסיף יותר גדלים' });
      return;
    }
  
    const newProperty = { ...property };
    const prop = sizeProps[emptyIndex];
    newProperty[prop] = null;
    
    const tariffProp = `mas${emptyIndex === 0 ? '' : emptyIndex + 1}` as const;
    (newProperty as any)[tariffProp] = null;
    
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
  }
}));