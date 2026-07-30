import bcrypt from 'bcryptjs';
import { makeSequelizeFromEnv } from '../src/config/db';

async function seed() {
  const sequelize = makeSequelizeFromEnv();
  const qi = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();

    const TENANT_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const TENANT_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    const TENANT_C = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

    await qi.bulkInsert('tenants', [
      { id: TENANT_A, name: 'Demo Tenant', created_at: new Date() },
      { id: TENANT_B, name: 'Demo Tenant 2', created_at: new Date() },
      { id: TENANT_C, name: 'Demo Tenant 3', created_at: new Date() },
    ], { ignoreDuplicates: true } as any);
    console.log('Seeding tenants completed');

    await qi.bulkInsert('users', [
      { id: '22222222-2222-2222-2222-222222222222', tenant_id: TENANT_A, username: 'admin', email: 'admin@tenant.local', name: 'Admin User', password_hash: await bcrypt.hash('password', 10), is_active: 1, created_at: new Date() },
      { id: '11111111-1111-1111-1111-111111111111', tenant_id: null, username: 'superadmin', email: 'superadmin@platform.local', name: 'Platform Superadmin', password_hash: await bcrypt.hash('password', 10), is_active: 1, created_at: new Date() },
    ], { ignoreDuplicates: true } as any);
    console.log('Seeding users completed');

    await qi.bulkInsert('roles', [
      { id: '44444444-4444-4444-4444-444444444444', tenant_id: TENANT_A, name: 'admin', description: 'Tenant administrator', created_at: new Date() },
      { id: '33333333-3333-3333-3333-333333333333', tenant_id: null, name: 'superadmin', description: 'Platform superadmin', created_at: new Date() },
    ], { ignoreDuplicates: true } as any);
    console.log('Seeding roles completed');

    await qi.bulkInsert('user_roles', [
      { user_id: '22222222-2222-2222-2222-222222222222', role_id: '44444444-4444-4444-4444-444444444444', assigned_at: new Date() },
      { user_id: '11111111-1111-1111-1111-111111111111', role_id: '33333333-3333-3333-3333-333333333333', assigned_at: new Date() },
    ], { ignoreDuplicates: true } as any);
    console.log('Seeding user_roles completed');

    await qi.bulkInsert('projects', [
      { id: '55555555-5555-5555-5555-555555555555', tenant_id: TENANT_A, name: 'Demo Project 1', description: 'A demo project for local development', owner_id: '22222222-2222-2222-2222-222222222222', created_at: new Date() },
    ], { ignoreDuplicates: true } as any);
    console.log('Seeding projects completed');

    await qi.bulkInsert('items', [
      { id: '66666666-6666-6666-6666-666666666666', tenant_id: TENANT_A, project_id: '55555555-5555-5555-5555-555555555555', title: 'Setup project', description: 'Initial setup task', status: 'open', priority: 1, assignee_id: '22222222-2222-2222-2222-222222222222', created_at: new Date() },
    ], { ignoreDuplicates: true } as any);
    console.log('Seeding items completed');

    console.log('Seeding completed');
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
