import odbc from 'odbc';
import { OdbcConfig } from './types';

class OdbcService {
  private connection: any = null;

  async initialize() {
    try {
      this.connection = await odbc.connect('DSN=brngviadev');
      console.log('ODBC Connection established successfully');
      return true;
    } catch (error) {
      console.error('ODBC Connection error:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      if (!this.connection) {
        await this.initialize();
      }
      const result = await this.connection.query('SELECT @@version as version');
      console.log('SQL Server version:', result);
      return result;
    } catch (error) {
      console.error('Test connection failed:', error);
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

export const odbcService = new OdbcService();
