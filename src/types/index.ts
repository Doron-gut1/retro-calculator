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
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

export interface Size {
  id: number;
  size: number;
  tariffCode: string;
  tariffName: string;
  tariffAmount: string;
}

export interface TariffInfo {
  code: string;
  name: string;
  amount: number;
}
