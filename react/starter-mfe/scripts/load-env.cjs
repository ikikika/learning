/**
 * Load repo-root `.env` into process.env (does not override existing env).
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
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

function num(name, fallback) {
  const raw = process.env[name];
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function getPorts() {
  return {
    standalone: num('PORT_STANDALONE', 3000),
    shell: num('PORT_SHELL', 3001),
    remote: num('PORT_REMOTE', 3002),
  };
}

function getPortForRole(role) {
  if (process.env.PORT) {
    const n = Number(process.env.PORT);
    if (Number.isFinite(n)) return n;
  }
  const ports = getPorts();
  if (role === 'shell') return ports.shell;
  if (role === 'remote') return ports.remote;
  return ports.standalone;
}

function getDevHost() {
  return process.env.DEV_HOST || '127.0.0.1';
}

function getDemoRemoteUrl() {
  if (process.env.DEMO_REMOTE_URL) return process.env.DEMO_REMOTE_URL;
  const ports = getPorts();
  return `http://${getDevHost()}:${ports.remote}/remoteEntry.js`;
}

function getApiBaseUrl() {
  return process.env.API_BASE_URL || '';
}

module.exports = {
  ROOT,
  loadEnvFile,
  getPorts,
  getPortForRole,
  getDevHost,
  getDemoRemoteUrl,
  getApiBaseUrl,
};
