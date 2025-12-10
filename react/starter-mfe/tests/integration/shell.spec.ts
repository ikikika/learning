import { test, expect } from '@playwright/test';

const THEME_STORAGE_KEY = 'starter-mfe-theme';

test.describe('shell smoke', () => {
  test('fallback for unreachable remote + empty/invalid URL; theme persistence', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    // Empty remote URL → fallback
    await page.goto('/?remoteUrl=');
    await expect(page.getByTestId('shell-home-page')).toBeVisible();
    await expect(page.getByTestId('remote-fallback')).toBeVisible();
    await expect(page.getByTestId('remote-fallback')).toContainText(
      /empty or invalid/i,
    );

    // Invalid URL
    await page.goto('/?remoteUrl=not-a-url');
    await expect(page.getByTestId('remote-fallback')).toContainText(
      /empty or invalid/i,
    );

    // Unreachable remote (nothing listening on configured remoteEntry)
    await page.goto('/');
    await expect(page.getByTestId('remote-fallback')).toBeVisible({
      timeout: 15_000,
    });

    // Theme: first visit + toggle + reload + use-system
    await page.goto('/?remoteUrl=');
    await page.evaluate((key) => localStorage.removeItem(key), THEME_STORAGE_KEY);
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
