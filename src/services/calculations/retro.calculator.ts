import { CalculationParams, CalculationResult } from '../../types/calculation.types';
import { OdbcService } from '../odbc/odbc.service';

export class RetroCalculator {
  private odbcService: OdbcService;

  constructor() {
    this.odbcService = new OdbcService();
  }

  async calculate(params: CalculationParams): Promise<CalculationResult[]> {
    try {
      // 1. Prepare data
      await this.odbcService.prepareRetroData({
        hs: params.propertyId,
        mspkod: params.mspkod
      });

      // 2. Multiply rows
      await this.odbcService.multiplyTempArnmforatRows({
        hs: params.propertyId,
        sugtsList: params.chargeTypes.join(','),
        isYearlyCharge: false
      });

      // 3. Get results
      return await this.odbcService.getRetroResults({
        hs: params.propertyId,
        jobnum: params.jobnum
      });
    } catch (error) {
      console.error('Error in retro calculation:', error);
      throw error;
    }
  }
}