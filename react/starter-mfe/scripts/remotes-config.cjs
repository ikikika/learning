/**
 * Shell remotes[] helpers shared by init + webpack (CJS).
 */
const {
  DEFAULT_REMOTE_NAME,
  isValidPackageName,
  toExposePath,
  toFederationName,
} = require('./app-name.cjs');

const DEMO_ALIAS = 'demoRemote';
const DEMO_URL_ENV = 'DEMO_REMOTE_URL';

function aliasToUrlEnv(alias) {
  if (alias === DEMO_ALIAS) return DEMO_URL_ENV;
  return (
    String(alias)
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toUpperCase() + '_URL'
  );
}

function isValidAlias(alias) {
  return typeof alias === 'string' && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(alias);
}

function isValidExpose(expose) {
  return typeof expose === 'string' && /^\.\/[A-Za-z0-9/_-]+$/.test(expose);
}

function isValidUrlEnv(urlEnv) {
  return typeof urlEnv === 'string' && /^[A-Z][A-Z0-9_]*$/.test(urlEnv);
}

/** @returns {{ alias: string, name: string, federationName: string, expose: string, urlEnv: string }} */
function defaultDemoRemote(name = DEFAULT_REMOTE_NAME) {
  return {
    alias: DEMO_ALIAS,
    name,
    federationName: toFederationName(name),
    expose: toExposePath(name),
    urlEnv: DEMO_URL_ENV,
  };
}

/**
 * Suggested shell remotes[] entry for a remote repo after init --role=remote.
 * Alias defaults to the federation container name so it is unique per remote.
 * Expose defaults to PascalCase of the app name (matches remote webpack exposes).
 */
function shellRemoteSnippetForApp(name) {
  const federationName = toFederationName(name);
  const alias = federationName;
  return normalizeRemoteEntry({
    alias,
    name,
    federationName,
    expose: toExposePath(name),
    urlEnv: aliasToUrlEnv(alias),
  });
}

/**
 * Normalize one remote entry (fills federationName / defaults).
 * @param {object} entry
 */
function normalizeRemoteEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    throw new Error('Remote entry must be an object');
  }
  const alias = entry.alias || DEMO_ALIAS;
  const name = entry.name || alias;
  const expose = entry.expose || toExposePath(name);
  const urlEnv = entry.urlEnv || aliasToUrlEnv(alias);
  const federationName =
    entry.federationName || toFederationName(name);

  if (!isValidAlias(alias)) {
    throw new Error(`Invalid remote alias: ${alias}`);
  }
  if (!isValidPackageName(name)) {
    throw new Error(`Invalid remote name: ${name}`);
  }
  if (!isValidExpose(expose)) {
    throw new Error(`Invalid remote expose: ${expose}`);
  }
  if (!isValidUrlEnv(urlEnv)) {
    throw new Error(`Invalid remote urlEnv: ${urlEnv}`);
  }
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(federationName)) {
    throw new Error(`Invalid remote federationName: ${federationName}`);
  }

  return { alias, name, federationName, expose, urlEnv };
}

/**
 * Resolve remotes[] from metadata, including legacy remoteName fields.
 * Empty `remotes: []` means no remotes (do not seed a default).
 * @param {object} meta
 */
function remotesFromMeta(meta = {}) {
  if (Array.isArray(meta.remotes)) {
    return meta.remotes.map((r) => normalizeRemoteEntry(r));
  }
  if (meta.remoteName || meta.remoteFederationName) {
    const name = meta.remoteName || DEFAULT_REMOTE_NAME;
    return [
      normalizeRemoteEntry({
        alias: DEMO_ALIAS,
        name,
        federationName:
          meta.remoteFederationName || toFederationName(name),
        expose: toExposePath(name),
        urlEnv: DEMO_URL_ENV,
      }),
    ];
  }
  return [];
}

/**
 * Parse `--remote=alias:name[:expose[:urlEnv]]`.
 * @param {string} spec
 */
