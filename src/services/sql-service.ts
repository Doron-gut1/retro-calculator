import sql from 'mssql';

export interface SqlConfig {
    server: string;
    database: string;
    user: string;
    password: string;
    options: {
        encrypt: boolean;
        trustServerCertificate: boolean;
    };
}

export class SqlService {
    private pool: sql.ConnectionPool | null = null;
    private poolConnect: Promise<sql.ConnectionPool> | null = null;
    private readonly config: SqlConfig;

    constructor(config: SqlConfig) {
        this.config = config;
    }

    private async ensureConnection(): Promise<void> {
        if (!this.pool) {
            this.pool = new sql.ConnectionPool(this.config);
            this.poolConnect = this.pool.connect();
        }
        await this.poolConnect;
    }

    async searchProperty(propertyId: string): Promise<any> {
        await this.ensureConnection();
        const request = this.pool!.request();
        
        const result = await request.query(`
            SELECT h.*, m.maintz, m.fullname
            FROM hs h
            LEFT JOIN msp m ON h.mspkod = m.mspkod
            WHERE h.hskod = @propertyId
        `);
        
        return result.recordset[0];
    }

    async getChargeTypes(): Promise<any[]> {
        await this.ensureConnection();
        const request = this.pool!.request();
        
        const result = await request.query(`
            SELECT sugts, sugtsname
            FROM sugts 
            WHERE sugts = 1010 OR payby = 3
            ORDER BY sugts
        `);
        
        return result.recordset;
    }

    async prepareRetroData(params: { hs: string; mspkod: number }): Promise<void> {
        try {
            await this.ensureConnection();
            const request = this.pool!.request();
            
            request.input('hs', sql.NVarChar(30), params.hs);
            request.input('mspkod', sql.Int, params.mspkod);
            
            await request.execute('PrepareRetroData');
        } catch (error) {
            console.error('Error in prepareRetroData:', error);
            throw new Error(`נכשל בהכנת נתוני רטרו: ${error.message}`);
        }
    }

    async multiplyTempArnmforatRows(params: { 
        hs: string; 
        sugtsList: string;
        isYearlyCharge: boolean;
    }): Promise<void> {
        try {
            await this.ensureConnection();
            const request = this.pool!.request();
            
            request.input('HS', sql.NVarChar(50), params.hs);
            request.input('NewSugtsList', sql.NVarChar(sql.MAX), params.sugtsList);
            request.input('IsYearlyCharge', sql.Bit, params.isYearlyCharge);
            
            await request.execute('MultiplyTempArnmforatRows');
        } catch (error) {
            console.error('Error in multiplyTempArnmforatRows:', error);
            throw new Error(`נכשל בהכפלת שורות חיוב: ${error.message}`);
        }
    }

    async getRetroResults(params: { 
        hs: string;
        jobnum: number;
    }): Promise<any[]> {
        try {
            await this.ensureConnection();
            const request = this.pool!.request();
            
            const result = await request.query(`
                SELECT t.*, s.sugtsname
                FROM Temparnmforat t
                LEFT JOIN sugts s ON t.sugts = s.sugts
                WHERE t.hs = @hs 
                AND t.jobnum = @jobnum
                ORDER BY t.mnt, t.hdtme, t.IsNewCalculation DESC, t.hnckod
            `);
            
            return result.recordset;
        } catch (error) {
            console.error('Error in getRetroResults:', error);
            throw new Error(`נכשל בשליפת תוצאות החישוב: ${error.message}`);
        }
    }

    async addDbError(error: {
        user: string;
        errnum: string;
        errdesc: string;
        modulname: string;
        errline: number;
        jobnum: number;
    }): Promise<void> {
        try {
            await this.ensureConnection();
            const request = this.pool!.request();
            
            await request.execute('AddDbErrors', {
                user: error.user,
                errnum: error.errnum,
                errdesc: error.errdesc,
                modulname: error.modulname,
                errline: error.errline,
                jobnum: error.jobnum
            });
        } catch (dbError) {
            console.error('Error logging to database:', dbError);
        }
    }

    async close(): Promise<void> {
        if (this.pool) {
            await this.pool.close();
            this.pool = null;
            this.poolConnect = null;
        }
    }
}

// יצירת instance יחיד של השירות
export const createSqlService = (config: SqlConfig) => {
    return new SqlService(config);
};