import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-init-restore-'));
  fs.cpSync(ROOT, tmp, {
    recursive: true,
    filter: (src) => !SKIP.has(path.basename(src)),
  });
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

test('shell then --force remote restores demo and prunes shell-only', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=shell']).status, 0);
    assert.equal(fs.existsSync(path.join(tmp, 'src/features/demo')), false);
    const r = init(tmp, ['--role=remote', '--force']);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(fs.existsSync(path.join(tmp, 'src/features/demo')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/HomePage')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/ShellHomePage')), false);
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loadDemoRemote.tsx')),
      false,
    );
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loadRemote.tsx')),
      false,
    );
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loaders.generated.ts')),
      false,
    );
  });
});

test('--force shell restores shell templates', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=standalone']).status, 0);
    const r = init(tmp, ['--role=shell', '--force']);
    assert.equal(r.status, 0, r.stderr);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/ShellHomePage')), true);
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/routes/shellRoutes.tsx')),
      true,
    );
  });
});
