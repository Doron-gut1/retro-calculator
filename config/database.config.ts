export const databaseConfig = {
  connectionString: process.env.VITE_ODBC_CONNECTION_STRING,
  connectionTimeout: 30000,
  queryTimeout: 60000
};
