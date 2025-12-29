#!/usr/bin/env node
/**
 * Host or hybrid CLI: append one remote to starter.role.json remotes[],
 * write .env[urlEnv], regenerate loaders, optional remoteProps[alias].
 * Flags preferred for CI; missing required values prompt when stdin is a TTY.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { isValidPackageName, toExposePath, toFederationName } = require(
  './app-name.cjs',
);
const {
  aliasToUrlEnv,
  isValidAlias,
  isValidExpose,
  isValidUrlEnv,
  normalizeRemoteEntry,
  normalizeRemotePropsMap,
  parsePropsJson,
  remotesFromMeta,
  urlFromPort,
  writeLoadersGenerated,
} = require('./remotes-config.cjs');
const { getDevHost } = require('./load-env.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

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

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function canPrompt() {
  return Boolean(input.isTTY && output.isTTY);
}

function isValidHttpUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function tryParsePort(raw) {
  if (raw == null || String(raw).trim() === '') return null;
  if (!/^\d+$/.test(String(raw).trim())) return null;
  const n = Number(String(raw).trim());
  if (!Number.isInteger(n) || n < 1 || n > 65535) return null;
  return n;
}

function upsertEnvKey(envPath, key, value) {
  let text = '';
  if (fs.existsSync(envPath)) {
    text = fs.readFileSync(envPath, 'utf8');
  } else {
    const example = path.join(ROOT, '.env.example');
    if (fs.existsSync(example)) text = fs.readFileSync(example, 'utf8');
  }
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(text)) {
    text = text.replace(re, line);
  } else {
    text = `${text.trimEnd()}${text ? '\n' : ''}${line}\n`;
  }
  if (!text.endsWith('\n')) text += '\n';
  fs.writeFileSync(envPath, text, 'utf8');
}

function parseArgs(argv) {
  return {
    alias: parseFlagValue(argv, 'alias'),
    url: parseFlagValue(argv, 'url'),
    port: parseFlagValue(argv, 'port'),
    name: parseFlagValue(argv, 'name'),
    expose: parseFlagValue(argv, 'expose'),
    federationName: parseFlagValue(argv, 'federation-name'),
    urlEnv: parseFlagValue(argv, 'url-env'),
    props: parseFlagValue(argv, 'props'),
  };
}

function parsePropsOrFail(raw) {
  try {
    return parsePropsJson(raw);
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }
}

async function promptLine(rl, question) {
  const answer = await rl.question(question);
  return answer.trim();
}

async function promptAlias(rl) {
  for (;;) {
    const answer = await promptLine(
      rl,
      'Remote alias (webpack remotes map key, e.g. demoRemote): ',
    );
    if (!answer) {
      console.log('Alias is required.');
      continue;
    }
    if (!isValidAlias(answer)) {
      console.log(
        'Invalid alias. Use a JS identifier (e.g. demoRemote, billingRemote).',
      );
      continue;
    }
    return answer;
  }
}

async function promptName(rl, alias) {
  for (;;) {
    const answer = await promptLine(rl, `Remote name [${alias}]: `);
    const value = answer || alias;
    if (isValidPackageName(value)) return value;
    console.log(
      'Invalid name. Use camelCase or lowercase npm-style (e.g. myApp, my-app).',
    );
  }
}

async function promptLocation(rl) {
  console.log(
    'Remote location — provide a local port or an absolute remoteEntry URL.',
  );
  for (;;) {
    const kind = (
      await promptLine(rl, 'Use port or url? [port]: ')
    ).toLowerCase();
    if (!kind || kind === 'port' || kind === 'p') {
      for (;;) {
        const answer = await promptLine(rl, 'Port (1–65535): ');
        const n = tryParsePort(answer);
        if (n != null) return { port: String(n), url: null };
        console.log('Enter an integer port from 1 to 65535.');
      }
    }
    if (kind === 'url' || kind === 'u') {
      for (;;) {
        const answer = await promptLine(
          rl,
          'URL (http(s)://…/remoteEntry.js): ',
        );
        if (isValidHttpUrl(answer)) return { port: null, url: answer.trim() };
        console.log('Enter an absolute http(s) remoteEntry URL.');
      }
    }
    console.log('Enter "port" or "url".');
  }
}

async function promptOptional(rl, label, fallback) {
  const answer = await promptLine(rl, `${label} [${fallback}]: `);
  return answer || fallback;
}

async function promptProps(rl) {
  for (;;) {
    const answer = await promptLine(
      rl,
      'Props JSON object (optional, Enter to skip): ',
    );
    if (!answer) return null;
    try {
      return parsePropsJson(answer);
    } catch (err) {
      console.log(err instanceof Error ? err.message : String(err));
    }
  }
}

/**
 * Fill missing required values via prompts when TTY.
 * When prompting for required fields, also walk optional fields one-by-one
 * (Enter accepts defaults). If required flags are already complete, optionals
 * use flag values or defaults with no prompts.
 */
