'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var shopifyAppSessionStorage = require('@shopify/shopify-app-session-storage');

const migrationList = [new shopifyAppSessionStorage.MigrationOperation('migrateScopeFieldToVarchar1024', migrateScopeFieldToVarchar1024)];

// need change the sizr of the scope column from 255 to 1024 char
async function migrateScopeFieldToVarchar1024(connection) {
  await connection.query(`ALTER TABLE ${connection.sessionStorageIdentifier} 
      MODIFY COLUMN scope varchar(1024)`);
}

exports.migrateScopeFieldToVarchar1024 = migrateScopeFieldToVarchar1024;
exports.migrationList = migrationList;
