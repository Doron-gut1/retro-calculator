import React from 'react';
import { create } from 'zustand';
import { AnimatedAlert } from '@/components/UX/AnimatedAlert';

export interface ErrorMessage {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
  timeout?: number;
  timestamp?: number;
}

interface ErrorState {
  errors: ErrorMessage[];
  lastCheck: number;
  addError: (error: Omit<ErrorMessage, 'id'>) => void;
  removeError: (id: string) => void;
  removeFieldError: (field: string) => void;
  clearErrors: () => void;
  hasErrors: () => boolean;
  getFieldErrors: (field: string) => ErrorMessage[];
}

export const useErrorSystem = create<ErrorState>((set, get) => ({
  errors: [],
  lastCheck: Date.now(),

  addError: (error) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timeout = error.timeout || 5000;
    const timestamp = Date.now();

    set((state) => ({
      errors: [...state.errors.filter(e => e.field !== error.field), { ...error, id, timestamp }],
      lastCheck: timestamp
    }));

    if (timeout > 0) {
      setTimeout(() => {
        get().removeError(id);
      }, timeout);
    }
  },

  removeError: (id) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.id !== id),
      lastCheck: Date.now()
    }));
  },

  removeFieldError: (field) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.field !== field),
      lastCheck: Date.now()
    }));
  },

  clearErrors: () => set({
    errors: [],
    lastCheck: Date.now()
  }),

  hasErrors: () => get().errors.length > 0,

  getFieldErrors: (field: string) => 
    get().errors.filter(e => e.field === field)
}));

export const ErrorDisplay: React.FC = () => {
  const errors = useErrorSystem((state) => state.errors);
  const removeError = useErrorSystem((state) => state.removeError);

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 max-w-md">
      {errors.map((error) => (
        <AnimatedAlert
          key={error.id}
          type={error.type}
          title={error.field ? `שגיאה ב${error.field}` : 'שגיאה'}
          message={error.message}
          onClose={() => removeError(error.id)}
        />
      ))}    
    </div>
  );
};