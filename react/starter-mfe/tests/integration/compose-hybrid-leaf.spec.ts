import { test, expect } from '@playwright/test';

/**
 * Compose smoke — hybrid embeds a remote's federated expose as a leaf
 * (`alias=demoRemote`), at PLAYWRIGHT_HYBRID_URL / PLAYWRIGHT_REMOTE_URL
 * (set by `scripts/compose-harness.mjs --mode=hybrid-leaf`).
 */
const HYBRID_URL = process.env.PLAYWRIGHT_HYBRID_URL || 'http://127.0.0.1:3003';

test.describe('compose smoke (hybrid + remote leaf)', () => {
  test('hybrid nav loads the leaf remote into its panel with hybrid chrome intact', async ({
    page,
  }) => {
    test.skip(
      !process.env.PLAYWRIGHT_HYBRID_URL,
      'compose harness did not set PLAYWRIGHT_HYBRID_URL',
    );
    test.setTimeout(60_000);

    await page.goto(HYBRID_URL);
    await expect(page.getByTestId('demo-hybrid-home-page')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('demo-hybrid-header-band')).toBeVisible();
    await expect(page.getByTestId('hybrid-welcome')).toBeVisible();

    await page.locator('nav a[href="/demoRemote"]').click();
    await expect(page).toHaveURL(/\/demoRemote/);

    // Hybrid chrome stays mounted around the leaf panel
    await expect(page.getByTestId('demo-hybrid-header-band')).toBeVisible();

    await expect(page.getByTestId('demo-remote-route-1')).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.getByTestId('demo-remote-host-title')).toHaveText(
      'From Hybrid',
    );
  });

  test('empty remote URL surfaces the shared fallback inside hybrid chrome', async ({
    page,
  }) => {
    test.skip(
      !process.env.PLAYWRIGHT_HYBRID_URL,
      'compose harness did not set PLAYWRIGHT_HYBRID_URL',
    );

    await page.goto(`${HYBRID_URL}/demoRemote?remoteUrl=`);
    await expect(page.getByTestId('demo-hybrid-header-band')).toBeVisible();
    await expect(page.getByTestId('remote-fallback')).toBeVisible();
    await expect(page.getByTestId('remote-fallback')).toContainText(
      /empty or invalid/i,
    );
  });
});
