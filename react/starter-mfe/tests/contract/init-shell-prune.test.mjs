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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-init-shell-'));
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

test('shell init prunes demo+HomePage, restores shell, keeps templates', () => {
  withTempCopy((tmp) => {
    const r = spawnSync('node', ['scripts/init.mjs', '--role=shell'], {
      cwd: tmp,
      encoding: 'utf8',
    });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(fs.existsSync(path.join(tmp, 'src/features/demo')), false);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/HomePage')), false);
    assert.equal(fs.existsSync(path.join(tmp, 'src/pages/ShellHomePage')), true);
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loadDemoRemote.tsx')),
      true,
    );
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loadRemote.tsx')),
      true,
    );
    assert.equal(
      fs.existsSync(path.join(tmp, 'src/app/remotes/loaders.generated.ts')),
      true,
    );
    assert.equal(fs.existsSync(path.join(tmp, 'templates/role-assets/demo')), true);
    assert.equal(fs.existsSync(path.join(tmp, 'templates/role-assets/shell')), true);
  });
});
