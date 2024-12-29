export const config = {
    odbc: {
        dsn: process.env.ODBC_DSN || 'YourODBCName'  // שנה את זה לשם ה-DSN שלך
    },
    test: {
        propertyId: '123456',    // שנה למספר נכס אמיתי מהמערכת
        mspKod: 1234,           // שנה למספר משלם אמיתי
        jobNum: 1               // מספר ג'וב לטסטים
    }
};