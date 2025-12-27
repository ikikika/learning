#!/usr/bin/env node
/**
 * Multi-workspace compose harness. Spins up temporary role workspaces and
 * runs the matching Playwright project against them.
 *
 * Modes (via `--mode=`):
 *   - host-remote   (default target of `main()` alongside the others) — host
 *     + remote workspaces, runs the `compose` project.
 *   - shell-hybrid  — host + hybrid workspaces (host embeds the hybrid's
 *     federated expose), runs the `compose-shell-hybrid` project.
 *   - hybrid-leaf   — hybrid + remote workspaces (hybrid embeds the remote's
 *     federated expose as a leaf), runs the `compose-hybrid-leaf` project.
 *   - all           — runs all three modes sequentially (same as omitting
 *     `--mode=` entirely).
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
const PORTS = { host: 3001, remote: 3002, hybrid: 3003 };

function urlFor(port) {
  return `http://${host}:${port}`;
}

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

function serve(cwd, env = {}) {
  return spawn(
    'npx',
    ['webpack', 'serve', '--config', 'config/webpack.dev.js'],
    {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, ...env },
    },
  );
}

function withCleanup(procs, dirs) {
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    for (const p of procs) p.kill('SIGTERM');
    for (const d of dirs) fs.rmSync(d, { recursive: true, force: true });
  };
  process.on('exit', cleanup);
  const onSigint = () => {
    cleanup();
    process.exit(130);
  };
  process.on('SIGINT', onSigint);
  return cleanup;
}

/**
 * Original mode: temp host + remote workspaces, runs `compose` project.
 * Host wires two aliases (demoRemote + billingRemote, sharing one remote
 * container) to exercise per-remote props/titles.
 */
async function runHostRemote() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-mfe-compose-'));
  const hostDir = path.join(tmp, 'host');
  const remoteDir = path.join(tmp, 'remote');
  copyWorkspace(hostDir);
  copyWorkspace(remoteDir);

  const demoRemoteUrl = `${urlFor(PORTS.remote)}/remoteEntry.js`;
  const hostUrl = urlFor(PORTS.host);
  const remoteUrl = urlFor(PORTS.remote);

  await run(
    'node',
    ['scripts/init.mjs', '--role=host', `--port=${PORTS.host}`],
    { cwd: hostDir },
  );
  await run(
    'node',
    [
      'scripts/add-remote.mjs',
      '--alias=demoRemote',
      '--name=demoRemote',
      `--port=${PORTS.remote}`,
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
      `--port=${PORTS.remote}`,
      '--props={"title":"Billing Slot"}',
    ],
    { cwd: hostDir },
  );
  await run(
    'node',
    ['scripts/init.mjs', '--role=remote', `--port=${PORTS.remote}`],
    { cwd: remoteDir },
  );

  const remoteProc = serve(remoteDir, { DEMO_REMOTE_URL: demoRemoteUrl });
  const hostProc = serve(hostDir, {
    DEMO_REMOTE_URL: demoRemoteUrl,
    BILLING_REMOTE_URL: demoRemoteUrl,
  });
  const cleanup = withCleanup([hostProc, remoteProc], [tmp]);

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

/**
 * Shell-hybrid mode: temp host + hybrid workspaces. The hybrid clone is
 * initialized as a leaf-exposing role (`demo-hybrid`) and the host embeds
 * it like any other federated remote via `add-remote`. Runs the
 * `compose-shell-hybrid` project.
 */
