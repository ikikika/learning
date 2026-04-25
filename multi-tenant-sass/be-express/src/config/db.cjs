require('dotenv').config();

function getDbConfig() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
  const username = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || '';
  return { host, port, username, password, database };
}

const { Sequelize } = require('sequelize');

function makeSequelizeFromEnv() {
  const cfg = getDbConfig();
  return new Sequelize(cfg.database, cfg.username, cfg.password, { host: cfg.host, port: cfg.port, dialect: 'mysql', logging: false });
}

module.exports = { getDbConfig, makeSequelizeFromEnv };