function parseRemoteFlag(spec) {
  if (!spec || typeof spec !== 'string') {
    throw new Error('Empty --remote value');
  }
  const parts = spec.split(':');
  if (parts.length < 2) {
    throw new Error(
      'Invalid --remote. Use alias:name[:expose[:urlEnv]] (e.g. demoRemote:my-checkout)',
    );
  }
  const alias = parts[0];
  const name = parts[1];
  let expose = toExposePath(name);
  let urlEnv;
  if (parts.length >= 3) {
    if (parts[2].startsWith('./')) {
      expose = parts[2];
      if (parts.length >= 4) urlEnv = parts[3];
    } else if (parts.length === 3 && isValidUrlEnv(parts[2])) {
      urlEnv = parts[2];
    } else {
      throw new Error(
        `Invalid --remote expose (expected ./Module): ${parts[2]}`,
      );
    }
  }
  return normalizeRemoteEntry({ alias, name, expose, urlEnv });
}

/**
 * MF import path: alias + expose without leading "."
 * e.g. demoRemote + ./Checkout → demoRemote/Checkout
 */
function remoteImportPath(alias, expose) {
  const mod = expose.startsWith('./') ? expose.slice(2) : expose;
  return `${alias}/${mod}`;
}

/**
 * Expand a local port to a remoteEntry URL.
 * @param {number|string} port
 * @param {string} [host]
 */
function urlFromPort(port, host = '127.0.0.1') {
  const n = typeof port === 'string' ? Number(port) : port;
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new Error(`Invalid port: ${port}`);
  }
  const h = host && String(host).trim() ? String(host).trim() : '127.0.0.1';
  return `http://${h}:${n}/remoteEntry.js`;
}

/**
 * Parse `--props` JSON object string.
 * @param {string} raw
 * @returns {Record<string, unknown>}
 */
function parsePropsJson(raw) {
  if (raw == null || String(raw).trim() === '') {
    throw new Error('--props requires a JSON object string');
  }
  let parsed;
  try {
    parsed = JSON.parse(String(raw));
  } catch {
    throw new Error('Invalid --props JSON');
  }
  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new Error('--props must be a JSON object (not array or primitive)');
  }
  return parsed;
}

/**
 * Normalize remoteProps map; drop non-object values.
 * @param {unknown} map
 * @returns {Record<string, Record<string, unknown>>}
 */
function normalizeRemotePropsMap(map) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) return {};
  /** @type {Record<string, Record<string, unknown>>} */
  const out = {};
  for (const [alias, bag] of Object.entries(map)) {
    if (bag && typeof bag === 'object' && !Array.isArray(bag)) {
      out[alias] = { ...bag };
    }
  }
  return out;
}

/**
 * Generate TypeScript loader registry for shell role.
 * @param {Array<{ alias: string, expose: string }>} remotes
 */
function generateLoadersSource(remotes) {
  const lines = [
    '/* Generated by init / add-remote — do not edit by hand. */',
    "import type { ComponentType } from 'react';",
    '',
    'export type RemoteModule = {',
    '  default?: ComponentType<Record<string, unknown> & { embedded?: boolean }>;',
    '  App?: ComponentType<Record<string, unknown> & { embedded?: boolean }>;',
    '  [exportName: string]:',
    '    | ComponentType<Record<string, unknown> & { embedded?: boolean }>',
    '    | undefined;',
    '};',
    '',
    'export type RemoteLoader = () => Promise<RemoteModule>;',
    '',
    'export const remoteLoaders: Record<string, RemoteLoader> = {',
  ];
  for (const r of remotes) {
    const importPath = remoteImportPath(r.alias, r.expose);
    lines.push(`  ${JSON.stringify(r.alias)}: () =>`);
    lines.push(
      `    // @ts-expect-error Module Federation remote — resolved at runtime`,
    );
    lines.push(`    import(${JSON.stringify(importPath)}) as Promise<RemoteModule>,`);
  }
  lines.push('};');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

/**
 * Write generated loaders file under project root.
 * @param {Array<{ alias: string, expose: string }>} remotes
 * @param {string} root
 */
function writeLoadersGenerated(remotes, root) {
  const fs = require('fs');
  const path = require('path');
  const dest = path.join(root, 'src/app/remotes/loaders.generated.ts');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, generateLoadersSource(remotes), 'utf8');
}

module.exports = {
  DEMO_ALIAS,
  DEMO_URL_ENV,
  aliasToUrlEnv,
  defaultDemoRemote,
  shellRemoteSnippetForApp,
  normalizeRemoteEntry,
  remotesFromMeta,
  parseRemoteFlag,
  remoteImportPath,
  generateLoadersSource,
  writeLoadersGenerated,
  urlFromPort,
  parsePropsJson,
  normalizeRemotePropsMap,
  isValidAlias,
  isValidExpose,
  isValidUrlEnv,
};