async function resolveInteractive(args) {
  let {
    alias,
    url,
    port,
    name,
    expose,
    federationName,
    urlEnv,
    props,
  } = args;

  const hasUrl = url != null && url !== '';
  const hasPort = port != null && port !== '';

  if (hasUrl && hasPort) {
    fail('Provide exactly one of --url=<url> or --port=<n>');
  }

  const needsAlias = !alias;
  const needsLocation = !hasUrl && !hasPort;
  const needsInteractive = needsAlias || needsLocation;

  if (!needsInteractive) {
    return {
      alias,
      url,
      port,
      name,
      expose,
      federationName,
      urlEnv,
      propsBag: props != null ? parsePropsOrFail(props) : null,
    };
  }

  if (!canPrompt()) {
    if (needsAlias) fail('--alias=<id> is required');
    fail('Provide exactly one of --url=<url> or --port=<n>');
  }

  const rl = readline.createInterface({ input, output });
  try {
    if (needsAlias) {
      alias = await promptAlias(rl);
    } else if (!isValidAlias(alias)) {
      fail(
        'Invalid --alias. Use a JS identifier (e.g. demoRemote, billingRemote)',
      );
    }

    if (needsLocation) {
      const loc = await promptLocation(rl);
      url = loc.url;
      port = loc.port;
    }

    // Walk remaining values one by one (flag wins if already set)
    if (name == null) {
      name = await promptName(rl, alias);
    }

    const defaultExpose = toExposePath(name || alias);
    const defaultFed = toFederationName(name || alias);
    const defaultUrlEnv = aliasToUrlEnv(alias);

    if (expose == null) {
      expose = await promptOptional(rl, 'Expose path', defaultExpose);
      if (!isValidExpose(expose)) {
        fail(`Invalid expose (expected ./Module): ${expose}`);
      }
    }

    if (federationName == null) {
      federationName = await promptOptional(
        rl,
        'Federation name',
        defaultFed,
      );
      if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(federationName)) {
        fail(`Invalid federation name: ${federationName}`);
      }
    }

    if (urlEnv == null) {
      urlEnv = await promptOptional(rl, 'URL env key', defaultUrlEnv);
      if (!isValidUrlEnv(urlEnv)) {
        fail(`Invalid url env key: ${urlEnv}`);
      }
    }

    let propsBag = null;
    if (props != null) {
      propsBag = parsePropsOrFail(props);
    } else {
      propsBag = await promptProps(rl);
    }

    return {
      alias,
      url,
      port,
      name,
      expose,
      federationName,
      urlEnv,
      propsBag,
    };
  } finally {
    rl.close();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const metaPath = path.join(ROOT, 'starter.role.json');

  if (!fs.existsSync(metaPath)) {
    fail('starter.role.json not found; run npm run init first');
  }

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    fail('starter.role.json is not valid JSON');
  }

  if (meta.role !== 'host' && meta.role !== 'hybrid') {
    fail(
      `add-remote requires role host or hybrid (current role: ${meta.role ?? 'unknown'}). No files were written.`,
    );
  }

  const resolved = await resolveInteractive(args);
  const {
    alias,
    url,
    port,
    name,
    expose,
    federationName,
    urlEnv,
    propsBag,
  } = resolved;

  const hasUrl = url != null && url !== '';
  const hasPort = port != null && port !== '';
  if (hasUrl === hasPort) {
    fail('Provide exactly one of --url=<url> or --port=<n>');
  }

  let resolvedUrl;
  if (hasUrl) {
    if (!isValidHttpUrl(url)) {
      fail('Invalid --url; expected absolute http(s) remoteEntry URL');
    }
    resolvedUrl = url.trim();
  } else {
    try {
      resolvedUrl = urlFromPort(port, getDevHost());
    } catch (err) {
      fail(err instanceof Error ? err.message : String(err));
    }
  }

  let entry;
  try {
    entry = normalizeRemoteEntry({
      alias,
      name: name || alias,
      expose: expose || undefined,
      federationName: federationName || undefined,
      urlEnv: urlEnv || aliasToUrlEnv(alias),
    });
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  if (federationName) {
    entry = { ...entry, federationName };
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(entry.federationName)) {
      fail(`Invalid --federation-name: ${entry.federationName}`);
    }
  }

  const remotes = remotesFromMeta(meta);
  if (remotes.some((r) => r.alias === entry.alias)) {
    fail(`Duplicate remote alias: ${entry.alias}. No files were written.`);
  }

  const nextRemotes = [...remotes, entry];
  meta.remotes = nextRemotes;
  meta.federationName =
    meta.federationName || toFederationName(meta.name || 'host');
  meta.updatedAt = new Date().toISOString();

  if (propsBag) {
    const existing = normalizeRemotePropsMap(meta.remoteProps);
    existing[entry.alias] = propsBag;
    meta.remoteProps = existing;
  }

  const envPath = path.join(ROOT, '.env');
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  upsertEnvKey(envPath, entry.urlEnv, resolvedUrl);
  writeLoadersGenerated(nextRemotes, ROOT);

  console.log(
    `Added remote: alias=${entry.alias} federation=${entry.federationName} expose=${entry.expose} urlEnv=${entry.urlEnv}`,
  );
  console.log(`${entry.urlEnv}=${resolvedUrl}`);
  if (propsBag) {
    console.log(`remoteProps.${entry.alias}=${JSON.stringify(propsBag)}`);
  }
  console.log(
    'Restart the composer (npm start) so webpack remotes map and baked props refresh.',
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
