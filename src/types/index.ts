export interface Tariff {
  kod: string;
  name: string;
  amount: number;
}

export interface Size {
  id: number;
  size: number;
  tariffCode: string;
  tariffName: string;
  tariffAmount: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}