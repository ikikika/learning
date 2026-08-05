#!/usr/bin/env node
/**
 * Per-role Playwright: init → test for standalone, host, remote.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { getDevHost } = require('./load-env.cjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = getDevHost();

/** Explicit smoke ports — not read from .env (ports are empty until init). */
const ROLE_PORTS = {
  standalone: 3000,
  host: 3001,
  remote: 3002,
  hybrid: 3003,
};

function init(role) {
  const port = ROLE_PORTS[role];
  const args = ['scripts/init.mjs', `--role=${role}`, `--port=${port}`];
  // Host/hybrid e2e exercises LoadRemote fallbacks — add a slot explicitly (init defaults to none).
  if (role === 'host' || role === 'hybrid') {
    args.push('--remote=demoRemote:demoRemote');
  }
  if (fs.existsSync(path.join(ROOT, 'starter.role.json'))) {
    args.push('--force');
  }
  const r = spawnSync('node', args, { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function runPlaywright(project, port) {
  const r = spawnSync('npx', ['playwright', 'test', `--project=${project}`], {
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

const roles = [
  { role: 'standalone', project: 'standalone' },
  { role: 'host', project: 'host' },
  { role: 'remote', project: 'remote-standalone' },
  { role: 'hybrid', project: 'hybrid' },
];

for (const { role, project } of roles) {
  const port = ROLE_PORTS[role];
  init(role);
  runPlaywright(project, port);
}

console.log('Per-role e2e passed');
