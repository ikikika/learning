import { Sequelize } from 'sequelize';
import { getDbConfig } from '../config/db';

const { host, port, username, password, database } = getDbConfig();

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  logging: false,
});

export default sequelize;
