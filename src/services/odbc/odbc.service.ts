import { SqlService } from './sql.service';
import { PropertyDetails, ChargeType } from '../../types';

export class OdbcService {
  private sqlService: SqlService;

  constructor() {
    this.sqlService = new SqlService();
  }

  async connect(): Promise<void> {
    await this.sqlService.connect();
  }

  async disconnect(): Promise<void> {
    await this.sqlService.disconnect();
  }

  async searchProperty(propertyId: string): Promise<PropertyDetails> {
    return this.sqlService.searchProperty(propertyId);
  }

  async getChargeTypes(): Promise<ChargeType[]> {
    return this.sqlService.getChargeTypes();
  }

  async prepareRetroData(params: any): Promise<void> {
    return this.sqlService.prepareRetroData(params);
  }

  async multiplyTempArnmforatRows(params: any): Promise<void> {
    return this.sqlService.multiplyTempArnmforatRows(params);
  }

  async getRetroResults(params: any): Promise<any[]> {
    return this.sqlService.getRetroResults(params);
  }
}