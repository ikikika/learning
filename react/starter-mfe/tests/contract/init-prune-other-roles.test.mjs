import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

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
]);

function withTempCopy(fn) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-init-prune-'));
  fs.cpSync(ROOT, tmp, {
    recursive: true,
    filter: (src) => !SKIP.has(path.basename(src)),
  });
  // Seed Speckit pointer so prune can clear it (`.specify` is skipped above).
  const specifyDir = path.join(tmp, '.specify');
  fs.mkdirSync(specifyDir, { recursive: true });
  fs.writeFileSync(
    path.join(specifyDir, 'feature.json'),
    JSON.stringify({ feature_directory: 'specs/005-hybrid-role-scaffold' }) +
      '\n',
    'utf8',
  );
  try {
    return fn(tmp);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function init(cwd, args) {
  return spawnSync('node', ['scripts/init.mjs', ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function exists(tmp, rel) {
  return fs.existsSync(path.join(tmp, rel));
}

function readMeta(tmp) {
  return JSON.parse(
    fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
  );
}

test('init --prune-other-roles as host removes other role samples and keeps host', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, [
      '--role=host',
      '--port=3001',
      '--name=demo-host',
      '--prune-other-roles',
    ]);
    assert.equal(r.status, 0, r.stderr || r.stdout);

    assert.equal(exists(tmp, 'src/features/demoHost'), true);
    assert.equal(exists(tmp, 'src/app/routes/hostRoutes.tsx'), true);
    assert.equal(exists(tmp, 'src/pages/DemoHostHomePage'), true);
    assert.equal(exists(tmp, 'src/app/remotes/loadRemote.tsx'), true);

    assert.equal(exists(tmp, 'src/features/demo'), false);
    assert.equal(exists(tmp, 'src/pages/HomePage'), false);
    assert.equal(exists(tmp, 'src/features/demoRemote'), false);
    assert.equal(exists(tmp, 'src/app/routes/remoteRoutes.tsx'), false);
    assert.equal(exists(tmp, 'src/app/FederatedRemoteApp.tsx'), false);
    assert.equal(exists(tmp, 'src/app/routes/hybridRoutes.tsx'), false);
    assert.equal(exists(tmp, 'src/app/FederatedHybridApp.tsx'), false);
    assert.equal(exists(tmp, 'src/features/demoHybrid'), false);
    assert.equal(exists(tmp, 'tests/integration/compose.spec.ts'), false);
    assert.equal(exists(tmp, 'tests/contract/init-no-prune.test.mjs'), false);

    assert.equal(exists(tmp, 'specs'), true);
    assert.equal(exists(tmp, 'specs/001-react-role-scaffold'), false);
    assert.equal(exists(tmp, 'specs/004-host-add-remote'), false);
    assert.equal(exists(tmp, 'specs/005-hybrid-role-scaffold'), false);
    assert.deepEqual(
      JSON.parse(
        fs.readFileSync(path.join(tmp, '.specify', 'feature.json'), 'utf8'),
      ),
      {},
    );

    const meta = readMeta(tmp);
    assert.equal(meta.role, 'host');
    assert.equal(meta.samplesPruned, true);
  });
});

test('init --prune-other-roles as standalone removes host/remote/hybrid bundles', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, [
      '--role=standalone',
      '--port=3000',
      '--prune-other-roles',
    ]);
    assert.equal(r.status, 0, r.stderr || r.stdout);

    assert.equal(exists(tmp, 'src/features/demo'), true);
    assert.equal(exists(tmp, 'src/pages/HomePage'), true);
    assert.equal(exists(tmp, 'src/app/routes/standaloneRoutes.tsx'), true);

    assert.equal(exists(tmp, 'src/features/demoHost'), false);
    assert.equal(exists(tmp, 'src/app/routes/hostRoutes.tsx'), false);
    assert.equal(exists(tmp, 'src/features/demoRemote'), false);
    assert.equal(exists(tmp, 'src/app/FederatedRemoteApp.tsx'), false);
    assert.equal(exists(tmp, 'src/features/demoHybrid'), false);
    assert.equal(exists(tmp, 'src/app/FederatedHybridApp.tsx'), false);
    assert.equal(exists(tmp, 'tests/integration/host.spec.ts'), false);
    assert.equal(
      exists(tmp, 'tests/integration/compose-shell-hybrid.spec.ts'),
      false,
    );
    assert.equal(exists(tmp, 'specs/001-react-role-scaffold'), false);
    assert.equal(exists(tmp, 'specs/005-hybrid-role-scaffold'), false);

    assert.equal(readMeta(tmp).samplesPruned, true);
  });
});

test('prune-other-roles script is idempotent after init prune', () => {
  withTempCopy((tmp) => {
    const first = init(tmp, [
      '--role=remote',
      '--port=3002',
      '--prune-other-roles',
    ]);
    assert.equal(first.status, 0, first.stderr || first.stdout);
    assert.equal(exists(tmp, 'src/app/FederatedRemoteApp.tsx'), true);
    assert.equal(exists(tmp, 'src/features/demo'), false);

    const second = spawnSync(
      'node',
      ['scripts/prune-other-role-samples.mjs', '--role=remote'],
      { cwd: tmp, encoding: 'utf8' },
    );
    assert.equal(second.status, 0, second.stderr || second.stdout);
    assert.equal(exists(tmp, 'src/app/FederatedRemoteApp.tsx'), true);
    assert.equal(exists(tmp, 'src/features/demoRemote'), true);
    assert.equal(readMeta(tmp).samplesPruned, true);
  });
});
