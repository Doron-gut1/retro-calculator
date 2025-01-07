// נתוני הסשן הנוכחי - הכרחי לחיבור לאקסס
export interface SessionParams {
  odbcName: string | null;
  jobNumber: number | null;
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
  godel: number;    // גודל ראשי
  gdl2?: number;    // גדלים נוספים
  gdl3?: number;
  gdl4?: number;
  gdl5?: number;
  gdl6?: number;
  gdl7?: number;
  gdl8?: number;
  // תעריפים
  mas: number;      // תעריף ראשי
  mas2?: number;    // תעריפים נוספים
  mas3?: number;
  mas4?: number;
  mas5?: number;
  mas6?: number;
  mas7?: number;
  mas8?: number;
  hesder?: number;  // הסדר (0/1/3/7)
}

// תוצאות החישוב כפי שחוזרות מהAPI
export interface RetroResult {
  period: string;     // MM/YY לדוגמה 01/25
  chargeType: string; // סוג חיוב
  amount: number;     // סכום
  discount: number;   // הנחה
  total: number;      // סה"כ
  hesderSum?: number; // סכום הסדר
  hesber?: string;   // הסבר/הערות
  dtgv?: string;     // תאריך גביה
  dtval?: string;    // תאריך ערך
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