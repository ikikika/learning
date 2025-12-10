import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/** Minimal .env reader (avoids import.meta / createRequire — Playwright may load this as CJS). */
function loadDotEnv() {
  const filePath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(filePath)) return;
  for (const raw of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
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

loadDotEnv();

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

const host = process.env.DEV_HOST || '127.0.0.1';
const standalonePort = num('PORT_STANDALONE', 3000);
const PORT = process.env.PLAYWRIGHT_PORT
  ? Number(process.env.PLAYWRIGHT_PORT)
  : standalonePort;
const BASE = process.env.PLAYWRIGHT_BASE_URL || `http://${host}:${PORT}`;

export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: BASE,
    viewport: { width: 375, height: 812 },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'standalone',
      testMatch: /\/standalone\.spec\.ts$/,
    },
    {
      name: 'shell',
      testMatch: /\/shell\.spec\.ts$/,
    },
    {
      name: 'remote-standalone',
      testMatch: /\/remote-standalone\.spec\.ts$/,
    },
    {
      name: 'compose',
      testMatch: /\/compose\.spec\.ts$/,
    },
    {
      name: 'a11y',
      testMatch: /\/a11y\.spec\.ts$/,
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm start',
        url: BASE,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
