import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('FederatedHybridApp exists and exports embedded?: boolean and CONTRACT_VERSION', () => {
  const appPath = path.join(ROOT, 'src/app/FederatedHybridApp.tsx');
  assert.equal(fs.existsSync(appPath), true);
  const source = fs.readFileSync(appPath, 'utf8');
  assert.match(source, /embedded\?:\s*boolean/);
  assert.match(source, /export\s*\{\s*CONTRACT_VERSION\s*\}/);
  assert.match(source, /export function FederatedHybridApp/);
});

test('demoHybrid public API includes CONTRACT_VERSION 1.0.0', () => {
  const index = fs.readFileSync(
    path.join(ROOT, 'src/features/demoHybrid/index.ts'),
    'utf8',
  );
  assert.match(index, /CONTRACT_VERSION\s*=\s*'1\.0\.0'/);
});

test('webpack hybrid branch exposes FederatedHybridApp via PascalCase name', () => {
  const webpack = fs.readFileSync(
    path.join(ROOT, 'config/webpack.common.js'),
    'utf8',
  );
  assert.match(webpack, /src\/app\/FederatedHybridApp\.tsx/);
  assert.match(webpack, /role === 'hybrid'/);
  assert.match(webpack, /toExposePath|resolveExpose/);
});
