import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

interface FormState {
  property: Property | null;
  startDate: Date | null;
  endDate: Date | null;
  selectedChargeTypes: number[];
}

interface FormActions {
  setProperty: (property: Property | null) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setSelectedChargeTypes: (types: number[]) => void;
  reset: () => void;
}

const initialState: FormState = {
  property: null,
  startDate: null,
  endDate: null,
  selectedChargeTypes: []
};

console.log('Creating form store with initial state:', initialState);

export const useFormStore = create(
  persist<FormState & FormActions>(
    (set) => ({
      ...initialState,
      setProperty: (property) => {
        console.log('Form setProperty called with:', property);
        set({ property });
      },
      setStartDate: (date) => {
        console.log('Form setStartDate called with:', date);
        set({ startDate: date });
      },
      setEndDate: (date) => {
        console.log('Form setEndDate called with:', date);
        set({ endDate: date });
      },
      setSelectedChargeTypes: (types) => {
        console.log('Form setSelectedChargeTypes called with:', types);
        set({ selectedChargeTypes: types });
      },
      reset: () => {
        console.log('Form store reset');
        set(initialState);
      }
    }),
    {
      name: 'retro-form-storage',
      partialize: (state: FormState & FormActions): FormState => ({
        property: state.property,
        startDate: state.startDate,
        endDate: state.endDate,
        selectedChargeTypes: state.selectedChargeTypes
      })
    }
  )
);
