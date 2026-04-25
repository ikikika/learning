const { Sequelize } = require('sequelize');

const { makeSequelizeFromEnv } = require('../src/config/db.cjs');

async function seed() {
  const { makeSequelizeFromEnv } = require('../src/config/db.cjs');
  const sequelize = makeSequelizeFromEnv();
  const qi = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();
    await qi.bulkInsert('tenants', [
      { id: 'tenant_1', name: 'Demo Tenant', created_at: new Date() },
      { id: 'tenant_2', name: 'Demo Tenant 2', created_at: new Date() },
      { id: 'tenant_3', name: 'Demo Tenant 3', created_at: new Date() }
    ], { ignoreDuplicates: true });

    await qi.bulkInsert('users', [
      { id: 'user_admin', tenant_id: 'tenant_1', email: 'admin@tenant.local', name: 'Admin User', password_hash: 'password', is_active: 1, created_at: new Date() }
    ], { ignoreDuplicates: true });

    await qi.bulkInsert('roles', [
      { id: 'role_admin', tenant_id: 'tenant_1', name: 'admin', description: 'Tenant administrator', created_at: new Date() }
    ], { ignoreDuplicates: true });

    await qi.bulkInsert('user_roles', [
      { user_id: 'user_admin', role_id: 'role_admin', assigned_at: new Date() }
    ], { ignoreDuplicates: true });

    await qi.bulkInsert('projects', [
      { id: 'project_demo', tenant_id: 'tenant_1', name: 'Demo Project', description: 'A demo project for local development', owner_id: 'user_admin', created_at: new Date() }
    ], { ignoreDuplicates: true });

    await qi.bulkInsert('items', [
      { id: 'item_1', tenant_id: 'tenant_1', project_id: 'project_demo', title: 'Setup project', description: 'Initial setup task', status: 'open', priority: 1, assignee_id: 'user_admin', created_at: new Date() }
    ], { ignoreDuplicates: true });

    console.log('Seeding completed');
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
