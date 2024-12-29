import { SqlConfig } from '../services/sql-service';

export const sqlConfig: SqlConfig = {
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DATABASE || 'RetroCalc',
    user: process.env.SQL_USER || 'sa',
    password: process.env.SQL_PASSWORD || '',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};
