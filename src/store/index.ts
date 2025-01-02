import { create } from 'zustand';
import type { Property, CalculationResult, ValidationError } from '../types';

interface RetroState {
  property: Property | null;
  setProperty: (property: Property | null) => void;
  selectedChargeTypes: string[];
  setSelectedChargeTypes: (types: string[]) => void;
  startDate: Date | null;
  setStartDate: (dateStr: string) => void;
  endDate: Date | null;
  setEndDate: (dateStr: string) => void;
  results: CalculationResult[];
  setResults: (results: CalculationResult[]) => void;
  errors: ValidationError[];
}

const isValidDate = (dateStr: string): boolean => {
  // בדיקה שהפורמט נכון (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const [year, month, day] = dateStr.split('-').map(Number);

  // בדיקת טווח שנים הגיוני (1900-2100)
  if (year < 1900 || year > 2100) return false;

  // יצירת אובייקט תאריך
  const date = new Date(year, month - 1, day);

  // בדיקה שהתאריך תקין (למשל לא 31 בפברואר)
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
};

export const useRetroStore = create<RetroState>((set, get) => ({
  property: null,
  setProperty: (property) => set({ property }),
  selectedChargeTypes: [],
  setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
  startDate: null,
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

    set({ startDate: errors.length === 0 ? newDate : null, errors });
  },
  endDate: null,
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

    set({ endDate: errors.length === 0 ? newDate : null, errors });
  },
  results: [],
  setResults: (results) => set({ results }),
  errors: []
}));