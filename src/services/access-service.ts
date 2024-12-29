interface PropertyDetails {
  hskod: string;
  maintz: string;
  fullname: string;
}

interface RetroResult {
  date: string;
  chargeType: string;
  amount: number;
  discount: number;
  total: number;
}

interface CustomError extends Error {
  message: string;
}

export class AccessService {
  async searchProperty(propertyId: string): Promise<PropertyDetails> {
    try {
      // Mock implementation for now
      return {
        hskod: propertyId,
        maintz: '12345',
        fullname: 'ישראל ישראלי',
      };
    } catch (error) {
      const err = error as CustomError;
      throw new Error(`שגיאה בחיפוש נכס: ${err.message}`);
    }
  }

  async calculateRetro(params: {
    hs: string;
    mspkod: number;
    startDate: string;
    endDate: string;
    chargeTypes: string[];
  }): Promise<RetroResult[]> {
    try {
      // Mock implementation for now
      return [
        {
          date: '01/2024',
          chargeType: 'ארנונה',
          amount: 1500,
          discount: 150,
          total: 1350
        },
        {
          date: '02/2024',
          chargeType: 'ארנונה',
          amount: 1500,
          discount: 150,
          total: 1350
        }
      ];
    } catch (error) {
      const err = error as CustomError;
      throw new Error(`שגיאה בחישוב רטרו: ${err.message}`);
    }
  }
}

export const accessService = new AccessService();