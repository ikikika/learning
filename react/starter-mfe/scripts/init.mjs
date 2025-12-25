#!/usr/bin/env node
/**
 * Init CLI — configures this repository as exactly one role.
 * Does not prune/restore src files (no templates). Role is metadata + webpack.
 * Flags preferred for CI; missing required values prompt when stdin is a TTY.
 * @see specs/001-react-role-scaffold/contracts/init-cli.md
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
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
  parseRemoteFlag,
  hostRemoteSnippetForApp,
  writeLoadersGenerated,
} = require('./remotes-config.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ALLOWED_ROLES = ['standalone', 'host', 'remote'];
const ALLOWED_ROLE_SET = new Set(ALLOWED_ROLES);

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
  if (role === 'host') return 'PORT_HOST';
  if (role === 'remote') return 'PORT_REMOTE';
  return 'PORT_STANDALONE';
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function canPrompt() {
  return Boolean(input.isTTY && output.isTTY);
}

function tryParsePort(raw) {
  if (raw == null || String(raw).trim() === '') return null;
  if (!/^\d+$/.test(String(raw).trim())) return null;
  const n = Number(String(raw).trim());
  if (!Number.isInteger(n) || n < 1 || n > 65535) return null;
  return n;
}

function parsePortOrFail(raw) {
  const n = tryParsePort(raw);
  if (n == null) {
    fail(
      raw == null || raw === ''
        ? '--port=<number> required (1–65535)'
        : 'Invalid --port. Use an integer from 1 to 65535',
    );
  }
  return n;
}

function assertValidName(label, value) {
  if (!isValidPackageName(value)) {
    fail(
      `Invalid ${label}. Use a camelCase identifier or lowercase npm-style name (e.g. myApp, my-app, or @scope/my-app)`,
    );
  }
}

async function promptLine(rl, question) {
  const answer = await rl.question(question);
  return answer.trim();
}

async function promptRole(rl) {
  console.log('Select role:');
  ALLOWED_ROLES.forEach((r, i) => {
    console.log(`  ${i + 1}) ${r}`);
  });
  for (;;) {
    const answer = await promptLine(
      rl,
      `Role [1-${ALLOWED_ROLES.length} or name]: `,
    );
    if (!answer) {
      console.log('Role is required.');
      continue;
    }
    if (/^\d+$/.test(answer)) {
      const idx = Number(answer) - 1;
      if (idx >= 0 && idx < ALLOWED_ROLES.length) return ALLOWED_ROLES[idx];
    }
    if (ALLOWED_ROLE_SET.has(answer)) return answer;
    console.log(`Invalid role. Choose: ${ALLOWED_ROLES.join(', ')}`);
  }
}

async function promptName(rl, role) {
  const fallback = defaultNameForRole(role);
  for (;;) {
    const answer = await promptLine(rl, `App name [${fallback}]: `);
    const value = answer || fallback;
    if (isValidPackageName(value)) return { name: value, provided: Boolean(answer) };
    console.log(
      'Invalid name. Use camelCase or lowercase npm-style (e.g. myApp, my-app, @scope/my-app)',
    );
  }
}

async function promptPort(rl) {
  for (;;) {
    const answer = await promptLine(rl, 'Port (1–65535): ');
    const n = tryParsePort(answer);
    if (n != null) return n;
    console.log('Enter an integer port from 1 to 65535.');
  }
}

/**
 * Fill missing role / name / port via prompts when TTY; otherwise fail like flags.
 */
