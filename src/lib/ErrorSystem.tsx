import React from 'react';
import { create } from 'zustand';

interface ErrorState {
  errors: Array<{
    id: string;
    message: string;
    field?: string;
    timestamp: number;
  }>;
  fieldErrors: Record<string, string>;
}

interface ErrorActions {
  addError: (error: string | Error) => void;
  removeError: (id: string) => void;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;
}

export const useErrorStore = create<ErrorState & ErrorActions>()((set, get) => ({
  errors: [],
  fieldErrors: {},

  addError: (error: string | Error) => {
    const errorMessage = error instanceof Error ? error.message : error;
    const newError = {
      id: Math.random().toString(36).substr(2, 9),
      message: errorMessage,
      timestamp: Date.now(),
    };

    set((state) => ({
      errors: [...state.errors, newError].filter((e) => 
        Date.now() - e.timestamp < 5000
      ),
    }));

    setTimeout(() => {
      set((state) => ({
        errors: state.errors.filter((error) => error.id !== newError.id),
      }));
    }, 5000);
  },

  removeError: (id: string) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.id !== id),
    }));
  },

  setFieldError: (field: string, error: string) => {
    set((state) => ({
      fieldErrors: { ...state.fieldErrors, [field]: error },
    }));
  },

  clearFieldError: (field: string) => {
    set((state) => {
      const { [field]: _, ...rest } = state.fieldErrors;
      return { fieldErrors: rest };
    });
  },

  clearAllErrors: () => {
    set({ errors: [], fieldErrors: {} });
  },
}));

export const useError = () => {
  const { addError } = useErrorStore((state) => state);
  const { setFieldError } = useErrorStore((state) => state);

  const handleError = React.useCallback(
    (e: Error | string, field?: string) => {
      if (field) {
        setFieldError(field, typeof e === 'string' ? e : e.message);
      } else {
        addError(e);
      }
    },
    [addError, setFieldError]
  );

  return { handleError };
};
