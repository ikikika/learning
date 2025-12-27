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
  '.vscode',
]);

function withTempCopy(fn) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-add-remote-cli-'));
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

function addRemote(cwd, args) {
  return spawnSync('node', ['scripts/add-remote.mjs', ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function readMeta(cwd) {
  return JSON.parse(
    fs.readFileSync(path.join(cwd, 'starter.role.json'), 'utf8'),
  );
}

function snapshotFiles(cwd) {
  const metaPath = path.join(cwd, 'starter.role.json');
  const envPath = path.join(cwd, '.env');
  const loadersPath = path.join(cwd, 'src/app/remotes/loaders.generated.ts');
  return {
    meta: fs.existsSync(metaPath) ? fs.readFileSync(metaPath, 'utf8') : null,
    env: fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : null,
    loaders: fs.existsSync(loadersPath)
      ? fs.readFileSync(loadersPath, 'utf8')
      : null,
  };
}

test('non-host, non-hybrid role rejects with no file writes', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=remote', '--port=3002']).status, 0);
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, ['--alias=demoRemote', '--port=3002']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /requires role host or hybrid/i);
    const after = snapshotFiles(tmp);
    assert.equal(after.meta, before.meta);
    assert.equal(after.env, before.env);
    assert.equal(after.loaders, before.loaders);
  });
});

test('standalone role rejects with no file writes', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=standalone', '--port=3000']).status, 0);
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, ['--alias=demoRemote', '--port=3002']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /requires role host or hybrid/i);
    const after = snapshotFiles(tmp);
    assert.equal(after.meta, before.meta);
  });
});

test('hybrid role is allowed and writes remotes[], .env, and loaders', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=hybrid', '--port=3003']).status, 0);
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, [
      '--alias=demoRemote',
      '--name=demoRemote',
      '--port=3002',
    ]);
    assert.equal(r.status, 0, r.stderr);
    const after = snapshotFiles(tmp);
    assert.notEqual(after.meta, before.meta);

    const meta = readMeta(tmp);
    assert.equal(meta.role, 'hybrid');
    assert.equal(meta.remotes.length, 1);
    assert.equal(meta.remotes[0].alias, 'demoRemote');
    assert.equal(meta.remotes[0].expose, './DemoRemote');
  });
});

test('duplicate alias rejects with no file writes', () => {
  withTempCopy((tmp) => {
    assert.equal(
      init(tmp, [
        '--role=host',
        '--port=3001',
        '--remote=demoRemote:demoRemote',
      ]).status,
      0,
    );
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, ['--alias=demoRemote', '--port=3002']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Duplicate remote alias/i);
    const after = snapshotFiles(tmp);
    assert.equal(after.meta, before.meta);
    assert.equal(after.env, before.env);
    assert.equal(after.loaders, before.loaders);
  });
});

test('missing url and port rejects', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=host', '--port=3001']).status, 0);
    const r = addRemote(tmp, ['--alias=demoRemote']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /exactly one of --url|--port/i);
  });
});

test('both url and port rejects', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=host', '--port=3001']).status, 0);
    const r = addRemote(tmp, [
      '--alias=demoRemote',
      '--url=http://127.0.0.1:3002/remoteEntry.js',
      '--port=3002',
    ]);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /exactly one of --url|--port/i);
  });
});

test('invalid url rejects with no writes', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=host', '--port=3001']).status, 0);
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, ['--alias=demoRemote', '--url=not-a-url']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid --url/i);
    assert.equal(snapshotFiles(tmp).meta, before.meta);
  });
});

test('invalid port rejects with no writes', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=host', '--port=3001']).status, 0);
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, ['--alias=demoRemote', '--port=0']);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid port/i);
    assert.equal(snapshotFiles(tmp).meta, before.meta);
  });
});

test('--props object is written to remoteProps[alias]', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=host', '--port=3001']).status, 0);
    const r = addRemote(tmp, [
      '--alias=demoRemote',
      '--name=demoRemote',
      '--port=3002',
      '--props={"title":"From Host A"}',
    ]);
    assert.equal(r.status, 0, r.stderr);
    const meta = readMeta(tmp);
    assert.deepEqual(meta.remoteProps.demoRemote, { title: 'From Host A' });
  });
});

test('invalid --props JSON fails with no writes', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=host', '--port=3001']).status, 0);
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, [
      '--alias=demoRemote',
      '--port=3002',
      '--props={not-json',
    ]);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /Invalid --props JSON/i);
    assert.equal(snapshotFiles(tmp).meta, before.meta);
    assert.equal(snapshotFiles(tmp).env, before.env);
    assert.equal(snapshotFiles(tmp).loaders, before.loaders);
  });
});

test('non-object --props fails with no writes', () => {
  withTempCopy((tmp) => {
    assert.equal(init(tmp, ['--role=host', '--port=3001']).status, 0);
    const before = snapshotFiles(tmp);
    const r = addRemote(tmp, [
      '--alias=demoRemote',
      '--port=3002',
      '--props=["x"]',
    ]);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /JSON object/i);
    assert.equal(snapshotFiles(tmp).meta, before.meta);
  });
});
