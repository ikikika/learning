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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-init-cli-'));
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

test('missing --role exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, []);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /--role=standalone\|shell\|remote required/);
  });
});

test('invalid --role exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=nope']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /standalone, shell, remote/);
  });
});

test('refuses without --force when metadata exists', () => {
  withTempCopy((tmp) => {
    const first = init(tmp, ['--role=standalone']);
    assert.equal(first.status, 0);
    const second = init(tmp, ['--role=shell']);
    assert.notEqual(second.status, 0);
    assert.match(second.stderr, /--force/);
  });
});

test('success writes starter.role.json', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=standalone']);
    assert.equal(r.status, 0);
    const meta = JSON.parse(
      fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
    );
    assert.equal(meta.role, 'standalone');
    assert.equal(meta.name, 'standalone');
    assert.equal(meta.federationName, 'standalone');
  });
});

test('--name writes metadata, package.json, and federationName', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=remote', '--name=my-checkout']);
    assert.equal(r.status, 0, r.stderr);
    const meta = JSON.parse(
      fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
    );
    assert.equal(meta.role, 'remote');
    assert.equal(meta.name, 'my-checkout');
    assert.equal(meta.federationName, 'myCheckout');
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tmp, 'package.json'), 'utf8'),
    );
    assert.equal(pkg.name, 'my-checkout');
  });
});

test('shell --remote-name writes remotes[] with demoRemote alias', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, [
      '--role=shell',
      '--name=host-app',
      '--remote-name=my-checkout',
    ]);
    assert.equal(r.status, 0, r.stderr);
    const meta = JSON.parse(
      fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
    );
    assert.equal(meta.name, 'host-app');
    assert.equal(meta.federationName, 'hostApp');
    assert.equal(meta.remotes.length, 1);
    assert.equal(meta.remotes[0].alias, 'demoRemote');
    assert.equal(meta.remotes[0].name, 'my-checkout');
    assert.equal(meta.remotes[0].federationName, 'myCheckout');
    assert.equal(meta.remotes[0].expose, './Demo');
    assert.equal(meta.remotes[0].urlEnv, 'DEMO_REMOTE_URL');
    assert.match(
      fs.readFileSync(
        path.join(tmp, 'src/app/remotes/loaders.generated.ts'),
        'utf8',
      ),
      /demoRemote/,
    );
  });
});

test('shell accepts multiple --remote flags', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, [
      '--role=shell',
      '--name=host',
      '--remote=demoRemote:checkout',
      '--remote=billingRemote:billing:./Billing:BILLING_REMOTE_URL',
    ]);
    assert.equal(r.status, 0, r.stderr);
    const meta = JSON.parse(
      fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
    );
    assert.equal(meta.remotes.length, 2);
    assert.equal(meta.remotes[0].alias, 'demoRemote');
    assert.equal(meta.remotes[0].federationName, 'checkout');
    assert.equal(meta.remotes[1].alias, 'billingRemote');
    assert.equal(meta.remotes[1].expose, './Billing');
    assert.equal(meta.remotes[1].urlEnv, 'BILLING_REMOTE_URL');
    const loaders = fs.readFileSync(
      path.join(tmp, 'src/app/remotes/loaders.generated.ts'),
      'utf8',
    );
    assert.match(loaders, /demoRemote/);
    assert.match(loaders, /billingRemote/);
    assert.match(loaders, /billingRemote\/Billing/);
  });
});

test('--remote-name rejected for non-shell roles', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=standalone', '--remote-name=x']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /only valid with --role=shell/);
  });
});

test('invalid --name exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=standalone', '--name=BAD NAME']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid --name/);
  });
});
