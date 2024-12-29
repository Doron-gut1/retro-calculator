interface OdbcConfig {
  dsn: string;
}

export const dbConfig: OdbcConfig = {
  dsn: process.env.ODBC_DSN || 'YOUR_DSN_NAME'
};
