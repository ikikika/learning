#!/usr/bin/env node
/**
 * Opt-in: remove sample assets + related tests for roles other than the
 * selected one, and remove starter Speckit feature folders under specs/.
 * Idempotent. Does not restore files (re-clone starter if needed).
 *
 * Usage:
 *   node scripts/prune-other-role-samples.mjs [--role=standalone|host|remote|hybrid]
 *   (role defaults to starter.role.json)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(__dirname, '..');

const ALLOWED_ROLES = ['standalone', 'host', 'remote', 'hybrid'];

/**
 * Per-role sample bundles. On prune for role R, every path in other roles'
 * bundles is deleted, plus ALWAYS_ON_PRUNE extras and specs/* feature dirs.
 */
export const ROLE_SAMPLE_BUNDLES = {
  standalone: [
    'src/app/routes/standaloneRoutes.tsx',
    'src/features/demo',
    'src/pages/HomePage',
    'tests/integration/standalone.spec.ts',
  ],
  host: [
    'src/app/routes/hostRoutes.tsx',
    'src/features/demoHost',
    'src/pages/DemoHostHomePage',
    'src/app/remotes/loadDemoRemote.tsx',
    'tests/integration/host.spec.ts',
  ],
  remote: [
    'src/app/routes/remoteRoutes.tsx',
    'src/app/FederatedRemoteApp.tsx',
    'src/features/demoRemote',
    'src/pages/DemoRemoteRoute1Page',
    'src/pages/DemoRemoteRoute2Page',
    'tests/integration/remote-standalone.spec.ts',
    'tests/contract/remote-demo-expose.test.mjs',
  ],
  hybrid: [
    'src/app/routes/hybridRoutes.tsx',
    'src/app/FederatedHybridApp.tsx',
    'src/features/demoHybrid',
    'src/pages/DemoHybridHomePage',
    'tests/integration/hybrid.spec.ts',
    'tests/contract/hybrid-expose.test.mjs',
  ],
};

/** Specs that assume a full multi-role sample tree. */
export const ALWAYS_ON_PRUNE = [
  'tests/integration/compose.spec.ts',
  'tests/integration/compose-shell-hybrid.spec.ts',
  'tests/integration/compose-hybrid-leaf.spec.ts',
  'tests/contract/init-no-prune.test.mjs',
];

function parseFlagValue(argv, longName) {
  const eq = `--${longName}=`;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith(eq)) return arg.slice(eq.length);
    if (
      arg === `--${longName}` &&
      argv[i + 1] &&
      !argv[i + 1].startsWith('--')
    ) {
      return argv[i + 1];
    }
  }
  return null;
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function readRoleFromMetadata(root) {
  const metaPath = path.join(root, 'starter.role.json');
  if (!fs.existsSync(metaPath)) return null;
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    return typeof meta.role === 'string' ? meta.role : null;
  } catch {
    return null;
  }
}

/**
 * Mark starter.role.json with samplesPruned: true (no-op if metadata missing).
 */
export function markSamplesPruned(root) {
  const metaPath = path.join(root, 'starter.role.json');
  if (!fs.existsSync(metaPath)) return;
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  meta.samplesPruned = true;
  meta.updatedAt = new Date().toISOString();
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
}

/**
 * Immediate child directories of `specs/` (starter Speckit feature folders).
 * Leaves the `specs/` directory itself (and any loose files like `.gitkeep`).
 */
export function listSpecFeatureDirs(root) {
  const specsDir = path.join(root, 'specs');
  if (!fs.existsSync(specsDir)) return [];
  return fs
    .readdirSync(specsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join('specs', d.name));
}

/**
 * Paths to delete when keeping only `keepRole` (role samples + compose extras).
 * Spec feature dirs are resolved separately via {@link listSpecFeatureDirs}.
 */
export function pathsToPrune(keepRole) {
  if (!ALLOWED_ROLES.includes(keepRole)) {
    throw new Error(
      `Invalid role "${keepRole}". Allowed: ${ALLOWED_ROLES.join(', ')}`,
    );
  }
  const out = [...ALWAYS_ON_PRUNE];
  for (const [role, paths] of Object.entries(ROLE_SAMPLE_BUNDLES)) {
    if (role === keepRole) continue;
    out.push(...paths);
  }
  return out;
}

/**
 * Clear Speckit current-feature pointer when starter specs folders are removed.
 */
export function clearSpecifyFeaturePointer(root) {
  const featureJson = path.join(root, '.specify', 'feature.json');
  if (!fs.existsSync(featureJson)) return;
  fs.writeFileSync(featureJson, '{}\n', 'utf8');
}

/**
 * Delete other-role sample assets, related tests, and specs/* feature folders.
 * @returns {{ removed: string[], keptRole: string }}
 */
export function pruneOtherRoleSamples(root, keepRole) {
  const specDirs = listSpecFeatureDirs(root);
  const relativePaths = [...pathsToPrune(keepRole), ...specDirs];
  const removed = [];
  for (const rel of relativePaths) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) continue;
    fs.rmSync(abs, { recursive: true, force: true });
    removed.push(rel);
    console.log(`Removed ${rel}`);
  }
  if (specDirs.length > 0) {
    clearSpecifyFeaturePointer(root);
  }
  markSamplesPruned(root);
  return { removed, keptRole: keepRole };
}

function main() {
  const argv = process.argv.slice(2);
  const root = DEFAULT_ROOT;
  let role = parseFlagValue(argv, 'role');
  if (!role) {
    role = readRoleFromMetadata(root);
  }
  if (!role) {
    fail(
      '--role=standalone|host|remote|hybrid required (or run after init so starter.role.json exists)',
    );
  }
  if (!ALLOWED_ROLES.includes(role)) {
    fail(`Invalid --role. Allowed: ${ALLOWED_ROLES.join(', ')}`);
  }

  const { removed, keptRole } = pruneOtherRoleSamples(root, role);
  console.log(
    `Pruned other-role samples for role=${keptRole} (${removed.length} path(s) removed).`,
  );
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main();
}
