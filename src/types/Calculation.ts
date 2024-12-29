export interface CalculationPeriod {
  startDate: Date;
  endDate: Date;
  mnt: number;
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