async function resolveInteractive(args) {
  let { role, name: nameArg, port: portArg } = args;
  let nameProvided = nameArg != null;

  const needsPrompt =
    !role || portArg == null || portArg === '' || nameArg == null;

  if (!needsPrompt) {
    return { role, nameArg, nameProvided, portArg };
  }

  if (!canPrompt()) {
    if (!role) fail('--role=standalone|host|remote required');
    if (portArg == null || portArg === '') {
      fail('--port=<number> required (1–65535)');
    }
    return { role, nameArg, nameProvided, portArg };
  }

  const rl = readline.createInterface({ input, output });
  try {
    if (!role) {
      role = await promptRole(rl);
    } else if (!ALLOWED_ROLE_SET.has(role)) {
      fail(`Invalid --role. Allowed: ${ALLOWED_ROLES.join(', ')}`);
    }

    if (nameArg == null) {
      const prompted = await promptName(rl, role);
      nameArg = prompted.name;
      nameProvided = prompted.provided;
    }

    if (portArg == null || portArg === '') {
      portArg = String(await promptPort(rl));
    }
  } finally {
    rl.close();
  }

  return { role, nameArg, nameProvided, portArg };
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

function buildHostRemotes({ remoteNameArg, remoteFlags }) {
  if (remoteFlags.length && remoteNameArg) {
    fail('Use either --remote (repeatable) or --remote-name, not both');
  }

  let remotes = [];
  if (remoteFlags.length) {
    try {
      remotes = remoteFlags.map((spec) => parseRemoteFlag(spec));
    } catch (err) {
      fail(err instanceof Error ? err.message : String(err));
    }
  } else if (remoteNameArg) {
    assertValidName('--remote-name', remoteNameArg);
    remotes = [defaultDemoRemote(remoteNameArg)];
  }
  // No --remote / --remote-name → empty remotes[]; add later via --remote (or future add-remote).

  const aliases = new Set();
  for (const r of remotes) {
    if (aliases.has(r.alias)) {
      fail(`Duplicate remote alias: ${r.alias}`);
    }
    aliases.add(r.alias);
  }
  return remotes;
}

function writeMetadata({ role, name, remotes }) {
  const meta = {
    role,
    name,
    federationName: toFederationName(name),
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  if (role === 'host') {
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const {
    remoteName: remoteNameArg,
    remotes: remoteFlags,
    force,
  } = args;

  const resolved = await resolveInteractive(args);
  const role = resolved.role;
  const nameArg = resolved.nameArg;
  const nameProvided = resolved.nameProvided;
  const portArg = resolved.portArg;

  if (!role) {
    fail('--role=standalone|host|remote required');
  }
  if (!ALLOWED_ROLE_SET.has(role)) {
    fail(`Invalid --role. Allowed: ${ALLOWED_ROLES.join(', ')}`);
  }

  const port = parsePortOrFail(portArg);
  const name = nameArg ?? defaultNameForRole(role);
  assertValidName('--name', name);

  let remotes = [];
  if (role === 'host') {
    remotes = buildHostRemotes({ remoteNameArg, remoteFlags });
  } else if (remoteNameArg || remoteFlags.length) {
    fail('--remote / --remote-name are only valid with --role=host');
  }

  const metaPath = path.join(ROOT, 'starter.role.json');
  if (fs.existsSync(metaPath) && !force) {
    fail('starter.role.json already exists; re-init requires --force');
  }

  // Role selection is metadata + webpack only. Live src/ keeps all sample
  // assets; do not prune/restore. Prefer one role per clone and avoid switching.
  if (role === 'host') {
    writeLoadersGenerated(remotes, ROOT);
  }

  writeMetadata({ role, name, remotes });
  patchEnvPort(role, port);
  if (nameProvided) {
    patchPackageName(name);
  }
  patchReadme(role, name);
  const fed = toFederationName(name);
  const portKey = portEnvKeyForRole(role);
  console.log(
    `Initialized role: ${role}, name: ${name} (federation: ${fed}), ${portKey}=${port}`,
  );
  if (role === 'host') {
    for (const r of remotes) {
      console.log(
        `Remote: alias=${r.alias} federation=${r.federationName} expose=${r.expose} urlEnv=${r.urlEnv}`,
      );
    }
  }
  if (role === 'remote') {
    const snippet = hostRemoteSnippetForApp(name);
    console.log(
      `Expose: ${toExposePath(name)} → ./src/app/FederatedRemoteApp.tsx`,
    );
    console.log('');
    console.log('In your host clone, run:');
    console.log(
      `npm run add-remote -- --alias=${snippet.alias} --name=${snippet.name} --port=${port} --expose=${snippet.expose} --federation-name=${snippet.federationName} --url-env=${snippet.urlEnv}`,
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
