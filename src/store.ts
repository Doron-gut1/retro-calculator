import { create } from 'zustand';

export interface Property {
  id: string;
  address: string;
  type: string;
  payerId: string;
  payerName: string;
  sizes: Size[];
}

export interface Size {
  id: number;
  size: number;
  tariffCode: string;
  tariffName: string;
  tariffAmount: string;
}

interface RetroState {
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  results: CalculationResult[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

const initialState: RetroState = {
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  results: [],
  isLoading: false,
  error: null,
  success: null
};

export const useRetroStore = create<RetroState>((set, get) => ({
  ...initialState,

  searchProperty: async (propertyCode: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`https://localhost:5001/api/Property/${propertyCode}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.statusText}`);
      }

      const data = await response.json();
      set({ property: data });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch property',
        property: null 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedChargeTypes: (types: string[]) => set({ selectedChargeTypes: types }),

  setStartDate: (date: Date | null) => set({ startDate: date }),

  setEndDate: (date: Date | null) => set({ endDate: date }),

  calculateRetro: async () => {
    const state = get();
    if (!state.property || !state.startDate || !state.endDate || state.selectedChargeTypes.length === 0) {
      set({ error: 'Please fill all required fields before calculation' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const response = await fetch('https://localhost:5001/api/Retro/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: state.property.id,
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