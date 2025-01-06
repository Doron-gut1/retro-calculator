// בקשת חישוב רטרו
export interface RetroCalculationRequest {
  propertyId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  chargeTypes: number[];
  jobNumber: number;
}

// שורת תוצאה מהשרת
export interface RetroResultRow {
  mnt: string; // תקופה
  mnt_display: string; // תצוגת תקופה
  sugts: number; // קוד סוג חיוב
  sugtsname: string; // שם סוג חיוב
  paysum: string; // סכום
  sumhk: string; // סכום הסדר
  dtgv: string; // תאריך גביה
  dtval: string; // תאריך ערך
  hesber?: string; // הסבר אם יש
}

// תגובת חישוב מהשרת
export interface RetroCalculationResponse {
  rows: RetroResultRow[];
}

// סוגי שגיאות אפשריות
export type ApiError = {
  error: string;
  details?: string;
};
