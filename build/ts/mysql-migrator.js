"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlSessionStorageMigrator = void 0;
var tslib_1 = require("tslib");
var shopify_app_session_storage_1 = require("@shopify/shopify-app-session-storage");
var MySqlSessionStorageMigrator = /** @class */ (function (_super) {
    tslib_1.__extends(MySqlSessionStorageMigrator, _super);
    function MySqlSessionStorageMigrator(dbConnection, opts, migrations) {
        if (opts === void 0) { opts = {}; }
        return _super.call(this, dbConnection, opts, migrations) || this;
    }
    MySqlSessionStorageMigrator.prototype.initMigrationPersistence = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var discardCreateTable, migration;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.hasTable(this.options.migrationDBIdentifier)];
                    case 1:
                        discardCreateTable = _a.sent();
                        if (!!discardCreateTable) return [3 /*break*/, 3];
                        migration = "\n      CREATE TABLE ".concat(this.options.migrationDBIdentifier, " (\n        ").concat(this.getOptions().migrationNameColumnName, " varchar(255) NOT NULL PRIMARY KEY\n    );");
                        return [4 /*yield*/, this.connection.query(migration, [])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This is overriden from the abstract class has the result type is different for mysql
     * @param migrationName - the migration name we want to check in the table
     * @returns true if the 'migrationName' has been found in the migrations table, false otherwise
     */
    MySqlSessionStorageMigrator.prototype.hasMigrationBeenApplied = function (migrationName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, _a, rows;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _b.sent();
                        query = "\n      SELECT * FROM ".concat(this.options.migrationDBIdentifier, "\n      WHERE ").concat(this.getOptions().migrationNameColumnName, " = \n        ").concat(this.connection.getArgumentPlaceholder(1), ";\n    ");
                        return [4 /*yield*/, this.connection.query(query, [migrationName])];
                    case 2:
                        _a = tslib_1.__read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                        return [2 /*return*/, Array.isArray(rows) && rows.length === 1];
                }
            });
        });
    };
    return MySqlSessionStorageMigrator;
}(shopify_app_session_storage_1.RdbmsSessionStorageMigrator));
exports.MySqlSessionStorageMigrator = MySqlSessionStorageMigrator;
//# sourceMappingURL=mysql-migrator.js.map