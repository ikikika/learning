#!/usr/bin/env node
/**
 * Init CLI — configures this repository as exactly one role.
 * @see specs/001-react-role-scaffold/contracts/init-cli.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  DEFAULT_REMOTE_NAME,
  defaultNameForRole,
  isValidPackageName,
  toFederationName,
} = require('./app-name.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ALLOWED_ROLES = new Set(['standalone', 'shell', 'remote']);

const DEMO_TEMPLATE = path.join(ROOT, 'templates/role-assets/demo');
const SHELL_TEMPLATE = path.join(ROOT, 'templates/role-assets/shell');

const DEMO_LIVE = [
  'features/demo',
  'pages/HomePage',
];

const SHELL_LIVE = [
  'pages/ShellHomePage',
  'app/remotes/loadDemoRemote.tsx',
  'app/routes/shellRoutes.tsx',
];

function parseFlagValue(argv, longName) {
  const eq = `--${longName}=`;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith(eq)) return arg.slice(eq.length);
    if (arg === `--${longName}` && argv[i + 1] && !argv[i + 1].startsWith('--')) {
      return argv[i + 1];
    }
  }
  return null;
}

function parseArgs(argv) {
  return {
    role: parseFlagValue(argv, 'role'),
    name: parseFlagValue(argv, 'name'),
    remoteName: parseFlagValue(argv, 'remote-name'),
    force: argv.includes('--force'),
  };
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function assertValidName(label, value) {
  if (!isValidPackageName(value)) {
    fail(
      `Invalid ${label}. Use a camelCase identifier or lowercase npm-style name (e.g. myApp, my-app, or @scope/my-app)`,
    );
  }
}

function rmLive(relFromSrc) {
  const target = path.join(ROOT, 'src', relFromSrc);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.gitkeep') continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

/** Straight-copy restore: templates mirror src/ relative paths under demo|shell */
function restoreFromTemplate(templateRoot, relativePaths) {
  for (const rel of relativePaths) {
    const from = path.join(templateRoot, rel);
    const to = path.join(ROOT, 'src', rel);
    if (!fs.existsSync(from)) {
      console.warn(`Warning: template missing ${from}`);
      continue;
    }
    if (fs.statSync(from).isDirectory()) {
      fs.rmSync(to, { recursive: true, force: true });
      copyDir(from, to);
    } else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

function neverDeleteTemplates() {
  // Intentional no-op guard: callers must not rm templates/role-assets/*
  if (!fs.existsSync(DEMO_TEMPLATE) || !fs.existsSync(SHELL_TEMPLATE)) {
    fail('templates/role-assets/{demo,shell} must exist and are never deleted');
  }
}

function writeMetadata({ role, name, remoteName }) {
  const meta = {
    role,
    name,
    federationName: toFederationName(name),
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  if (role === 'shell') {
    meta.remoteName = remoteName;
    meta.remoteFederationName = toFederationName(remoteName);
  }
  fs.writeFileSync(
    path.join(ROOT, 'starter.role.json'),
    `${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  );
}

function patchPackageName(name) {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.name === name) return;
  pkg.name = name;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

function patchReadme(role, name) {
  const readmePath = path.join(ROOT, 'README.md');
  let text = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, 'utf8')
    : '# Starter MFE\n\n';
  const roleBlock = `<!-- ROLE:START -->\n**Active role:** \`${role}\`\n\n**App name:** \`${name}\`\n\nStart: \`npm start\` (after \`npm install\`)\n<!-- ROLE:END -->`;
  if (text.includes('<!-- ROLE:START -->')) {
    text = text.replace(
      /<!-- ROLE:START -->[\s\S]*?<!-- ROLE:END -->/,
      roleBlock,
    );
  } else {
    text = `${roleBlock}\n\n${text}`;
  }
  fs.writeFileSync(readmePath, text, 'utf8');
}

function initStandaloneOrRemote() {
  for (const rel of SHELL_LIVE) {
    rmLive(rel);
  }
  restoreFromTemplate(DEMO_TEMPLATE, DEMO_LIVE);
}

function initShell() {
  for (const rel of DEMO_LIVE) {
    rmLive(rel);
  }
  restoreFromTemplate(SHELL_TEMPLATE, SHELL_LIVE);
}

function main() {
  const { role, name: nameArg, remoteName: remoteNameArg, force } = parseArgs(
    process.argv.slice(2),
  );

  if (!role) {
    fail('--role=standalone|shell|remote required');
  }
  if (!ALLOWED_ROLES.has(role)) {
    fail(`Invalid --role. Allowed: standalone, shell, remote`);
  }

  const name = nameArg ?? defaultNameForRole(role);
  assertValidName('--name', name);

  let remoteName = DEFAULT_REMOTE_NAME;
  if (role === 'shell') {
    remoteName = remoteNameArg ?? DEFAULT_REMOTE_NAME;
    assertValidName('--remote-name', remoteName);
  } else if (remoteNameArg) {
    fail('--remote-name is only valid with --role=shell');
  }

  const metaPath = path.join(ROOT, 'starter.role.json');
  if (fs.existsSync(metaPath) && !force) {
    fail('starter.role.json already exists; re-init requires --force');
  }

  neverDeleteTemplates();

  if (role === 'shell') {
    initShell();
  } else {
    initStandaloneOrRemote();
  }

  writeMetadata({ role, name, remoteName });
  if (nameArg) {
    patchPackageName(name);
  }
  patchReadme(role, name);
  const fed = toFederationName(name);
  console.log(`Initialized role: ${role}, name: ${name} (federation: ${fed})`);
  if (role === 'shell') {
    console.log(
      `Shell remote container: ${toFederationName(remoteName)} (import alias: demoRemote)`,
    );
  }
}

main();
