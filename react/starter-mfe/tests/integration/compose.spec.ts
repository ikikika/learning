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

    // Open remote panel before checking embedded demo
    const remoteNav = page.locator(
      '[data-testid="demo-shell-home-page"] nav a[href^="/remote/"]',
    );
    if (await remoteNav.count()) {
      await remoteNav.first().click();
    }

    // Embedded remote may or may not load; if it loads, must stay embedded
    const demo = page.getByTestId('demo-feature');
    if (await demo.count()) {
      await expect(demo).toHaveAttribute('data-embedded', 'true');
    }

    // Remote standalone still serves its own entry
    const remotePage = await page.context().newPage();
    await remotePage.goto(REMOTE_URL);
    await expect(remotePage.getByTestId('home-page')).toBeVisible();
  });
});
