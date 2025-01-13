import { create } from 'zustand';
import { RetroState ,Property,TariffResponse} from './types';
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
  selectedTariff: null,

  fetchTariffs: async (odbcName) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.get(`https://localhost:5001/api/Property/tariffs?odbcName=${odbcName}`, {
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
      console.error('Error fetching tariffs:', error);
    }
  },

  clearTariffs: () => set({ tariffs: [], error: null }),
  //setSelectedTariff: (kodln) => set({ selectedTariff: kodln })
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
  updateTariff: (index: number, tariffKodln: string, tariffName: string) => void;
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

  // בתוך src/store.ts
  calculateRetro: async () => {
    const state = get();
    
    console.log('Starting calculation with state:', {
      property: state.property?.hskod,
      dates: { 
        start: state.startDate, 
        end: state.endDate 
      },
      chargeTypes: state.selectedChargeTypes,
      odbcName: state.sessionParams.odbcName
    });


    // ולידציה מורחבת
    if (!state.property) {
      set({ error: 'נא לבחור נכס' });
      return;
    }
    if (!state.startDate || !state.endDate) {
      set({ error: 'נא להזין תאריך התחלה וסיום' });
      return;
    }
    if (!state.selectedChargeTypes?.length) {
      set({ error: 'נא לבחור לפחות סוג חיוב אחד' });
      return;
    }
    if (state.startDate > state.endDate) {
      set({ error: 'תאריך התחלה חייב להיות לפני תאריך סיום' });
      return;
    }
  
    set({ isLoading: true, error: null });
    try {
      // בניית מערך הגדלים לפי הפורמט החדש
      const sizes = [
        { index: 1, size: state.property.godel || 0, tariffCode: state.property.mas || 0 },
        { index: 2, size: state.property.gdl2 || 0, tariffCode: state.property.mas2 || 0 },
        { index: 3, size: state.property.gdl3 || 0, tariffCode: state.property.mas3 || 0 },
        { index: 4, size: state.property.gdl4 || 0, tariffCode: state.property.mas4 || 0 },
        { index: 5, size: state.property.gdl5 || 0, tariffCode: state.property.mas5 || 0 },
        { index: 6, size: state.property.gdl6 || 0, tariffCode: state.property.mas6 || 0 },
        { index: 7, size: state.property.gdl7 || 0, tariffCode: state.property.mas7 || 0 },
        { index: 8, size: state.property.gdl8 || 0, tariffCode: state.property.mas8 || 0 }
      ].filter(size => size.size > 0 && size.tariffCode > 0); // שולח רק גדלים ותעריפים תקינים
      //const url = `https://localhost:5001/api/Retro/calculate?odbcName=${odbcName}`;
    console.log('Filtered sizes:', sizes);

    const requestUrl = `/api/Retro/calculate`;
    const requestBody = {
      propertyId: state.property.hskod,
      startDate: state.startDate,
      endDate: state.endDate,
      chargeTypes: state.selectedChargeTypes,
      jobNumber: state.sessionParams.jobNumber || 0,
      hkarn: 0,
      sizes
    };
    const requestConfig = {
      params: {
        odbcName: state.sessionParams.odbcName
      }
    };

    console.log('Making API request:', {
      url: requestUrl,
      body: requestBody,
      config: requestConfig
    });

    const response = await axios.post(requestUrl, requestBody, requestConfig);

    console.log('Received API response:', response.data);

    if (response.data) {
      set({ 
        results: response.data,
        success: 'החישוב הושלם בהצלחה' 
      });
    }
  } catch (error) {
    console.error('Detailed error in calculateRetro:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      //response: error.response?.data, // אם יש תגובת שגיאה מהשרת
      //status: error.response?.status
    });
    set({
      error: error instanceof Error ? error.message : 'שגיאה בחישוב רטרו'
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
    const emptyIndex = sizeProps.findIndex(prop => !property[prop] && property[prop] !== 0);
    
    if (emptyIndex === -1) {
      set({ error: 'לא ניתן להוסיף יותר גדלים' });
      return;
    }
  
    const newProperty = { ...property };
    const prop = sizeProps[emptyIndex];
    newProperty[prop] = 0;  // נאתחל ב-0 במקום null
    
    const tariffProp = `mas${emptyIndex === 0 ? '' : emptyIndex + 1}` as const;
    (newProperty as any)[tariffProp] = 0;  // נאתחל ב-0 במקום null
    
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
    console.log('Store updateTariff called:', { index, tariffKodln, tariffName });
    
    const { property } = get();
    if (!property) {
      console.log('No property found');
      return;
    }
  
    const newProperty = { ...property };
    const baseProp = index === 1 ? '' : index;
    
    console.log('Updating property:', {
      masKey: `mas${baseProp}`,
      nameKey: `mas${baseProp}Name`,
      //currentValue: property[`mas${baseProp}`],
      newCode: parseInt(tariffKodln, 10),
      newName: tariffName
    });
  
    // Update tariff code and name
    (newProperty as any)[`mas${baseProp}`] = parseInt(tariffKodln, 10);
    (newProperty as any)[`mas${baseProp}Name`] = tariffName;
  
    console.log('Property after update:', newProperty);
    set({ property: newProperty });
  }
  /* setAvailableTariffs: (tariffs: TariffDto[]) => {
    set({ availableTariffs: tariffs });
  },

  fetchTariffs: async (odbcName: string) => {
    try {
      const response = await axios.get('/api/property/tariffs', {
        params: { odbcName }
      });
      set({ availableTariffs: response.data });
    } catch (error) {
      console.error('Error fetching tariffs:', error);
      set({ error: 'Failed to fetch tariffs' });
    }
  } */
}));