import { RdbmsSessionStorageMigrator, RdbmsSessionStorageMigratorOptions, MigrationOperation } from '@shopify/shopify-app-session-storage';
import { MySqlConnection } from './mysql-connection';
export declare class MySqlSessionStorageMigrator extends RdbmsSessionStorageMigrator {
    constructor(dbConnection: MySqlConnection, opts: Partial<RdbmsSessionStorageMigratorOptions> | undefined, migrations: MigrationOperation[]);
    initMigrationPersistence(): Promise<void>;
    /**
     * This is overriden from the abstract class has the result type is different for mysql
     * @param migrationName - the migration name we want to check in the table
     * @returns true if the 'migrationName' has been found in the migrations table, false otherwise
     */
    hasMigrationBeenApplied(migrationName: string): Promise<boolean>;
}
//# sourceMappingURL=mysql-migrator.d.ts.map