import { Session } from '@shopify/shopify-api';
import { SessionStorage, RdbmsSessionStorageOptions } from '@shopify/shopify-app-session-storage';
export interface MySQLSessionStorageOptions extends RdbmsSessionStorageOptions {
}
export declare class MySQLSessionStorage implements SessionStorage {
    static withCredentials(host: string, dbName: string, username: string, password: string, opts: Partial<MySQLSessionStorageOptions>): MySQLSessionStorage;
    readonly ready: Promise<void>;
    private internalInit;
    private options;
    private connection;
    private migrator;
    private dbUrl;
    constructor(dbUrl: URL, opts?: Partial<MySQLSessionStorageOptions>);
    storeSession(session: Session): Promise<boolean>;
    loadSession(id: string): Promise<Session | undefined>;
    deleteSession(id: string): Promise<boolean>;
    deleteSessions(ids: string[]): Promise<boolean>;
    findSessionsByShop(shop: string): Promise<Session[]>;
    disconnect(): Promise<void>;
    private init;
    private createTable;
    private databaseRowToSession;
}
//# sourceMappingURL=mysql.d.ts.map