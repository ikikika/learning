#!/usr/bin/env node
/**
 * Init CLI — configures this repository as exactly one role.
 * @see specs/001-react-role-scaffold/contracts/init-cli.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function parseArgs(argv) {
  const out = { role: null, force: false };
  for (const arg of argv) {
    if (arg === '--force') out.force = true;
    else if (arg.startsWith('--role=')) out.role = arg.slice('--role='.length);
    else if (arg === '--role') {
      /* next token handled below */
    }
  }
  const roleIdx = argv.indexOf('--role');
  if (roleIdx !== -1 && argv[roleIdx + 1] && !argv[roleIdx + 1].startsWith('--')) {
    out.role = argv[roleIdx + 1];
  }
  return out;
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
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

function writeMetadata(role) {
  const meta = {
    role,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(ROOT, 'starter.role.json'),
    `${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  );
}

function patchReadme(role) {
  const readmePath = path.join(ROOT, 'README.md');
  let text = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, 'utf8')
    : '# Starter MFE\n\n';
  const roleBlock = `<!-- ROLE:START -->\n**Active role:** \`${role}\`\n\nStart: \`npm start\` (after \`npm install\`)\n<!-- ROLE:END -->`;
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

function initStandaloneOrRemote(role) {
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
  const { role, force } = parseArgs(process.argv.slice(2));

  if (!role) {
    fail('--role=standalone|shell|remote required');
  }
  if (!ALLOWED_ROLES.has(role)) {
    fail(`Invalid --role. Allowed: standalone, shell, remote`);
  }

  const metaPath = path.join(ROOT, 'starter.role.json');
  if (fs.existsSync(metaPath) && !force) {
    fail('starter.role.json already exists; re-init requires --force');
  }

  neverDeleteTemplates();

  if (role === 'shell') {
    initShell();
  } else {
    initStandaloneOrRemote(role);
  }

  writeMetadata(role);
  patchReadme(role);
  console.log(`Initialized role: ${role}`);
}

main();
