declare module 'odbc' {
  interface ConnectionConfig {
    connectionString: string;
    connectionTimeout?: number;
  }

  interface Connection {
    query<T = any>(sql: string): Promise<T[]>;
    close(): Promise<void>;
  }

  export function connect(config: ConnectionConfig): Promise<Connection>;
}