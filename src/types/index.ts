export interface Property {
  id: string;
  address: string;
  type: string;
  payerId: string;
  payerName: string;
}

export interface ValidationError {
  field: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  timestamp?: number;
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

export interface RetroState {
  property: Property | null;
  selectedChargeTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  results: CalculationResult[];
  isLoading: boolean;
}

export interface Size {
  id: number;
  size: number;
  tariffCode: string;
  tariffName: string;
  tariffAmount: string;
}

export interface Tariff {
  code: string;
  name: string;
  amount: number;
}