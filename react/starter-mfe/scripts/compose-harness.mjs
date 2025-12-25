#!/usr/bin/env node
/**
 * Two temporary workspaces: host + remote, then run compose Playwright project.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { getDevHost } = require('./load-env.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const host = getDevHost();

/** Explicit compose ports — not read from .env (ports are empty until init). */
const ports = { host: 3001, remote: 3002 };
const demoRemoteUrl = `http://${host}:${ports.remote}/remoteEntry.js`;
const hostUrl = `http://${host}:${ports.host}`;
const remoteUrl = `http://${host}:${ports.remote}`;

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: false,
      ...opts,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`));
    });
  });
}

function copyWorkspace(dest) {
  const SKIP = new Set([
    'node_modules',
    'dist',
    '.git',
    '.cursor',
    '.specify',
    '.tmp-tests',
    'playwright-report',
    'test-results',
    'starter.role.json',
    'coverage',
    '.vscode',
  ]);
  fs.cpSync(ROOT, dest, {
    recursive: true,
    filter: (src) => !SKIP.has(path.basename(src)),
  });
  // Reuse root node_modules via symlink for speed
  fs.symlinkSync(
    path.join(ROOT, 'node_modules'),
    path.join(dest, 'node_modules'),
    'junction',
  );
}

async function waitForUrl(url, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function main() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-mfe-compose-'));
  const hostDir = path.join(tmp, 'host');
  const remoteDir = path.join(tmp, 'remote');
  copyWorkspace(hostDir);
  copyWorkspace(remoteDir);

  await run(
    'node',
    ['scripts/init.mjs', '--role=host', `--port=${ports.host}`],
    { cwd: hostDir },
  );
  await run(
    'node',
    [
      'scripts/add-remote.mjs',
      '--alias=demoRemote',
      '--name=demoRemote',
      `--port=${ports.remote}`,
      '--props={"title":"From Host A"}',
    ],
    { cwd: hostDir },
  );
  await run(
    'node',
    [
      'scripts/add-remote.mjs',
      '--alias=billingRemote',
      '--name=billing',
      '--federation-name=demoRemote',
      '--expose=./DemoRemote',
      `--port=${ports.remote}`,
      '--props={"title":"Billing Slot"}',
    ],
    { cwd: hostDir },
  );
  await run(
    'node',
    ['scripts/init.mjs', '--role=remote', `--port=${ports.remote}`],
    { cwd: remoteDir },
  );

  const remoteProc = spawn(
    'npx',
    ['webpack', 'serve', '--config', 'config/webpack.dev.js'],
    {
      cwd: remoteDir,
      stdio: 'inherit',
      env: { ...process.env, DEMO_REMOTE_URL: demoRemoteUrl },
    },
  );
  const hostProc = spawn(
    'npx',
    ['webpack', 'serve', '--config', 'config/webpack.dev.js'],
    {
      cwd: hostDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        DEMO_REMOTE_URL: demoRemoteUrl,
        BILLING_REMOTE_URL: demoRemoteUrl,
      },
    },
  );

  const cleanup = () => {
    hostProc.kill('SIGTERM');
    remoteProc.kill('SIGTERM');
    fs.rmSync(tmp, { recursive: true, force: true });
  };
  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(130);
  });

  try {
    await waitForUrl(remoteUrl);
    await waitForUrl(hostUrl);

    await run('npx', ['playwright', 'test', '--project=compose'], {
      cwd: ROOT,
      env: {
        ...process.env,
        PLAYWRIGHT_HOST_URL: hostUrl,
        PLAYWRIGHT_REMOTE_URL: remoteUrl,
        PLAYWRIGHT_SKIP_WEBSERVER: '1',
        PLAYWRIGHT_BASE_URL: hostUrl,
      },
    });
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
