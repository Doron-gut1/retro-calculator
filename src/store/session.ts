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
    (set, get) => ({
      ...initialState,
      setSession: (params) => {
        console.log('setSession called with params:', params);
        const currentState = get();
        console.log('Current state before update:', currentState);
        set((state) => {
          const newState = { ...state, ...params };
          console.log('New state after update:', newState);
          return newState;
        });
      },
      setUrlProcessed: () => set({ urlParamsProcessed: true }),
      reset: () => set(initialState)
    }),
    {
      name: 'retro-session-storage',
      // רק שומרים את הstate עצמו, בלי הפונקציות
      partialize: (state) => ({
        currentOdbc: state.currentOdbc,
        currentJobNumber: state.currentJobNumber,
        urlParamsProcessed: state.urlParamsProcessed // עכשיו כן שומרים את זה
      })
    }
  )
);
