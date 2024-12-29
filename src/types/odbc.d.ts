declare module 'odbc' {
    export interface Connection {
        query(sql: string, params?: any[]): Promise<any[]>;
        close(): Promise<void>;
    }

    export interface ConnectionConfig {
        connectionString: string;
    }

    export function connect(connectionString: string): Promise<Connection>;
    export function pool(config: ConnectionConfig): Promise<Connection>;
}
