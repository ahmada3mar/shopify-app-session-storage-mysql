import { MigrationOperation } from '@shopify/shopify-app-session-storage';
import { MySqlConnection } from './mysql-connection';
export declare const migrationList: MigrationOperation[];
export declare function migrateScopeFieldToVarchar1024(connection: MySqlConnection): Promise<void>;
//# sourceMappingURL=migrations.d.ts.map