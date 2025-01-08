/*
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  currentOdbc: string;
  currentJobNumber: number;
  urlParamsProcessed: boolean;
}

interface SessionActions {
  setSession: (params: Partial<SessionState>) => void;
  reset: () => void;
}

const initialState: SessionState = {
  currentOdbc: '',
  currentJobNumber: 0,
  urlParamsProcessed: false
};

console.log('Creating session store with initial state:', initialState);

export const useSessionStore = create(
  persist<SessionState & SessionActions>(
    (set) => ({
      ...initialState,
      setSession: (params) => {
        console.log('Session setSession called with:', params);
        set((state) => {
          const newState = { ...state, ...params };
          console.log('New session state:', newState);
          return newState;
        });
      },
      reset: () => {
        console.log('Session store reset');
        set(initialState);
      }
    }),
    {
      name: 'retro-session-storage',
      partialize: (state: SessionState & SessionActions): SessionState => ({
        currentOdbc: state.currentOdbc,
        currentJobNumber: state.currentJobNumber,
        urlParamsProcessed: state.urlParamsProcessed
      })
    }
  )
);
*/
