import { test, expect } from '@playwright/test';

const THEME_STORAGE_KEY = 'starter-mfe-theme';

test.describe('host smoke', () => {
  test('fallback for unreachable remote + empty/invalid URL; theme persistence', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    // Default `/` shows Host welcome — no remote load
    await page.goto('/');
    await expect(page.getByTestId('demo-host-home-page')).toBeVisible();
    await expect(page.getByTestId('host-welcome')).toBeVisible();
    await expect(page.getByTestId('remote-fallback')).toHaveCount(0);

    // Empty remote URL → fallback (must be on remote panel route)
    await page.goto('/app/demoRemote?remoteUrl=');
    await expect(page.getByTestId('demo-host-home-page')).toBeVisible();
    await expect(page.getByTestId('remote-fallback')).toBeVisible();
    await expect(page.getByTestId('remote-fallback')).toContainText(
      /empty or invalid/i,
    );

    // Invalid URL
    await page.goto('/app/demoRemote?remoteUrl=not-a-url');
    await expect(page.getByTestId('remote-fallback')).toContainText(
      /empty or invalid/i,
    );

    // Unreachable remote (nothing listening on configured remoteEntry)
    await page.goto('/app/demoRemote');
    await expect(page.getByTestId('remote-fallback')).toBeVisible({
      timeout: 15_000,
    });

    // Theme: first visit + toggle + reload + use-system (on Host welcome)
    await page.goto('/');
    await page.evaluate(
      (key) => localStorage.removeItem(key),
      THEME_STORAGE_KEY,
    );
    await page.reload();
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme === 'light' || theme === 'dark').toBeTruthy();
    await page.getByLabel('Use dark theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByLabel('Use system theme').click();

    await context.setOffline(true);
    await expect(page.getByTestId('connection-required')).toContainText(
      /internet connection required/i,
    );
  });
});
