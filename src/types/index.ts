export interface SessionParams {
    odbcName: string | null;
    jobNumber: number | null;
}

export interface Property {
    hskod: string;
    ktovet: string;
    mspkod: number;
    maintz: string;
    fullname: string;
    sughs: number;
    godel: number;
    mas: number;
    gdl2?: number;
    mas2?: number;
    gdl3?: number;
    mas3?: number;
    gdl4?: number;
    mas4?: number;
    gdl5?: number;
    mas5?: number;
    gdl6?: number;
    mas6?: number;
    gdl7?: number;
    mas7?: number;
    gdl8?: number;
    mas8?: number;
}

export interface RetroResult {
    period: string;
    chargeType: string;
    amount: number;
    discount: number;
    total: number;
}

export interface RetroState {
    // State
    sessionParams: SessionParams;
    property: Property | null;
    selectedChargeTypes: number[];
    startDate: Date | null;
    endDate: Date | null;
    results: RetroResult[];
    isLoading: boolean;
    error: string | null;
    success: string | null;

    // Actions
    searchProperty: (propertyCode: string) => Promise<void>;
    setSelectedChargeTypes: (types: number[]) => void;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    calculateRetro: () => Promise<void>;
    clearError: () => void;
    clearSuccess: () => void;
    reset: () => void;
}