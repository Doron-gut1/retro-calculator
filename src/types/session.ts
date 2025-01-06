// מידע על הסשן הנוכחי
export interface SessionParams {
  odbcName: string | null;
  jobNumber: number | null;
}

// תגובה מהשרת בפתיחה מהאקסס
export interface OpenFromAccessResponse {
  success: boolean;
  odbcName: string;
  jobNum: number;
  error?: string;
}