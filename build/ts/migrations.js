"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateScopeFieldToVarchar1024 = exports.migrationList = void 0;
var tslib_1 = require("tslib");
var shopify_app_session_storage_1 = require("@shopify/shopify-app-session-storage");
exports.migrationList = [
    new shopify_app_session_storage_1.MigrationOperation('migrateScopeFieldToVarchar1024', migrateScopeFieldToVarchar1024),
];
// need change the sizr of the scope column from 255 to 1024 char
function migrateScopeFieldToVarchar1024(connection) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.query("ALTER TABLE ".concat(connection.sessionStorageIdentifier, " \n      MODIFY COLUMN scope varchar(1024)"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.migrateScopeFieldToVarchar1024 = migrateScopeFieldToVarchar1024;
//# sourceMappingURL=migrations.js.map