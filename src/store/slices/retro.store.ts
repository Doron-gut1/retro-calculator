import { create } from 'zustand';
import { Property } from '../../types';

type RetroState = {
  property: Property | null;
  loading: boolean;
  error: string | null;
};

type RetroActions = {
  setProperty: (property: Property | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
};

export const useRetroStore = create<RetroState & RetroActions>((set) => ({
  property: null,
  loading: false,
  error: null,
  setProperty: (property) => set({ property }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearAll: () => set({ property: null, loading: false, error: null })
}));