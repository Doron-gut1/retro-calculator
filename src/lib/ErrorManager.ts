import { create } from 'zustand';

export interface ValidationError {
  field: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  timestamp?: number;
}

interface ErrorState {
  errors: ValidationError[];
  lastCheck: number;
}

interface ErrorActions {
  addError: (error: ValidationError) => void;
  removeError: (field: string) => void;
  clearErrors: () => void;
  hasErrors: () => boolean;
  getFieldErrors: (field: string) => ValidationError[];
}

export const useErrorStore = create<ErrorState & ErrorActions>((set, get) => ({
  errors: [],
  lastCheck: Date.now(),

  addError: (error: ValidationError) => set(state => ({
    errors: [...state.errors.filter(e => e.field !== error.field), {
      ...error,
      timestamp: Date.now(),
      type: error.type || 'error'
    }],
    lastCheck: Date.now()
  })),

  removeError: (field: string) => set(state => ({
    errors: state.errors.filter(e => e.field !== field),
    lastCheck: Date.now()
  })),

  clearErrors: () => set({
    errors: [],
    lastCheck: Date.now()
  }),

  hasErrors: () => get().errors.length > 0,

  getFieldErrors: (field: string) => 
    get().errors.filter(e => e.field === field)
}));