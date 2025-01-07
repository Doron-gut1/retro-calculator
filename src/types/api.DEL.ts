export interface RetroResultRow {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
  mnt: string;
  mnt_display: string;
  sugts: number;
  sugtsname: string;
  paysum: string;
  sumhk: string;
  dtgv: string;
  dtval: string;
  hesber?: string;
}

export type CalculationResult = RetroResultRow;

export interface RetroCalculationRequest {
  propertyId: string;
  startDate: string;
  endDate: string;
  chargeTypes: number[];
  jobNumber: number;
}

export interface RetroCalculationResponse {
  rows: RetroResultRow[];
}

export interface OpenFromAccessResponse {
  success: boolean;
  odbcName: string;
  jobNum: number;
  error?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}