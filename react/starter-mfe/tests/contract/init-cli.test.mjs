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

function envPort(tmp, key) {
  const text = fs.readFileSync(path.join(tmp, '.env'), 'utf8');
  const m = text.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return m ? m[1].trim() : null;
}

test('missing --role exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, []);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /--role=standalone\|host\|remote required/);
  });
});

test('missing --port exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=standalone']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /--port=<number> required/);
  });
});

test('invalid --port exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=standalone', '--port=0']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid --port/);
  });
});

test('invalid --role exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=nope', '--port=3000']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /standalone, host, remote/);
  });
});

test('refuses without --force when metadata exists', () => {
  withTempCopy((tmp) => {
    const first = init(tmp, ['--role=standalone', '--port=3000']);
    assert.equal(first.status, 0);
    const second = init(tmp, ['--role=host', '--port=3001']);
    assert.notEqual(second.status, 0);
    assert.match(second.stderr, /--force/);
  });
});

test('success writes starter.role.json and .env port', () => {
  withTempCopy((tmp) => {
    assert.equal(envPort(tmp, 'PORT_STANDALONE'), '');
    const r = init(tmp, ['--role=standalone', '--port=3100']);
    assert.equal(r.status, 0);
    const meta = JSON.parse(
      fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
    );
    assert.equal(meta.role, 'standalone');
    assert.equal(meta.name, 'standalone');
    assert.equal(meta.federationName, 'standalone');
    assert.equal(envPort(tmp, 'PORT_STANDALONE'), '3100');
    assert.match(r.stdout, /PORT_STANDALONE=3100/);
  });
});

test('--name writes metadata, package.json, and federationName', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=remote', '--port=3002', '--name=my-checkout']);
    assert.equal(r.status, 0, r.stderr);
    const meta = JSON.parse(
      fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
    );
    assert.equal(meta.role, 'remote');
    assert.equal(meta.name, 'my-checkout');
    assert.equal(meta.federationName, 'myCheckout');
    assert.equal(meta.expose, './MyCheckout');
    assert.equal(envPort(tmp, 'PORT_REMOTE'), '3002');
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tmp, 'package.json'), 'utf8'),
    );
    assert.equal(pkg.name, 'my-checkout');
    assert.match(
      r.stdout,
      /npm run add-remote -- --alias=myCheckout --name=my-checkout --port=3002 --expose=\.\/MyCheckout --federation-name=myCheckout --url-env=MY_CHECKOUT_URL/,
    );
    assert.doesNotMatch(r.stdout, /Or copy into host starter\.role\.json/);
    assert.doesNotMatch(r.stdout, /Or re-init host with:/);
  });
});

test('host without --remote writes empty remotes[]', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=host', '--port=3001', '--name=host']);
    assert.equal(r.status, 0, r.stderr);
    const meta = JSON.parse(
      fs.readFileSync(path.join(tmp, 'starter.role.json'), 'utf8'),
    );
    assert.deepEqual(meta.remotes, []);
    const loaders = fs.readFileSync(
      path.join(tmp, 'src/app/remotes/loaders.generated.ts'),
      'utf8',
    );
    assert.match(loaders, /remoteLoaders: Record<string, RemoteLoader> = \{\s*\};/);
    assert.doesNotMatch(loaders, /demoRemote/);
    assert.doesNotMatch(r.stdout, /No remotes configured|Re-init with --remote/);
  });
});

test('host --remote-name writes remotes[] with demoRemote alias', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, [
      '--role=host',
      '--port=3001',
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
    assert.equal(meta.remotes[0].expose, './MyCheckout');
    assert.equal(meta.remotes[0].urlEnv, 'DEMO_REMOTE_URL');
    assert.equal(envPort(tmp, 'PORT_HOST'), '3001');
    assert.match(
      fs.readFileSync(
        path.join(tmp, 'src/app/remotes/loaders.generated.ts'),
        'utf8',
      ),
      /demoRemote\/MyCheckout/,
    );
  });
});

test('host accepts multiple --remote flags', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, [
      '--role=host',
      '--port=3001',
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
    assert.equal(meta.remotes[0].expose, './Checkout');
    assert.equal(meta.remotes[1].alias, 'billingRemote');
    assert.equal(meta.remotes[1].expose, './Billing');
    assert.equal(meta.remotes[1].urlEnv, 'BILLING_REMOTE_URL');
    const loaders = fs.readFileSync(
      path.join(tmp, 'src/app/remotes/loaders.generated.ts'),
      'utf8',
    );
    assert.match(loaders, /demoRemote\/Checkout/);
    assert.match(loaders, /billingRemote/);
    assert.match(loaders, /billingRemote\/Billing/);
  });
});

test('--remote-name rejected for non-host roles', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, [
      '--role=standalone',
      '--port=3000',
      '--remote-name=x',
    ]);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /only valid with --role=host/);
  });
});

test('invalid --name exits non-zero', () => {
  withTempCopy((tmp) => {
    const r = init(tmp, ['--role=standalone', '--port=3000', '--name=BAD NAME']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid --name/);
  });
});
