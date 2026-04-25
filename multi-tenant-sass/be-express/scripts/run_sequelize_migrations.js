const fs = require('fs');
const path = require('path');
const { makeSequelizeFromEnv } = require('../src/config/db.cjs');
const { Sequelize } = require('sequelize');

async function run() {
  const migrationsDir = path.join(__dirname, '..', 'db', 'sequelize-migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort();
  const { makeSequelizeFromEnv } = require('../src/config/db.cjs');
  const sequelize = makeSequelizeFromEnv();
  const qi = sequelize.getQueryInterface();

  try {
    await sequelize.authenticate();
    for (const file of files) {
      const mod = require(path.join(migrationsDir, file));
      if (typeof mod.up === 'function') {
        console.log('Running migration', file);
        await mod.up(qi, Sequelize);
      }
    }
    console.log('Migrations applied');
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
