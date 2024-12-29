// src/types/retro.ts

export interface PropertySize {
  index: number;
  size: number;
  tariffCode: number;
  notInDiscount: boolean;
  price: number;
  discountAmount: number;
}

export interface PropertyData {
  propertyCode: string;
  payerId: number;
  payerName: string;
  address: string;
  sizes: PropertySize[];
  startDate: Date;
  endDate: Date;
  validFrom: Date;
  validTo: Date;
  arrangementCode: number;
}

export interface DiscountData {
  code: number;
  name: string;
  percentage: number;
  maxSize: number;
  forceDiscount: boolean;
  onlyProperty: boolean;
  startDate: Date;
  endDate: Date;
}

export interface RetroCalculationResult {
  period: {
    month: number;
    year: number;
  };
  chargeType: number;
  amount: number;
  discount: number;
  total: number;
  explanation: string;
}

export interface RetroCalculationResults {
  propertyCode: string;
  calculationDate: Date;
  results: RetroCalculationResult[];
  totalAmount: number;
  totalDiscount: number;
  finalTotal: number;
}