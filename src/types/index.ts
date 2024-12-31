export * from './calculation.types';
export * from './property.types';
export * from './discount.types';

// Common types used across the application
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}