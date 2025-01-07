export interface RetroState {
  property: any; // TODO: Add proper type
  startDate: Date | null;
  endDate: Date | null;
  selectedChargeTypes: string[];
  results: any[]; // TODO: Add proper type
  isLoading: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  type?: string;
}