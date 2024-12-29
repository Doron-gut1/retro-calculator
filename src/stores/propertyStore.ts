import { create } from 'zustand';
import { Property, Payer, PropertySize } from '../types';

interface PropertyState {
  property: Property | null;
  payer: Payer | null;
  sizes: PropertySize[];
  isLoading: boolean;
  error: string | null;
  
  setProperty: (property: Property | null) => void;
  setPayer: (payer: Payer | null) => void;
  setSizes: (sizes: PropertySize[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  property: null,
  payer: null,
  sizes: [],
  isLoading: false,
  error: null,

  setProperty: (property) => set({ property }),
  setPayer: (payer) => set({ payer }),
  setSizes: (sizes) => set({ sizes }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ 
    property: null,
    payer: null,
    sizes: [],
    isLoading: false,
    error: null
  })
}));
