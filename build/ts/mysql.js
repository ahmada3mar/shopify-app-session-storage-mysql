"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLSessionStorage = void 0;
var tslib_1 = require("tslib");
var shopify_api_1 = require("@shopify/shopify-api");
var migrations_1 = require("./migrations");
var mysql_connection_1 = require("./mysql-connection");
var mysql_migrator_1 = require("./mysql-migrator");
var defaultMySQLSessionStorageOptions = {
    sessionTableName: 'shopify_sessions',
    migratorOptions: {
        migrationDBIdentifier: 'shopify_sessions_migrations',
        migrationNameColumnName: 'migration_name',
    },
};
var MySQLSessionStorage = /** @class */ (function () {
    function MySQLSessionStorage(dbUrl, opts) {
        if (opts === void 0) { opts = {}; }
        this.options = tslib_1.__assign(tslib_1.__assign({}, defaultMySQLSessionStorageOptions), opts);
        this.dbUrl = dbUrl.toString();
        this.internalInit = this.init();
        this.migrator = new mysql_migrator_1.MySqlSessionStorageMigrator(this.connection, this.options.migratorOptions, migrations_1.migrationList);
        this.ready = this.migrator.applyMigrations(this.internalInit);
    }
    MySQLSessionStorage.withCredentials = function (host, dbName, username, password, opts) {
        return new MySQLSessionStorage(new URL("mysql://".concat(encodeURIComponent(username), ":").concat(encodeURIComponent(password), "@").concat(host, "/").concat(encodeURIComponent(dbName))), opts);
    };
    MySQLSessionStorage.prototype.storeSession = function (session) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var entries, query;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        this.init();
                        entries = session
                            .toPropertyArray()
                            .map(function (_a) {
                            var _b = tslib_1.__read(_a, 2), key = _b[0], value = _b[1];
                            return key === 'expires'
                                ? [key, Math.floor(value / 1000)]
                                : [key, value];
                        });
                        query = "\n      REPLACE INTO ".concat(this.options.sessionTableName, "\n      (").concat(entries.map(function (_a) {
                            var _b = tslib_1.__read(_a, 1), key = _b[0];
                            return key;
                        }).join(', '), ")\n      VALUES (").concat(entries
                            .map(function () { return "".concat(_this.connection.getArgumentPlaceholder()); })
                            .join(', '), ")\n    ");
                        return [4 /*yield*/, this.connection.query(query, entries.map(function (_a) {
                                var _b = tslib_1.__read(_a, 2), _key = _b[0], value = _b[1];
                                return value;
                            }))];
                    case 2:
                        _a.sent();
                        this.disconnect();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.loadSession = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, _a, rows, rawResult;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _b.sent();
                        this.init();
                        query = "\n      SELECT * FROM `".concat(this.options.sessionTableName, "`\n      WHERE id = ").concat(this.connection.getArgumentPlaceholder(), ";\n    ");
                        return [4 /*yield*/, this.connection.query(query, [id])];
                    case 2:
                        _a = tslib_1.__read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                        if (!Array.isArray(rows) || (rows === null || rows === void 0 ? void 0 : rows.length) !== 1)
                            return [2 /*return*/, undefined];
                        rawResult = rows[0];
                        this.disconnect();
                        return [2 /*return*/, this.databaseRowToSession(rawResult)];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.deleteSession = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        this.init();
                        query = "\n      DELETE FROM ".concat(this.options.sessionTableName, "\n      WHERE id = ").concat(this.connection.getArgumentPlaceholder(), ";\n    ");
                        return [4 /*yield*/, this.connection.query(query, [id])];
                    case 2:
                        _a.sent();
                        this.disconnect();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.deleteSessions = function (ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        this.init();
                        query = "\n      DELETE FROM ".concat(this.options.sessionTableName, "\n      WHERE id IN (").concat(ids
                            .map(function () { return "".concat(_this.connection.getArgumentPlaceholder()); })
                            .join(','), ");\n    ");
                        return [4 /*yield*/, this.connection.query(query, ids)];
                    case 2:
                        _a.sent();
                        this.disconnect();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.findSessionsByShop = function (shop) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, _a, rows, results;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _b.sent();
                        this.init();
                        query = "\n      SELECT * FROM ".concat(this.options.sessionTableName, "\n      WHERE shop = ").concat(this.connection.getArgumentPlaceholder(), ";\n    ");
                        return [4 /*yield*/, this.connection.query(query, [shop])];
                    case 2:
                        _a = tslib_1.__read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                        if (!Array.isArray(rows) || (rows === null || rows === void 0 ? void 0 : rows.length) === 0)
                            return [2 /*return*/, []];
                        results = rows.map(function (row) {
                            return _this.databaseRowToSession(row);
                        });
                        this.disconnect();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.disconnect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.disconnect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.connection = new mysql_connection_1.MySqlConnection(this.dbUrl, this.options.sessionTableName);
                        return [4 /*yield*/, this.createTable()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.createTable = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hasSessionTable, query;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.hasTable(this.options.sessionTableName)];
                    case 1:
                        hasSessionTable = _a.sent();
                        if (!!hasSessionTable) return [3 /*break*/, 3];
                        query = "\n        CREATE TABLE ".concat(this.options.sessionTableName, " (\n          id varchar(255) NOT NULL PRIMARY KEY,\n          shop varchar(255) NOT NULL,\n          state varchar(255) NOT NULL,\n          isOnline tinyint NOT NULL,\n          scope varchar(255),\n          expires integer,\n          onlineAccessInfo varchar(255),\n          accessToken varchar(255)\n        )\n      ");
                        return [4 /*yield*/, this.connection.query(query)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MySQLSessionStorage.prototype.databaseRowToSession = function (row) {
        // convert seconds to milliseconds prior to creating Session object
        if (row.expires)
            row.expires *= 1000;
        return shopify_api_1.Session.fromPropertyArray(Object.entries(row));
    };
    return MySQLSessionStorage;
}());
exports.MySQLSessionStorage = MySQLSessionStorage;
//# sourceMappingURL=mysql.js.map