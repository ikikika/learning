require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function run() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || '';

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
    const migSql = fs.readFileSync(migrationsPath, 'utf8');
    await conn.query(migSql);

    console.log('Running seed:', seedsPath);
    const seedSql = fs.readFileSync(seedsPath, 'utf8');
    await conn.query(seedSql);

    console.log('Migration and seed completed successfully.');
  } catch (err) {
    console.error('Error running migration/seed:', err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

run();
