import { create } from 'zustand';
import { RetroState, Property } from './types';
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
  tariffs: TariffDto[];         
  isLoading: boolean;           
  error: string | null;         
  selectedTariff: string | null;
  
  // פונקציות לניהול התעריפים
  fetchTariffs: (odbcName: string) => Promise<void>;
  clearTariffs: () => void;
  setSelectedTariff: (kodln: string | null) => void;
}

export const useTariffStore = create<TariffState>((set) => ({
  tariffs: [],
  isLoading: false,
  error: null,
  selectedTariff: null,

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
      console.error('Error fetching tariffs:', error);
    }
  },

  clearTariffs: () => set({ tariffs: [], error: null }),
  setSelectedTariff: (kodln) => set({ selectedTariff: kodln })
}));

// ... rest of the file stays the same