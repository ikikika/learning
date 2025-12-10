import { test, expect } from '@playwright/test';

const THEME_STORAGE_KEY = 'starter-mfe-theme';

test.describe('remote-standalone smoke', () => {
  test('theme first visit + reload + use-system; PWA artifacts; offline', async ({
    page,
    context,
    request,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), THEME_STORAGE_KEY);
    await page.reload();

    await expect(page.getByTestId('home-page')).toBeVisible();

    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme === 'light' || theme === 'dark').toBeTruthy();

    await page.getByLabel('Use dark theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByLabel('Use system theme').click();

    const manifest = await request.get('/manifest.webmanifest');
    expect(manifest.ok()).toBeTruthy();
    const icon = await request.get('/icons/icon-192.png');
    expect(icon.ok()).toBeTruthy();

    await context.setOffline(true);
    await expect(page.getByTestId('connection-required')).toContainText(
      /internet connection required/i,
    );
  });
});