async function runShellHybrid() {
  const tmp = fs.mkdtempSync(
    path.join(os.tmpdir(), 'starter-mfe-compose-shell-hybrid-'),
  );
  const hostDir = path.join(tmp, 'host');
  const hybridDir = path.join(tmp, 'hybrid');
  copyWorkspace(hostDir);
  copyWorkspace(hybridDir);

  const hybridEntryUrl = `${urlFor(PORTS.hybrid)}/remoteEntry.js`;
  const hostUrl = urlFor(PORTS.host);
  const hybridUrl = urlFor(PORTS.hybrid);

  await run(
    'node',
    [
      'scripts/init.mjs',
      '--role=hybrid',
      `--port=${PORTS.hybrid}`,
      '--name=demo-hybrid',
    ],
    { cwd: hybridDir },
  );
  await run(
    'node',
    ['scripts/init.mjs', '--role=host', `--port=${PORTS.host}`],
    { cwd: hostDir },
  );
  await run(
    'node',
    [
      'scripts/add-remote.mjs',
      '--alias=demoHybrid',
      '--name=demo-hybrid',
      `--port=${PORTS.hybrid}`,
      '--props={"title":"Shell Embeds Hybrid"}',
    ],
    { cwd: hostDir },
  );

  const hybridProc = serve(hybridDir);
  const hostProc = serve(hostDir, { DEMO_HYBRID_URL: hybridEntryUrl });
  const cleanup = withCleanup([hostProc, hybridProc], [tmp]);

  try {
    await waitForUrl(hybridUrl);
    await waitForUrl(hostUrl);

    await run(
      'npx',
      ['playwright', 'test', '--project=compose-shell-hybrid'],
      {
        cwd: ROOT,
        env: {
          ...process.env,
          PLAYWRIGHT_HOST_URL: hostUrl,
          PLAYWRIGHT_HYBRID_URL: hybridUrl,
          PLAYWRIGHT_SKIP_WEBSERVER: '1',
          PLAYWRIGHT_BASE_URL: hostUrl,
        },
      },
    );
  } finally {
    cleanup();
  }
}

/**
 * Hybrid-leaf mode: temp hybrid + remote workspaces. The hybrid clone embeds
 * the remote as a leaf module (same `add-remote` contract as host). Runs the
 * `compose-hybrid-leaf` project.
 */
async function runHybridLeaf() {
  const tmp = fs.mkdtempSync(
    path.join(os.tmpdir(), 'starter-mfe-compose-hybrid-leaf-'),
  );
  const hybridDir = path.join(tmp, 'hybrid');
  const remoteDir = path.join(tmp, 'remote');
  copyWorkspace(hybridDir);
  copyWorkspace(remoteDir);

  const demoRemoteUrl = `${urlFor(PORTS.remote)}/remoteEntry.js`;
  const hybridUrl = urlFor(PORTS.hybrid);
  const remoteUrl = urlFor(PORTS.remote);

  await run(
    'node',
    ['scripts/init.mjs', '--role=hybrid', `--port=${PORTS.hybrid}`],
    { cwd: hybridDir },
  );
  await run(
    'node',
    [
      'scripts/add-remote.mjs',
      '--alias=demoRemote',
      '--name=demoRemote',
      `--port=${PORTS.remote}`,
      '--props={"title":"From Hybrid"}',
    ],
    { cwd: hybridDir },
  );
  await run(
    'node',
    ['scripts/init.mjs', '--role=remote', `--port=${PORTS.remote}`],
    { cwd: remoteDir },
  );

  const remoteProc = serve(remoteDir, { DEMO_REMOTE_URL: demoRemoteUrl });
  const hybridProc = serve(hybridDir, { DEMO_REMOTE_URL: demoRemoteUrl });
  const cleanup = withCleanup([hybridProc, remoteProc], [tmp]);

  try {
    await waitForUrl(remoteUrl);
    await waitForUrl(hybridUrl);

    await run(
      'npx',
      ['playwright', 'test', '--project=compose-hybrid-leaf'],
      {
        cwd: ROOT,
        env: {
          ...process.env,
          PLAYWRIGHT_HYBRID_URL: hybridUrl,
          PLAYWRIGHT_REMOTE_URL: remoteUrl,
          PLAYWRIGHT_SKIP_WEBSERVER: '1',
          PLAYWRIGHT_BASE_URL: hybridUrl,
        },
      },
    );
  } finally {
    cleanup();
  }
}

const MODES = {
  'host-remote': runHostRemote,
  'shell-hybrid': runShellHybrid,
  'hybrid-leaf': runHybridLeaf,
};

function parseMode(argv) {
  for (const arg of argv) {
    if (arg.startsWith('--mode=')) return arg.slice('--mode='.length);
  }
  return null;
}

async function main() {
  const mode = parseMode(process.argv.slice(2));

  if (mode && mode !== 'all') {
    const fn = MODES[mode];
    if (!fn) {
      console.error(
        `Unknown --mode=${mode}. Allowed: ${Object.keys(MODES).join(', ')}, all`,
      );
      process.exit(1);
    }
    await fn();
    console.log(`Compose harness passed (mode=${mode})`);
    return;
  }

  for (const [name, fn] of Object.entries(MODES)) {
    console.log(`\n=== compose-harness: ${name} ===`);
    await fn();
  }
  console.log('Compose harness passed (all modes)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
