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

console.log('Creating session store with initial state:', initialState);

export const useSessionStore = create(
  persist<SessionState & SessionActions>(
    (set, get) => {
      console.log('Initializing session store middleware');
      return {
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
        setUrlProcessed: () => {
          console.log('setUrlProcessed called');
          set({ urlParamsProcessed: true });
        },
        reset: () => {
          console.log('reset called');
          set(initialState);
        }
      };
    },
    {
      name: 'retro-session-storage',
      partialize: (state) => {
        const persistedState = {
          currentOdbc: state.currentOdbc,
          currentJobNumber: state.currentJobNumber
        };
        console.log('Persisting state:', persistedState);
        return persistedState;
      }
    }
  )
);
