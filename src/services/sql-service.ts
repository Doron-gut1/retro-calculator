import odbc from 'odbc';

interface DbError {
    user: string;
    errnum: string;
    errdesc: string;
    modulname: string;
    errline: number;
    jobnum: number;
}

interface OdbcError extends Error {
    message: string;
}

export class SqlService {
    private connection: any = null;
    private readonly odbcName: string;

    constructor(odbcName: string) {
        this.odbcName = odbcName;
    }

    private async ensureConnection(): Promise<void> {
        if (!this.connection) {
            try {
                this.connection = await odbc.connect(`DSN=${this.odbcName}`);
            } catch (error) {
                const err = error as OdbcError;
                throw new Error(`Failed to connect to ODBC source: ${err.message}`);
            }
        }
    }

    async searchProperty(propertyId: string): Promise<any> {
        await this.ensureConnection();
        
        const query = `
            SELECT h.*, m.maintz, m.fullname
            FROM hs h
            LEFT JOIN msp m ON h.mspkod = m.mspkod
            WHERE h.hskod = ?
        `;
        
        const result = await this.connection.query(query, [propertyId]);
        return result[0];
    }

    async getChargeTypes(): Promise<any[]> {
        await this.ensureConnection();
        
        const query = `
            SELECT sugts, sugtsname
            FROM sugts 
            WHERE sugts = 1010 OR payby = 3
            ORDER BY sugts
        `;
        
        return await this.connection.query(query);
    }

    async prepareRetroData(params: { hs: string; mspkod: number }): Promise<void> {
        try {
            await this.ensureConnection();
            
            await this.connection.query(
                'EXEC PrepareRetroData @hs=?, @mspkod=?',
                [params.hs, params.mspkod]
            );
        } catch (error) {
            const err = error as OdbcError;
            console.error('Error in prepareRetroData:', err);
            throw new Error(`נכשל בהכנת נתוני רטרו: ${err.message}`);
        }
    }

    async multiplyTempArnmforatRows(params: { 
        hs: string; 
        sugtsList: string;
        isYearlyCharge: boolean;
    }): Promise<void> {
        try {
            await this.ensureConnection();
            
            await this.connection.query(
                'EXEC MultiplyTempArnmforatRows @HS=?, @NewSugtsList=?, @IsYearlyCharge=?',
                [params.hs, params.sugtsList, params.isYearlyCharge ? 1 : 0]
            );
        } catch (error) {
            const err = error as OdbcError;
            console.error('Error in multiplyTempArnmforatRows:', err);
            throw new Error(`נכשל בהכפלת שורות חיוב: ${err.message}`);
        }
    }

    async getRetroResults(params: { 
        hs: string;
        jobnum: number;
    }): Promise<any[]> {
        try {
            await this.ensureConnection();
            
            const query = `
                SELECT t.*, s.sugtsname
                FROM Temparnmforat t
                LEFT JOIN sugts s ON t.sugts = s.sugts
                WHERE t.hs = ? 
                AND t.jobnum = ?
                ORDER BY t.mnt, t.hdtme, t.IsNewCalculation DESC, t.hnckod
            `;
            
            return await this.connection.query(query, [params.hs, params.jobnum]);
        } catch (error) {
            const err = error as OdbcError;
            console.error('Error in getRetroResults:', err);
            throw new Error(`נכשל בשליפת תוצאות החישוב: ${err.message}`);
        }
    }

    async addDbError(error: DbError): Promise<void> {
        try {
            await this.ensureConnection();
            
            await this.connection.query(
                'EXEC AddDbErrors @user=?, @errnum=?, @errdesc=?, @modulname=?, @errline=?, @jobnum=?',
                [error.user, error.errnum, error.errdesc, error.modulname, error.errline, error.jobnum]
            );
        } catch (dbError) {
            const err = dbError as OdbcError;
            console.error('Error logging to database:', err);
        }
    }

    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
        }
    }
}

// יצירת instance יחיד של השירות
export const createSqlService = (odbcName: string) => {
    return new SqlService(odbcName);
};