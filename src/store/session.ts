import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  currentOdbc: string;
  currentJobNumber: number;
  urlParamsProcessed: boolean;
}

interface SessionActions {
  setSession: (params: Partial<SessionState>) => void;
  setUrlProcessed: () => void;
  reset: () => void;
}

const initialState: SessionState = {
  currentOdbc: 'DefaultODBC',
  currentJobNumber: 1,
  urlParamsProcessed: false
};

export const useSessionStore = create(
  persist<SessionState & SessionActions>(
    (set) => ({
      ...initialState,
      setSession: (params) => set((state) => ({ ...state, ...params })),
      setUrlProcessed: () => set({ urlParamsProcessed: true }),
      reset: () => set(initialState)
    }),
    {
      name: 'retro-session-storage',
      partialize: (state) => ({
        currentOdbc: state.currentOdbc,
        currentJobNumber: state.currentJobNumber
        // לא שומרים urlParamsProcessed בlocal storage
      })
    }
  )
);
