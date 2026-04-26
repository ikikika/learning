#!/usr/bin/env node
const { argv } = require('process');
const bcrypt = require('bcryptjs');

const { makeSequelizeFromEnv } = require('../src/config/db.cjs');
const { randomUUID } = require('crypto');

function parseArgs() {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '');
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

async function upsertSuperadmin({ email, password, name, username }) {
  if (!email) {
    throw new Error('Missing --email argument');
  }
  if (!password) {
    throw new Error('Missing --password argument');
  }

  const sequelize = makeSequelizeFromEnv();
  const qi = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();

    const password_hash = await bcrypt.hash(password, 10);

    const uname = username || (email.split('@')[0]) || 'superadmin';

    // check if a platform user already exists for this email
    const [existingUsers] = await sequelize.query(
      'SELECT id FROM users WHERE email = ? AND (tenant_id IS NULL OR tenant_id = \'\') LIMIT 1',
      { replacements: [email] }
    );

    let userId;
    if (existingUsers && existingUsers.length > 0) {
      userId = existingUsers[0].id;
      await sequelize.query('UPDATE users SET password_hash = ?, name = ?, username = ?, is_active = 1 WHERE id = ?', { replacements: [password_hash, name || 'Platform Superadmin', uname, userId] });
    } else {
      userId = randomUUID();
      await qi.bulkInsert('users', [
        {
          id: userId,
          tenant_id: null,
          username: uname,
          email,
          name: name || 'Platform Superadmin',
          password_hash,
          is_active: 1,
          created_at: new Date(),
        },
      ], { ignoreDuplicates: true });
    }

    // Ensure a role exists for superadmin at platform scope (tenant_id = NULL)
    const ROLE_SUPERADMIN_ID = '33333333-3333-3333-3333-333333333333';
    await qi.bulkInsert('roles', [
      {
        id: ROLE_SUPERADMIN_ID,
        tenant_id: null,
        name: 'superadmin',
        description: 'Platform-level super administrator',
        created_at: new Date(),
      },
    ], { ignoreDuplicates: true });

    // Assign the role to the user
    await qi.bulkInsert('user_roles', [
      {
        user_id: userId,
        role_id: ROLE_SUPERADMIN_ID,
        assigned_at: new Date(),
      },
    ], { ignoreDuplicates: true });

    console.log('Superadmin bootstrapped:', email);
  } catch (err) {
    console.error('Failed to bootstrap superadmin', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function main() {
  const args = parseArgs();
  await upsertSuperadmin({ email: args.email, password: args.password, name: args.name });
}

main();
