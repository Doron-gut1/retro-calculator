import { create } from 'zustand';
import type { Property, CalculationResult, ValidationError } from '../types';

interface RetroState {
  property: Property | null;
  setProperty: (property: Property | null) => void;
  selectedChargeTypes: string[];
  setSelectedChargeTypes: (types: string[]) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  results: CalculationResult[];
  setResults: (results: CalculationResult[]) => void;
  errors: ValidationError[];
  validateDates: (start: Date | null, end: Date | null) => boolean;
  startCalculation: () => Promise<void>;
  confirmCalculation: () => Promise<void>;
}

export const useRetroStore = create<RetroState>((set, get) => ({
  property: null,
  setProperty: (property) => set({ property }),
  selectedChargeTypes: [],
  setSelectedChargeTypes: (types) => set({ selectedChargeTypes: types }),
  startDate: null,
  setStartDate: (date) => {
    if (get().validateDates(date, get().endDate)) {
      set({ startDate: date, errors: [] });
    }
  },
  endDate: null,
  setEndDate: (date) => {
    if (get().validateDates(get().startDate, date)) {
      set({ endDate: date, errors: [] });
    }
  },
  results: [],
  setResults: (results) => set({ results }),
  errors: [],
  validateDates: (start, end) => {
    const errors: ValidationError[] = [];
    
    if (start && end) {
      const today = new Date();
      const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

      if (start > end) {
        errors.push({
          field: 'dates',
          message: 'תאריך התחלה חייב להיות לפני תאריך סיום'
        });
      }

      if (end > oneYearFromNow) {
        errors.push({
          field: 'dates',
          message: 'תאריך סיום לא יכול להיות מעבר לשנה מהיום'
        });
      }
    }

    set({ errors });
    return errors.length === 0;
  },
  startCalculation: async () => {
    const { property, startDate, endDate, selectedChargeTypes } = get();
    
    // Validate all required fields
    if (!property || !startDate || !endDate || selectedChargeTypes.length === 0) {
      set({
        errors: [{
          field: 'calculation',
          message: 'חובה למלא את כל השדות לפני החישוב'
        }]
      });
      return;
    }

    // For now, set mock results
    const mockResults: CalculationResult[] = [
      {
        period: '01/2024',
        chargeType: 'ארנונה',
        amount: 1500,
        discount: 150,
        total: 1350
      }
    ];

    set({ results: mockResults });
  },
  confirmCalculation: async () => {
    const { results } = get();
    if (results.length === 0) {
      set({
        errors: [{
          field: 'confirmation',
          message: 'אין תוצאות לאישור'
        }]
      });
      return;
    }
    // In future: send to server
    console.log('Confirming calculation:', results);
  }
}));