export interface RetroCalculationData {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  chargeTypes: number[];
  sizes: PropertySize[];
  discounts?: DiscountData[];
  payerId?: string;
}

export interface PropertySize {
  id: number;
  size: number;
  tariffCode: string;
  tariffName: string;
  tariffAmount: number;
}

export interface DiscountData {
  code: number;
  percentage: number;
  startDate: Date;
  endDate: Date;
}

export interface RetroCalculationResult {
  success: boolean;
  results?: {
    period: string;
    chargeType: string;
    amount: number;
    discount: number;
    total: number;
  }[];
  totals?: {
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
  };
  error?: string;
}

export interface ChargeType {
  sugts: number;
  name: string;
  isSelected: boolean;
  isYearly?: boolean;
}