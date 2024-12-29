interface AppConfig {
  apiUrl: string;
  odbcConnectionString: string;
  maxCalculationPeriodMonths: number;
}

export const config: AppConfig = {
  apiUrl: process.env.VITE_API_URL || 'http://localhost:3000',
  odbcConnectionString: process.env.VITE_ODBC_CONNECTION_STRING || '',
  maxCalculationPeriodMonths: 12
};
