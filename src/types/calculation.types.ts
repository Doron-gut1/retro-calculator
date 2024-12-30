export interface CalculationPeriod {
  startDate: Date;
  endDate: Date;
}

export interface ChargeType {
  sugts: number;
  name: string;
  isSelected: boolean;
}

export interface CalculationResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

export interface RetroCalculation {
  propertyId: string;
  period: CalculationPeriod;
  chargeTypes: number[];
  results: CalculationResult[];
}