// Typed wrapper around the runtime CommonJS DB implementation
import { Sequelize } from 'sequelize';

type DbConfig = { host: string; port: number; username: string; password: string; database: string };

const jsImpl: { getDbConfig: () => DbConfig; makeSequelizeFromEnv: () => Sequelize } = require('./db.cjs');

export function getDbConfig(): DbConfig {
  return jsImpl.getDbConfig();
}

export function makeSequelize(): Sequelize {
  return jsImpl.makeSequelizeFromEnv();
}

export default getDbConfig;
