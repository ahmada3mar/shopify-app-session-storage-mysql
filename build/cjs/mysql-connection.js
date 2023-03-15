'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mysql = require('mysql2/promise');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var mysql__default = /*#__PURE__*/_interopDefaultLegacy(mysql);

class MySqlConnection {
  constructor(dbUrl, sessionStorageIdentifier) {
    this.sessionStorageIdentifier = void 0;
    this.ready = void 0;
    this.connection = void 0;
    this.ready = this.init(dbUrl);
    this.sessionStorageIdentifier = sessionStorageIdentifier;
  }
  async query(query, params = []) {
    await this.ready;
    return this.connection.query(query, params);
  }
  async connect() {
    await this.ready;

    // Nothing else to do here
    return Promise.resolve();
  }
  async disconnect() {
    await this.ready;
    await this.connection.end();
  }
  getDatabase() {
    return this.connection.config.database;
  }
  async hasTable(tablename) {
    await this.ready;
    const query = `
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = ${this.getArgumentPlaceholder()} 
          AND TABLE_SCHEMA = ${this.getArgumentPlaceholder()};
    `;

    // Allow multiple apps to be on the same host with separate DB and querying the right
    // DB for the session table exisitence
    const [rows] = await this.connection.query(query, [tablename, this.getDatabase()]);
    return Array.isArray(rows) && rows.length === 1;
  }
  getArgumentPlaceholder(_) {
    return `?`;
  }
  async init(dbUrl) {
    this.connection = await mysql__default["default"].createConnection(dbUrl.toString());
  }
}

exports.MySqlConnection = MySqlConnection;
