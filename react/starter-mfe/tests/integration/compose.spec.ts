import { test, expect } from '@playwright/test';

/**
 * Compose smoke — expects shell at PLAYWRIGHT_SHELL_URL and remote at PLAYWRIGHT_REMOTE_URL
 * (set by scripts/compose-harness.mjs). Fallback ports match .env defaults.
 */
const SHELL_URL =
  process.env.PLAYWRIGHT_SHELL_URL || 'http://127.0.0.1:3001';
const REMOTE_URL =
  process.env.PLAYWRIGHT_REMOTE_URL || 'http://127.0.0.1:3002';

test.describe('compose smoke (two workspaces)', () => {
  test('shell owns document theme; embedded demo does not take over', async ({
    page,
  }) => {
    test.skip(
      !process.env.PLAYWRIGHT_SHELL_URL,
      'compose harness did not set PLAYWRIGHT_SHELL_URL',
    );

    await page.goto(SHELL_URL);
    await expect(page.getByTestId('demo-shell-home-page')).toBeVisible({
      timeout: 30_000,
    });

    await page.getByLabel('Use dark theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const remoteNav = page.locator(
      '[data-testid="demo-shell-home-page"] nav a[href^="/remote/"]',
    );
    if (await remoteNav.count()) {
      await remoteNav.first().click();
    }

    const remoteRoute1 = page.getByTestId('demo-remote-route-1');
    if (await remoteRoute1.count()) {
      await expect(remoteRoute1).toBeVisible();
    }

    const remotePage = await page.context().newPage();
    await remotePage.goto(REMOTE_URL);
    await expect(remotePage.getByTestId('demo-remote-route-1')).toBeVisible();
    await expect(
      remotePage.getByTestId('demo-remote-host-title'),
    ).toHaveCount(0);
  });

  test('per-remote titles and Route 2 in panel', async ({ page }) => {
    test.skip(
      !process.env.PLAYWRIGHT_SHELL_URL,
      'compose harness did not set PLAYWRIGHT_SHELL_URL',
    );
    test.setTimeout(90_000);

    await page.goto(SHELL_URL);
    await expect(page.getByTestId('demo-shell-home-page')).toBeVisible({
      timeout: 30_000,
    });

    await page.locator('nav a[href="/remote/demoRemote"]').click();
    await expect(page.getByTestId('demo-remote-route-1')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page).toHaveURL(/\/remote\/demoRemote\/route-1/);
    await expect(page.getByTestId('demo-remote-host-title')).toHaveText(
      'From Shell A',
    );

    await page.getByTestId('demo-remote-to-route-2').click();
    await expect(page.getByTestId('demo-remote-route-2')).toBeVisible();
    await expect(page).toHaveURL(/\/remote\/demoRemote\/route-2/);
    await expect(page.getByTestId('demo-shell-home-page')).toBeVisible();

    // Unmount first remote fully before loading second alias
    await page.locator('nav a[href="/"]').click();
    await expect(page.getByTestId('shell-welcome')).toBeVisible();

    await page.locator('nav a[href="/remote/billingRemote"]').click();
    await expect(page.getByTestId('demo-remote-route-1')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.getByTestId('demo-remote-host-title')).toHaveText(
      'Billing Slot',
    );
    await expect(page.getByTestId('demo-remote-host-title')).not.toHaveText(
      'From Shell A',
    );
  });
});
