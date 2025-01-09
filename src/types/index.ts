export interface SessionParams {
  odbcName: string | null;
  jobNumber: number | null;
}

export interface Property {
  hskod: string;
  mspkod: number;
  maintz: string;
  fullname: string;
  godel: number;
  mas: number;
  masName?: string;
  gdl2?: number;
  mas2?: number;
  mas2Name?: string;
  gdl3?: number;
  mas3?: number;
  mas3Name?: string;
  gdl4?: number;
  mas4?: number;
  mas4Name?: string;
  gdl5?: number;
  mas5?: number;
  mas5Name?: string;
  gdl6?: number;
  mas6?: number;
  mas6Name?: string;
  gdl7?: number;
  mas7?: number;
  mas7Name?: string;
  gdl8?: number;
  mas8?: number;
  mas8Name?: string;
}

export interface RetroResult {
  period: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
  hesderSum?: number;
  hesber?: string;
  dtgv?: string;
  dtval?: string;
}

export interface RetroState {
  sessionParams: SessionParams;
  property: Property | null;
  startDate: string | null;
  endDate: string | null;
  selectedChargeTypes: number[];
  results: RetroResult[];
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // Actions
  setSessionParams: (params: SessionParams) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  setSelectedChargeTypes: (types: number[]) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  calculateRetro: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}