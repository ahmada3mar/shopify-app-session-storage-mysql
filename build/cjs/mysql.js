'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mysql = require('mysql2/promise');
var shopifyApi = require('@shopify/shopify-api');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var mysql__default = /*#__PURE__*/_interopDefaultLegacy(mysql);

const defaultMySQLSessionStorageOptions = {
  sessionTableName: 'shopify_sessions'
};
class MySQLSessionStorage {
  static withCredentials(host, dbName, username, password, opts) {
    return new MySQLSessionStorage(new URL(`mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}/${encodeURIComponent(dbName)}`), opts);
  }
  constructor(dbUrl, opts = {}) {
    this.dbUrl = dbUrl;
    this.ready = void 0;
    this.options = void 0;
    this.connection = void 0;
    if (typeof this.dbUrl === 'string') {
      this.dbUrl = new URL(this.dbUrl);
    }
    this.options = {
      ...defaultMySQLSessionStorageOptions,
      ...opts
    };
    this.ready = this.init;
  }
  async storeSession(session) {
    await this.ready();

    // Note milliseconds to seconds conversion for `expires` property
    const entries = session.toPropertyArray().map(([key, value]) => key === 'expires' ? [key, Math.floor(value / 1000)] : [key, value]);
    const query = `
      REPLACE INTO ${this.options.sessionTableName}
      (${entries.map(([key]) => key).join(', ')})
      VALUES (${entries.map(() => `?`).join(', ')})
    `;
    await this.query(query, entries.map(([_key, value]) => value));
    this.disconnect();
    return true;
  }
  async loadSession(id) {
    await this.ready();
    const query = `
      SELECT * FROM \`${this.options.sessionTableName}\`
      WHERE id = ?;
    `;
    const [rows] = await this.query(query, [id]);
    if (!Array.isArray(rows) || (rows === null || rows === void 0 ? void 0 : rows.length) !== 1) return undefined;
    const rawResult = rows[0];
    this.disconnect();
    return this.databaseRowToSession(rawResult);
  }
  async deleteSession(id) {
    await this.ready();
    const query = `
      DELETE FROM ${this.options.sessionTableName}
      WHERE id = ?;
    `;
    await this.query(query, [id]);
    this.disconnect();
    return true;
  }
  async deleteSessions(ids) {
    await this.ready();
    const query = `
      DELETE FROM ${this.options.sessionTableName}
      WHERE id IN (${ids.map(() => '?').join(',')});
    `;
    await this.query(query, ids);
    this.disconnect();
    return true;
  }
  async findSessionsByShop(shop) {
    await this.ready();
    const query = `
      SELECT * FROM ${this.options.sessionTableName}
      WHERE shop = ?;
    `;
    const [rows] = await this.query(query, [shop]);
    if (!Array.isArray(rows) || (rows === null || rows === void 0 ? void 0 : rows.length) === 0) return [];
    const results = rows.map(row => {
      return this.databaseRowToSession(row);
    });
    this.disconnect();;
    return results;
  }
  async disconnect() {
    await this.connection.end();
  }
  async init() {
    this.connection = await mysql__default["default"].createConnection(this.dbUrl.toString());
    await this.createTable();
  }
  async hasSessionTable() {
    const query = `
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?;
    `;

    // Allow multiple apps to be on the same host with separate DB and querying the right
    // DB for the session table exisitence
    const [rows] = await this.query(query, [this.options.sessionTableName, this.connection.config.database]);
    return Array.isArray(rows) && rows.length === 1;
  }
  async createTable() {
    const hasSessionTable = await this.hasSessionTable();
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
      await this.query(query);
      this.disconnect();
    }
  }
  query(sql, params = []) {
    return this.connection.query(sql, params);
  }
  databaseRowToSession(row) {
    // convert seconds to milliseconds prior to creating Session object
    if (row.expires) row.expires *= 1000;
    return shopifyApi.Session.fromPropertyArray(Object.entries(row));
  }
}

exports.MySQLSessionStorage = MySQLSessionStorage;
