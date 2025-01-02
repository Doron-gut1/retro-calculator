import { create } from 'zustand';

interface HistoryState<T> {
  past: T[];
  present: T | null;
  future: T[];
  maxSize: number;
}

interface HistoryActions<T> {
  push: (state: T) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const createHistoryManager = <T>(maxSize: number = 50) => {
  return create<HistoryState<T> & HistoryActions<T>>((set, get) => ({
    past: [],
    present: null,
    future: [],
    maxSize,

    push: (newState: T) => set(state => {
      // אם זה המצב הראשון
      if (!state.present) {
        return {
          past: [],
          present: newState,
          future: []
        };
      }

      // שמירת היסטוריה עם הגבלת גודל
      const newPast = [...state.past, state.present].slice(-state.maxSize);
      
      return {
        past: newPast,
        present: newState,
        future: []
      };
    }),

    undo: () => set(state => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: state.present ? [state.present, ...state.future] : state.future
      };
    }),

    redo: () => set(state => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: state.present ? [...state.past, state.present] : state.past,
        present: next,
        future: newFuture
      };
    }),

    clear: () => set({
      past: [],
      present: null,
      future: [],
    }),

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0
  }));
};