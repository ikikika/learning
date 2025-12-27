import { test, expect } from '@playwright/test';

/**
 * Compose smoke — host embeds a hybrid's federated expose as a leaf
 * (`alias=demoHybrid`), at PLAYWRIGHT_HOST_URL / PLAYWRIGHT_HYBRID_URL
 * (set by `scripts/compose-harness.mjs --mode=shell-hybrid`).
 */
const HOST_URL = process.env.PLAYWRIGHT_HOST_URL || 'http://127.0.0.1:3001';

test.describe('compose smoke (host + hybrid)', () => {
  test('host embeds hybrid chrome; hybrid does not surface its own theme toggle', async ({
    page,
  }) => {
    test.skip(
      !process.env.PLAYWRIGHT_HOST_URL,
      'compose harness did not set PLAYWRIGHT_HOST_URL',
    );
    test.setTimeout(60_000);

    await page.goto(HOST_URL);
    await expect(page.getByTestId('demo-host-home-page')).toBeVisible({
      timeout: 30_000,
    });

    // Host owns document theme before navigating into the embedded hybrid
    await page.getByLabel('Use dark theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('nav a[href="/remote/demoHybrid"]').click();
    await expect(page.getByTestId('demo-hybrid-header-band')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page).toHaveURL(/\/remote\/demoHybrid/);

    // The embedded hybrid never renders its own theme toggle — `embedded`
    // is authoritative and forces `showThemeToggle` off. The page-level
    // toggle exists exactly once (the host's own, in MainLayout).
    const hybridPanel = page.getByTestId('demo-hybrid-header-band');
    await expect(hybridPanel.getByLabel('Use dark theme')).toHaveCount(0);
    await expect(page.getByLabel('Use dark theme')).toHaveCount(1);

    // Host still owns document theme after mounting the embedded hybrid
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByLabel('Use light theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
