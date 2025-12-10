#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { getPortForRole, getDevHost } = require('./load-env.cjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = getDevHost();

function init(role) {
  const args = ['scripts/init.mjs', `--role=${role}`];
  if (fs.existsSync(path.join(ROOT, 'starter.role.json'))) args.push('--force');
  const r = spawnSync('node', args, { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// AA audit against primary demo route for each role
for (const role of ['standalone', 'shell', 'remote']) {
  init(role);
  const port = getPortForRole(role);
  const r = spawnSync('npx', ['playwright', 'test', '--project=a11y'], {
    cwd: ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_PORT: String(port),
      PLAYWRIGHT_BASE_URL: `http://${host}:${port}`,
    },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log('a11y AA passed for all roles');
