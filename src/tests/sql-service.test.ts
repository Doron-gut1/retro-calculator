import { SqlService, SqlConfig } from '../services/sql-service';

// קונפיגורציה לטסטים
const testConfig: SqlConfig = {
    server: 'localhost',
    database: 'RetroCalc',
    user: 'sa',
    password: 'your-password',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

describe('SqlService Tests', () => {
    let sqlService: SqlService;

    beforeEach(() => {
        sqlService = new SqlService(testConfig);
    });

    afterEach(async () => {
        await sqlService.close();
    });

    test('searchProperty should return property details', async () => {
        const propertyId = '123456'; // שים מספר נכס אמיתי מהמערכת
        const result = await sqlService.searchProperty(propertyId);
        expect(result).toBeDefined();
        expect(result.hskod).toBe(propertyId);
    });

    test('getChargeTypes should return charge types list', async () => {
        const result = await sqlService.getChargeTypes();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result.some(type => type.sugts === 1010)).toBe(true);
    });

    test('full retro calculation process', async () => {
        const hs = '123456'; // שים מספר נכס אמיתי
        const mspkod = 1234;  // שים מספר משלם אמיתי

        // 1. הכנת נתונים
        await sqlService.prepareRetroData({ hs, mspkod });

        // 2. הכפלת שורות
        await sqlService.multiplyTempArnmforatRows({
            hs,
            sugtsList: '1010,1020',
            isYearlyCharge: false
        });

        // 3. קבלת תוצאות
        const results = await sqlService.getRetroResults({
            hs,
            jobnum: 1 // שים מספר job אמיתי
        });

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
    });
});