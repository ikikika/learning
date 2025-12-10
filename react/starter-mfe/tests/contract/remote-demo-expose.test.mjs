import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('webpack remote role exposes ./Demo', () => {
  const webpack = fs.readFileSync(path.join(ROOT, 'webpack.config.js'), 'utf8');
  assert.match(webpack, /['"]\.\/Demo['"]/);
  assert.match(webpack, /features\/demo/);
});

test('Demo public API includes embedded?: boolean and CONTRACT_VERSION 1.0.0', () => {
  const index = fs.readFileSync(
    path.join(ROOT, 'src/features/demo/index.ts'),
    'utf8',
  );
  assert.match(index, /CONTRACT_VERSION\s*=\s*'1\.0\.0'/);
  const types = fs.readFileSync(
    path.join(ROOT, 'src/features/demo/types/index.ts'),
    'utf8',
  );
  assert.match(types, /embedded\?:\s*boolean/);
});
