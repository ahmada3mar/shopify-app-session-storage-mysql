'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var shopifyApi = require('@shopify/shopify-api');
var migrations = require('./migrations.js');
var mysqlConnection = require('./mysql-connection.js');
var mysqlMigrator = require('./mysql-migrator.js');

const defaultMySQLSessionStorageOptions = {
  sessionTableName: 'shopify_sessions',
  migratorOptions: {
    migrationDBIdentifier: 'shopify_sessions_migrations',
    migrationNameColumnName: 'migration_name'
  }
};
class MySQLSessionStorage {
  static withCredentials(host, dbName, username, password, opts) {
    return new MySQLSessionStorage(new URL(`mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}/${encodeURIComponent(dbName)}`), opts);
  }
  constructor(dbUrl, opts = {}) {
    this.ready = void 0;
    this.internalInit = void 0;
    this.options = void 0;
    this.connection = void 0;
    this.migrator = void 0;
    this.dbUrl = void 0;
    this.options = {
      ...defaultMySQLSessionStorageOptions,
      ...opts
    };
    this.dbUrl = dbUrl.toString();
    this.internalInit = this.init();
    this.migrator = new mysqlMigrator.MySqlSessionStorageMigrator(this.connection, this.options.migratorOptions, migrations.migrationList);
    this.ready = this.migrator.applyMigrations(this.internalInit);
  }
  async storeSession(session) {
    await this.ready;
    this.init();
    // Note milliseconds to seconds conversion for `expires` property
    const entries = session.toPropertyArray().map(([key, value]) => key === 'expires' ? [key, Math.floor(value / 1000)] : [key, value]);
    const query = `
      REPLACE INTO ${this.options.sessionTableName}
      (${entries.map(([key]) => key).join(', ')})
      VALUES (${entries.map(() => `${this.connection.getArgumentPlaceholder()}`).join(', ')})
    `;
    await this.connection.query(query, entries.map(([_key, value]) => value));
    this.disconnect();
    return true;
  }
  async loadSession(id) {
    await this.ready;
    this.init();
    const query = `
      SELECT * FROM \`${this.options.sessionTableName}\`
      WHERE id = ${this.connection.getArgumentPlaceholder()};
    `;
    const [rows] = await this.connection.query(query, [id]);
    if (!Array.isArray(rows) || (rows === null || rows === void 0 ? void 0 : rows.length) !== 1) return undefined;
    const rawResult = rows[0];
    this.disconnect();
    return this.databaseRowToSession(rawResult);
  }
  async deleteSession(id) {
    await this.ready;
    this.init();
    const query = `
      DELETE FROM ${this.options.sessionTableName}
      WHERE id = ${this.connection.getArgumentPlaceholder()};
    `;
    await this.connection.query(query, [id]);
    this.disconnect();
    return true;
  }
  async deleteSessions(ids) {
    await this.ready;
    this.init();
    const query = `
      DELETE FROM ${this.options.sessionTableName}
      WHERE id IN (${ids.map(() => `${this.connection.getArgumentPlaceholder()}`).join(',')});
    `;
    await this.connection.query(query, ids);
    this.disconnect();
    return true;
  }
  async findSessionsByShop(shop) {
    await this.ready;
    this.init();
    const query = `
      SELECT * FROM ${this.options.sessionTableName}
      WHERE shop = ${this.connection.getArgumentPlaceholder()};
    `;
    const [rows] = await this.connection.query(query, [shop]);
    if (!Array.isArray(rows) || (rows === null || rows === void 0 ? void 0 : rows.length) === 0) return [];
    const results = rows.map(row => {
      return this.databaseRowToSession(row);
    });
    this.disconnect();
    return results;
  }
  async disconnect() {
    await this.connection.disconnect();
  }
  async init() {
    this.connection = new mysqlConnection.MySqlConnection(this.dbUrl, this.options.sessionTableName);
    await this.createTable();
  }
  async createTable() {
    const hasSessionTable = await this.connection.hasTable(this.options.sessionTableName);
    if (!hasSessionTable) {
      const query = `
        CREATE TABLE ${this.options.sessionTableName} (
          id varchar(255) NOT NULL PRIMARY KEY,
          shop varchar(255) NOT NULL,
          state varchar(255) NOT NULL,
          isOnline tinyint NOT NULL,
          scope varchar(255),
          expires integer,
          onlineAccessInfo varchar(255),
          accessToken varchar(255)
        )
      `;
      await this.connection.query(query);
    }
  }
  databaseRowToSession(row) {
    // convert seconds to milliseconds prior to creating Session object
    if (row.expires) row.expires *= 1000;
    return shopifyApi.Session.fromPropertyArray(Object.entries(row));
  }
}

exports.MySQLSessionStorage = MySQLSessionStorage;
