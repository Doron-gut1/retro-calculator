export interface Discount {
  hanCode: number;
  discountName: string;
  percentage: number;
  startDate: Date;
  endDate: Date;
  maxDiscountSize?: number;
  forceHan?: boolean;
  onlyForTrf?: number;
  onlyArn?: boolean;
}

export interface DiscountHistory {
  propertyId: string;
  discounts: Discount[];
  period: {
    start: Date;
    end: Date;
  };
}

export interface DiscountCalculation {
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
  appliedDiscounts: {
    code: number;
    name: string;
    amount: number;
  }[];
}