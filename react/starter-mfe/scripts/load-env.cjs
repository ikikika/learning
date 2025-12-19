/**
 * Load repo-root `.env` into process.env (does not override non-empty env).
 * Shared by webpack (CJS) and Node scripts.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function loadEnvFile(filePath = path.join(ROOT, '.env')) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    const existing = process.env[key];
    // Allow .env to fill blanks (e.g. empty PORT_* placeholders or inherited "")
    if (existing === undefined || existing === '') {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

function portEnvKeyForRole(role) {
  if (role === 'shell') return 'PORT_SHELL';
  if (role === 'remote') return 'PORT_REMOTE';
  return 'PORT_STANDALONE';
}

function parsePortValue(raw) {
  if (raw == null || String(raw).trim() === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n > 65535) {
    return null;
  }
  return n;
}

function getPort(name) {
  return parsePortValue(process.env[name]);
}

function getPorts() {
  return {
    standalone: getPort('PORT_STANDALONE'),
    shell: getPort('PORT_SHELL'),
    remote: getPort('PORT_REMOTE'),
  };
}

function getPortForRole(role) {
  const fromPort = parsePortValue(process.env.PORT);
  if (fromPort != null) return fromPort;

  const key = portEnvKeyForRole(role);
  const n = getPort(key);
  if (n == null) {
    throw new Error(
      `${key} is not set. Run: npm run init -- --role=${role} --port=<number>`,
    );
  }
  return n;
}

function getDevHost() {
  return process.env.DEV_HOST || '127.0.0.1';
}

const DEMO_URL_ENV = 'DEMO_REMOTE_URL';

function getDemoRemoteUrl() {
  return getRemoteUrl(DEMO_URL_ENV);
}

/**
 * Resolve a remote entry URL from env (urlEnv key).
 * DEMO_REMOTE_URL defaults to local PORT_REMOTE when that port is set; other keys default to "".
 */
function getRemoteUrl(urlEnv = 'DEMO_REMOTE_URL') {
  if (process.env[urlEnv]) return process.env[urlEnv];
  if (urlEnv === 'DEMO_REMOTE_URL') {
    const remotePort = getPort('PORT_REMOTE');
    if (remotePort != null) {
      return `http://${getDevHost()}:${remotePort}/remoteEntry.js`;
    }
  }
  return '';
}

/**
 * @param {Array<{ alias: string, urlEnv: string }>} remotes
 * @returns {Record<string, string>}
 */
function getRemoteUrlsByAlias(remotes) {
  const out = {};
  for (const r of remotes) {
    out[r.alias] = getRemoteUrl(r.urlEnv);
  }
  return out;
}

function getApiBaseUrl() {
  return process.env.API_BASE_URL || '';
}

module.exports = {
  ROOT,
  loadEnvFile,
  portEnvKeyForRole,
  getPort,
  getPorts,
  getPortForRole,
  getDevHost,
  getDemoRemoteUrl,
  getRemoteUrl,
  getRemoteUrlsByAlias,
  getApiBaseUrl,
};
