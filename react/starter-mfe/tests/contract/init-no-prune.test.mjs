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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-init-noprune-'));
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

test('init does not prune demo or shell sample assets', () => {
  withTempCopy((tmp) => {
    assert.equal(fs.existsSync(path.join(tmp, 'src/features/demo')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/HomePage')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/ShellHomePage')), true);
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loadRemote.tsx')),
      true,
    );

    const shell = init(tmp, ['--role=shell']);
    assert.equal(shell.status, 0, shell.stderr);
    assert.equal(fs.existsSync(path.join(tmp, 'src/features/demo')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/HomePage')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/ShellHomePage')), true);
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loaders.generated.ts')),
      true,
    );

    const remote = init(tmp, ['--role=remote', '--force']);
    assert.equal(remote.status, 0, remote.stderr);
    assert.equal(fs.existsSync(path.join(tmp, 'src/features/demo')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/ShellHomePage')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'templates')), false);
  });
});
