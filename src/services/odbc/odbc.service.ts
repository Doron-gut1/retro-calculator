interface OdbcConfig {
  connectionString: string;
}

class OdbcService {
  private config: OdbcConfig = {
    connectionString: ''
  };

  async connect(connectionString: string) {
    this.config.connectionString = connectionString;
    // Implementation will be added
    console.log('Connecting to:', connectionString);
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // Implementation will be added
    console.log('Executing query:', sql, params);
    return [];
  }

  async disconnect() {
    // Implementation will be added
    console.log('Disconnecting');
  }
}

export const odbcService = new OdbcService();