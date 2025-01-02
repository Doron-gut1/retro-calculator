import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property, CalculationResult, ValidationError } from '../types';

interface RetroState {
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  results: CalculationResult[];
  isLoading: boolean;
}

interface Actions {
  setProperty: (property: Property | null) => void;
  setSelectedChargeTypes: (types: string[]) => void;
  setStartDate: (dateStr: string) => void;
  setEndDate: (dateStr: string) => void;
  setResults: (results: CalculationResult[]) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
}

const initialState: RetroState = {
  property: null,
  selectedChargeTypes: [],
  startDate: null,
  endDate: null,
  results: [],
  isLoading: false
};

const validateDate = (dateStr: string): Date | null => {
  // בדיקה שהפורמט נכון (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;

  const [year, month, day] = dateStr.split('-').map(Number);

  // בדיקת טווח שנים הגיוני (1900-2100)
  if (year < 1900 || year > 2100) return null;

  const date = new Date(year, month - 1, day);

  // בדיקה שהתאריך תקין
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return null;

  return date;
};

export const useRetroStore = create(
  persist<RetroState & Actions>(
    (set, get) => ({
      ...initialState,

      setProperty: (property) => set({ property }),

      setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),

      setStartDate: (dateStr) => {
        const newDate = validateDate(dateStr);
        if (!newDate) {
          console.error('תאריך התחלה לא תקין');
          return;
        }

        const { endDate } = get();
        if (endDate && newDate > endDate) {
          console.error('תאריך התחלה חייב להיות לפני תאריך סיום');
          return;
        }

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        if (newDate > oneYearFromNow) {
          console.error('תאריך התחלה לא יכול להיות מעבר לשנה מהיום');
          return;
        }

        set({ startDate: newDate });
      },

      setEndDate: (dateStr) => {
        const newDate = validateDate(dateStr);
        if (!newDate) {
          console.error('תאריך סיום לא תקין');
          return;
        }

        const { startDate } = get();
        if (startDate && newDate < startDate) {
          console.error('תאריך סיום חייב להיות אחרי תאריך התחלה');
          return;
        }

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        if (newDate > oneYearFromNow) {
          console.error('תאריך סיום לא יכול להיות מעבר לשנה מהיום');
          return;
        }

        set({ endDate: newDate });
      },

      setResults: (results) => set({ results }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      reset: () => set(initialState),
      
      undo: () => {
        // יתווסף בהמשך
        console.log('undo');
      },
      
      redo: () => {
        // יתווסף בהמשך
        console.log('redo');
      },
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