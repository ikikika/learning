#!/usr/bin/env node
/**
 * Init CLI — configures this repository as exactly one role.
 * Does not prune/restore src files (no templates). Role is metadata + webpack.
 * @see specs/001-react-role-scaffold/contracts/init-cli.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  defaultNameForRole,
  isValidPackageName,
  toExposePath,
  toFederationName,
} = require('./app-name.cjs');
const {
  defaultDemoRemote,
  generateLoadersSource,
  parseRemoteFlag,
  shellRemoteSnippetForApp,
} = require('./remotes-config.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ALLOWED_ROLES = new Set(['standalone', 'shell', 'remote']);

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

function parseFlagValues(argv, longName) {
  const eq = `--${longName}=`;
  const out = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith(eq)) out.push(arg.slice(eq.length));
    else if (
      arg === `--${longName}` &&
      argv[i + 1] &&
      !argv[i + 1].startsWith('--')
    ) {
      out.push(argv[i + 1]);
    }
  }
  return out;
}

function parseArgs(argv) {
  return {
    role: parseFlagValue(argv, 'role'),
    name: parseFlagValue(argv, 'name'),
    port: parseFlagValue(argv, 'port'),
    remoteName: parseFlagValue(argv, 'remote-name'),
    remotes: parseFlagValues(argv, 'remote'),
    force: argv.includes('--force'),
  };
}

function portEnvKeyForRole(role) {
  if (role === 'shell') return 'PORT_SHELL';
  if (role === 'remote') return 'PORT_REMOTE';
  return 'PORT_STANDALONE';
}

function parsePort(raw) {
  if (raw == null || raw === '') {
    fail('--port=<number> required (1–65535)');
  }
  if (!/^\d+$/.test(raw)) {
    fail('Invalid --port. Use an integer from 1 to 65535');
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    fail('Invalid --port. Use an integer from 1 to 65535');
  }
  return n;
}

function patchEnvPort(role, port) {
  const key = portEnvKeyForRole(role);
  const envPath = path.join(ROOT, '.env');
  const examplePath = path.join(ROOT, '.env.example');
  let text;
  if (fs.existsSync(envPath)) {
    text = fs.readFileSync(envPath, 'utf8');
  } else if (fs.existsSync(examplePath)) {
    text = fs.readFileSync(examplePath, 'utf8');
  } else {
    text = '';
  }
  const line = `${key}=${port}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(text)) {
    text = text.replace(re, line);
  } else {
    text = `${text.trimEnd()}${text ? '\n' : ''}${line}\n`;
  }
  if (!text.endsWith('\n')) text += '\n';
  fs.writeFileSync(envPath, text, 'utf8');
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

function buildShellRemotes({ remoteNameArg, remoteFlags }) {
  if (remoteFlags.length && remoteNameArg) {
    fail('Use either --remote (repeatable) or --remote-name, not both');
  }

  let remotes;
  if (remoteFlags.length) {
    try {
      remotes = remoteFlags.map((spec) => parseRemoteFlag(spec));
    } catch (err) {
      fail(err instanceof Error ? err.message : String(err));
    }
  } else if (remoteNameArg) {
    assertValidName('--remote-name', remoteNameArg);
    remotes = [defaultDemoRemote(remoteNameArg)];
  } else {
    remotes = [defaultDemoRemote()];
  }

  const aliases = new Set();
  for (const r of remotes) {
    if (aliases.has(r.alias)) {
      fail(`Duplicate remote alias: ${r.alias}`);
    }
    aliases.add(r.alias);
  }
  return remotes;
}

function writeLoadersGenerated(remotes) {
  const dest = path.join(ROOT, 'src/app/remotes/loaders.generated.ts');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, generateLoadersSource(remotes), 'utf8');
}

function writeMetadata({ role, name, remotes }) {
  const meta = {
    role,
    name,
    federationName: toFederationName(name),
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  if (role === 'shell') {
    meta.remotes = remotes;
  }
  if (role === 'remote') {
    meta.expose = toExposePath(name);
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

function main() {
  const {
    role,
    name: nameArg,
    port: portArg,
    remoteName: remoteNameArg,
    remotes: remoteFlags,
    force,
  } = parseArgs(process.argv.slice(2));

  if (!role) {
    fail('--role=standalone|shell|remote required');
  }
  if (!ALLOWED_ROLES.has(role)) {
    fail(`Invalid --role. Allowed: standalone, shell, remote`);
  }

  const port = parsePort(portArg);
  const name = nameArg ?? defaultNameForRole(role);
  assertValidName('--name', name);

  let remotes = [];
  if (role === 'shell') {
    remotes = buildShellRemotes({ remoteNameArg, remoteFlags });
  } else if (remoteNameArg || remoteFlags.length) {
    fail('--remote / --remote-name are only valid with --role=shell');
  }

  const metaPath = path.join(ROOT, 'starter.role.json');
  if (fs.existsSync(metaPath) && !force) {
    fail('starter.role.json already exists; re-init requires --force');
  }

  // Role selection is metadata + webpack only. Live src/ keeps all sample
  // assets; do not prune/restore. Prefer one role per clone and avoid switching.
  if (role === 'shell') {
    writeLoadersGenerated(remotes);
  }

  writeMetadata({ role, name, remotes });
  patchEnvPort(role, port);
  if (nameArg) {
    patchPackageName(name);
  }
  patchReadme(role, name);
  const fed = toFederationName(name);
  const portKey = portEnvKeyForRole(role);
  console.log(
    `Initialized role: ${role}, name: ${name} (federation: ${fed}), ${portKey}=${port}`,
  );
  if (role === 'shell') {
    for (const r of remotes) {
      console.log(
        `Remote: alias=${r.alias} federation=${r.federationName} expose=${r.expose} urlEnv=${r.urlEnv}`,
      );
    }
  }
  if (role === 'remote') {
    const snippet = shellRemoteSnippetForApp(name);
    console.log(`Expose: ${toExposePath(name)} → ./src/app/App.tsx`);
    console.log('');
    console.log('Copy into shell starter.role.json → remotes[]:');
    console.log('---');
    console.log(JSON.stringify(snippet, null, 2));
    console.log('---');
    console.log(
      `Or re-init shell with: --remote=${snippet.alias}:${snippet.name}:${snippet.expose}:${snippet.urlEnv}`,
    );
  }
}

main();
