import { createRequire } from 'node:module';
import { defineConfig, devices } from '@playwright/test';

const require = createRequire(import.meta.url);
const { getPorts, getDevHost } = require('./scripts/load-env.cjs');

const ports = getPorts();
const host = getDevHost();
const PORT = process.env.PLAYWRIGHT_PORT
  ? Number(process.env.PLAYWRIGHT_PORT)
  : ports.standalone;
const BASE =
  process.env.PLAYWRIGHT_BASE_URL || `http://${host}:${PORT}`;

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
