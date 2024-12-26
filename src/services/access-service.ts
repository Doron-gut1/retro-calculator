// ייצוג זמני עד לחיבור ל-Access בפועל
class AccessService {
  private apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  async searchProperty(propertyId: string) {
    try {
      // TODO: החלפה לקריאה מ-Access
      return {
        hs: propertyId,
        mspkod: 12345,
        ktovet: 'רחוב הדוגמה 1',
        maintz: 'ישראל ישראלי',
        sizes: {
          gdl1: 80,
          gdl2: 20,
          gdl3: 15,
          gdl4: 0,
          gdl5: 0,
          gdl6: 0,
          gdl7: 0,
          gdl8: 0
        },
        tariffs: {
          trf1: 101,
          trf2: 102,
          trf3: 103,
          trf4: 0,
          trf5: 0,
          trf6: 0,
          trf7: 0,
          trf8: 0
        }
      };
    } catch (error) {
      throw new Error(`שגיאה בחיפוש נכס: ${error.message}`);
    }
  }

  async calculateRetro(params: {
    hs: string;
    mspkod: number;
    dtStart: string;
    dtEnd: string;
    sugts: number[];
  }) {
    try {
      // 1. יצירת רשומה ב-TEMPARNMFORAT
      await this.createTempArnMforat({
        hs: params.hs,
        mspkod: params.mspkod,
        dtStart: params.dtStart,
        dtEnd: params.dtEnd,
        sugts: params.sugts[0], // רק הראשון בינתיים
        jobnum: Date.now() // זמני - צריך להחליף למספר מזהה אמיתי
      });

      // 2. הרצת PrepareRetroData
      await this.execPrepareRetroData(params.hs, params.mspkod);
      
      // 3. הרצת MultiplyTempArnmforatRows
      await this.execMultiplyTempArnmforatRows(params.hs, params.sugts.join(','));
      
      // 4. קריאה ל-DLL דרך CalcRetroProcessManager
      await this.execCalcRetroProcessManager(1, 'SYSTEM', Date.now());

      // TODO: החלפה לתוצאות אמיתיות מ-Access
      return [
        {
          period: '01/2024',
          chargeType: 'ארנונה',
          amount: 1500,
          discount: 150,
          total: 1350
        }
      ];
    } catch (error) {
      throw new Error(`שגיאה בחישוב רטרו: ${error.message}`);
    }
  }

  private async createTempArnMforat(params: {
    hs: string;
    mspkod: number;
    dtStart: string;
    dtEnd: string;
    sugts: number;
    jobnum: number;
  }) {
    // TODO: החלפה לקריאה אמיתית ל-Access
    console.log('Creating TEMPARNMFORAT record:', params);
  }

  private async execPrepareRetroData(hs: string, mspkod: number) {
    // TODO: החלפה לקריאה אמיתית ל-Access
    console.log('Executing PrepareRetroData:', { hs, mspkod });
  }

  private async execMultiplyTempArnmforatRows(hs: string, sugtsList: string) {
    // TODO: החלפה לקריאה אמיתית ל-Access
    console.log('Executing MultiplyTempArnmforatRows:', { hs, sugtsList });
  }

  private async execCalcRetroProcessManager(
    moazaCode: number,
    userName: string,
    jobNum: number
  ) {
    // TODO: החלפה לקריאה אמיתית ל-Access
    console.log('Executing CalcRetroProcessManager:', { moazaCode, userName, jobNum });
  }

  async addDbError(error: {
    user: string;
    errnum: string;
    errdesc: string;
    modulname: string;
    errline: number;
    jobnum: number;
  }) {
    // TODO: החלפה לקריאה אמיתית ל-Access
    console.error('DB Error:', error);
  }
}

export const accessService = new AccessService();