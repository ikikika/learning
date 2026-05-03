import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { getDbConfig } from '../src/config/db';

async function run() {
  const { host, port, username: user, password, database } = getDbConfig();

  if (!database) {
    console.error('DB_NAME or MYSQL_DATABASE must be set in environment');
    process.exit(1);
  }

  const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true });

  try {
    console.log('Creating database if not exists:', database);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.query(`USE \`${database}\`;`);

    const migrationsPath = path.join(__dirname, '..', 'db', 'migrations', '001_init.sql');
    const seedsPath = path.join(__dirname, '..', 'db', 'seeds', '001_seed.sql');

    console.log('Running migration:', migrationsPath);
    await conn.query(fs.readFileSync(migrationsPath, 'utf8'));

    console.log('Running seed:', seedsPath);
    await conn.query(fs.readFileSync(seedsPath, 'utf8'));

    console.log('Migration and seed completed successfully.');
  } catch (err) {
    console.error('Error running migration/seed:', err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

run();
