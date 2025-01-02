import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property, CalculationResult, ValidationError } from '../types';

interface HistoryState {
  past: RetroState[];
  present: RetroState;
  future: RetroState[];
}

interface RetroState {
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  results: CalculationResult[];
  errors: ValidationError[];
}

interface Actions {
  setProperty: (property: Property | null) => void;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  setResults: (results: CalculationResult[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const isValidDate = (dateStr: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (year < 1900 || year > 2100) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
};

export const useRetroStore = create(
  persist<RetroState & Actions>(
    (set, get) => ({
      // Initial state
      property: null,
      selectedChargeTypes: [],
      startDate: null,
      endDate: null,
      results: [],
      errors: [],
      past: [],
      future: [],

      // Time travel actions
      undo: () => {
        const { past, present } = get() as unknown as HistoryState;
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set({
          past: newPast,
          ...previous,
          future: [present, ...get().future]
        });
      },

      redo: () => {
        const { future } = get() as unknown as HistoryState;
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
          past: [...get().past, get()],
          ...next,
          future: newFuture
        });
      },

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      // Actions with history tracking
      setProperty: (property) => {
        const currentState = get();
        set({
          past: [...currentState.past, currentState],
          property,
          future: []
        });
      },

      setSelectedChargeTypes: (types) => {
        const currentState = get();
        set({
          past: [...currentState.past, currentState],
          selectedChargeTypes: types,
          future: []
        });
      },

      setStartDate: (dateStr) => {
        const errors: ValidationError[] = [...get().errors.filter(e => e.field !== 'startDate')];
        
        if (!isValidDate(dateStr)) {
          errors.push({
            field: 'startDate',
            message: 'תאריך התחלה לא תקין'
          });
          set({ errors });
          return;
        }

        const newDate = new Date(dateStr);
        const endDate = get().endDate;

        if (endDate && newDate > endDate) {
          errors.push({
            field: 'startDate',
            message: 'תאריך התחלה חייב להיות לפני תאריך סיום'
          });
        }

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        if (newDate > oneYearFromNow) {
          errors.push({
            field: 'startDate',
            message: 'תאריך התחלה לא יכול להיות מעבר לשנה מהיום'
          });
        }

        const currentState = get();
        set({
          past: [...currentState.past, currentState],
          startDate: errors.length === 0 ? newDate : null,
          errors,
          future: []
        });
      },

      setEndDate: (dateStr) => {
        const errors: ValidationError[] = [...get().errors.filter(e => e.field !== 'endDate')];
        
        if (!isValidDate(dateStr)) {
          errors.push({
            field: 'endDate',
            message: 'תאריך סיום לא תקין'
          });
          set({ errors });
          return;
        }

        const newDate = new Date(dateStr);
        const startDate = get().startDate;

        if (startDate && newDate < startDate) {
          errors.push({
            field: 'endDate',
            message: 'תאריך סיום חייב להיות אחרי תאריך התחלה'
          });
        }

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        if (newDate > oneYearFromNow) {
          errors.push({
            field: 'endDate',
            message: 'תאריך סיום לא יכול להיות מעבר לשנה מהיום'
          });
        }

        const currentState = get();
        set({
          past: [...currentState.past, currentState],
          endDate: errors.length === 0 ? newDate : null,
          errors,
          future: []
        });
      },

      setResults: (results) => {
        const currentState = get();
        set({
          past: [...currentState.past, currentState],
          results,
          future: []
        });
      }
    }),
    {
      name: 'retro-calculator-storage',
      partialize: (state) => ({
        property: state.property,
        selectedChargeTypes: state.selectedChargeTypes,
        startDate: state.startDate,
        endDate: state.endDate
      })
    }
  )
);