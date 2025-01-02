export interface PayerInfo {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  address: string;
  payerInfo?: PayerInfo;
  sizes: PropertySize[];
}

export interface PropertySize {
  index: number;
  size: number;
  tariffCode: string;
  tariffName: string;
  price: number;
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}
