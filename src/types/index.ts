// נתוני הסשן הנוכחי - הכרחי לחיבור לאקסס
export interface SessionParams {
  odbcName: string | null;
  jobNumber: number | null;
}
export interface TariffResponse {
  kodln: number;
  teur: string;
}


// נתוני נכס מהDB
export interface Property {
  hskod: string;    // מזהה נכס
  ktovet: string;   // כתובת
  mspkod: number;   // קוד משלם
  maintz: string;   // מספר משלם
  fullname: string; // שם משלם
  sughs: number;    // סוג נכס
  // גדלים
  godel?: number | null;    // גודל ראשי
  gdl2?: number | null;    // גדלים נוספים
  gdl3?: number | null;
  gdl4?: number | null;
  gdl5?: number | null;
  gdl6?: number | null;
  gdl7?: number | null;
  gdl8?: number | null;
  // תעריפים
  mas?: number | null;      // תעריף ראשי
  mas2?: number | null;    // תעריפים נוספים
  mas3?: number | null;
  mas4?: number | null;
  mas5?: number | null;
  mas6?: number | null;
  mas7?: number | null;
  mas8?: number | null;
  hesder?: number | null;  // הסדר (0/1/3/7)

  masName?: string | null;   // שם תעריף ראשי
  mas2Name?: string | null; // שמות תעריפים נוספים
  mas3Name?: string | null;
  mas4Name?: string | null;
  mas5Name?: string | null;
  mas6Name?: string | null;
  mas7Name?: string | null;
  mas8Name?: string | null;
}

// תוצאות החישוב כפי שחוזרות מהAPI
export interface RetroResult {
  moneln: string;
  mnt: string;
  mnt_display: string;
  hs: string;
  mspkod: string;
  sugts: string;
  sugtsname: string;
  paysum: string;
  sumhan: string;
  dtval: string;
  dtgv: string;
  hesber: string;
  TASHREM: string;
}


// מצב האפליקציה
export interface RetroState {
  sessionParams: SessionParams;
  property: Property | null;
  startDate: Date | null;
  endDate: Date | null;
  selectedChargeTypes: number[];
  results: RetroResult[];
  isLoading: boolean;
  availableTariffs: TariffResponse[];
}

// Props של קומפוננטות
export interface PropertySearchProps {
  onPropertySelect: (property: Property) => void;
}

export interface DateRangeSelectProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

export interface ChargeTypesSelectProps {
  selected: number[];
  onChange: (types: number[]) => void;
}

export interface CalculationButtonsProps {
  onCalculate: () => Promise<void>;
  disabled?: boolean;
}