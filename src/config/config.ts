export const config = {
    odbc: {
        dsn: process.env.ODBC_DSN || 'brngviadev'  // שנה את זה לשם ה-DSN שלך
    },
    test: {
        propertyId: '10000011',    // שנה למספר נכס אמיתי מהמערכת
        mspKod: 7767,           // שנה למספר משלם אמיתי
        jobNum: 1               // מספר ג'וב לטסטים
    }
};