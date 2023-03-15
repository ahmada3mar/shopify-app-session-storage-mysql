import { RdbmsConnection } from '@shopify/shopify-app-session-storage';
export declare class MySqlConnection implements RdbmsConnection {
    sessionStorageIdentifier: string;
    private ready;
    private connection;
    constructor(dbUrl: string, sessionStorageIdentifier: string);
    query(query: string, params?: any[]): Promise<any[]>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getDatabase(): string | undefined;
    hasTable(tablename: string): Promise<boolean>;
    getArgumentPlaceholder(_?: number): string;
    private init;
}
//# sourceMappingURL=mysql-connection.d.ts.map