import odbc from 'odbc';
import { Property, Payer } from '../types';

export class OdbcService {
  private connection: odbc.Connection | null = null;

  async connect(connectionString: string) {
    try {
      this.connection = await odbc.connect(connectionString);
    } catch (error) {
      console.error('ODBC Connection failed:', error);
      throw error;
    }
  }

  async searchProperty(hskod: string): Promise<Property | null> {
    if (!this.connection) throw new Error('No database connection');
    
    try {
      const query = `
        SELECT *
        FROM hs
        WHERE hskod = ?
      `;
      
      const result = await this.connection.query(query, [hskod]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Property search failed:', error);
      throw error;
    }
  }

  async getPayer(mspkod: number): Promise<Payer | null> {
    if (!this.connection) throw new Error('No database connection');
    
    try {
      const query = `
        SELECT maintz, fullname
        FROM msp
        WHERE mspkod = ?
      `;
      
      const result = await this.connection.query(query, [mspkod]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Payer fetch failed:', error);
      throw error;
    }
  }

  async getAvailableChargeTypes(): Promise<Array<{ sugts: number; name: string }>> {
    if (!this.connection) throw new Error('No database connection');
    
    try {
      const query = `
        SELECT sugts, sugtsname as name
        FROM sugts
        WHERE active = 1
        ORDER BY sugts
      `;
      
      return await this.connection.query(query);
    } catch (error) {
      console.error('Charge types fetch failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}
