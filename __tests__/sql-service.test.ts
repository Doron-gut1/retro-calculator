import { SqlService } from '../src/services/sql-service';
import { config } from '../src/config/config';

describe('SqlService Tests', () => {
    let sqlService: SqlService;

    beforeEach(() => {
        sqlService = new SqlService(config.odbc.dsn);
    });

    afterEach(async () => {
        await sqlService.close();
    });

    test('searchProperty should return property details', async () => {
        const result = await sqlService.searchProperty(config.test.propertyId);
        expect(result).toBeDefined();
        expect(result.hskod).toBe(config.test.propertyId);
    });

    test('getChargeTypes should return charge types list', async () => {
        const result = await sqlService.getChargeTypes();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result.some(type => type.sugts === 1010)).toBe(true);
    });

    test('full retro calculation process', async () => {
        // 1. הכנת נתונים
        await sqlService.prepareRetroData({
            hs: config.test.propertyId,
            mspkod: config.test.mspKod
        });

        // 2. הכפלת שורות
        await sqlService.multiplyTempArnmforatRows({
            hs: config.test.propertyId,
            sugtsList: '1010,1020',
            isYearlyCharge: false
        });

        // 3. קבלת תוצאות
        const results = await sqlService.getRetroResults({
            hs: config.test.propertyId,
            jobnum: config.test.jobNum
        });

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
        
        // הדפסת תוצאות לבדיקה
        console.log('Retro calculation results:', results);
    });
});