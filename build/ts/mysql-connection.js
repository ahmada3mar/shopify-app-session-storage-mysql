"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlConnection = void 0;
var tslib_1 = require("tslib");
var promise_1 = tslib_1.__importDefault(require("mysql2/promise"));
var MySqlConnection = /** @class */ (function () {
    function MySqlConnection(dbUrl, sessionStorageIdentifier) {
        this.ready = this.init(dbUrl);
        this.sessionStorageIdentifier = sessionStorageIdentifier;
    }
    MySqlConnection.prototype.query = function (query, params) {
        if (params === void 0) { params = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.connection.query(query, params)];
                }
            });
        });
    };
    MySqlConnection.prototype.connect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        // Nothing else to do here
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    MySqlConnection.prototype.disconnect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.connection.end()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySqlConnection.prototype.getDatabase = function () {
        return this.connection.config.database;
    };
    MySqlConnection.prototype.hasTable = function (tablename) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, _a, rows;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ready];
                    case 1:
                        _b.sent();
                        query = "\n      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES \n        WHERE TABLE_NAME = ".concat(this.getArgumentPlaceholder(), " \n          AND TABLE_SCHEMA = ").concat(this.getArgumentPlaceholder(), ";\n    ");
                        return [4 /*yield*/, this.connection.query(query, [
                                tablename,
                                this.getDatabase(),
                            ])];
                    case 2:
                        _a = tslib_1.__read.apply(void 0, [_b.sent(), 1]), rows = _a[0];
                        return [2 /*return*/, Array.isArray(rows) && rows.length === 1];
                }
            });
        });
    };
    MySqlConnection.prototype.getArgumentPlaceholder = function (_) {
        return "?";
    };
    MySqlConnection.prototype.init = function (dbUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, promise_1.default.createConnection(dbUrl.toString())];
                    case 1:
                        _a.connection = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MySqlConnection;
}());
exports.MySqlConnection = MySqlConnection;
//# sourceMappingURL=mysql-connection.js.map