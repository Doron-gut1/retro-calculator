export class ErrorHandler {
  static handleError(error: Error, context: string = ''): void {
    console.error(`Error in ${context}:`, error);
    
    // ניתן להוסיף כאן לוגיקה נוספת לטיפול בשגיאות
    // כמו שליחה ל-logging service או הצגת הודעות למשתמש
  }

  static wrapAsync<T>(fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T> {
    return async (...args: any[]) => {
      try {
        return await fn(...args);
      } catch (error) {
        ErrorHandler.handleError(error as Error);
        throw error;
      }
    };
  }
}