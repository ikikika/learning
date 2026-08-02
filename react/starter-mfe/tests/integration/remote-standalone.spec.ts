import { test, expect } from '@playwright/test';

const THEME_STORAGE_KEY = 'starter-mfe-theme';

test.describe('remote-standalone smoke', () => {
  test('default route, theme attribute, PWA artifacts', async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), THEME_STORAGE_KEY);
    await page.reload();

    // Remote has no MainLayout (no theme toggle / connection banner UI)
    await expect(page.getByTestId('demo-remote-route-1')).toBeVisible();
    await expect(page.getByLabel('Use dark theme')).toHaveCount(0);

    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme === 'light' || theme === 'dark').toBeTruthy();

    const manifest = await request.get('/manifest.webmanifest');
    expect(manifest.ok()).toBeTruthy();
    const icon = await request.get('/icons/icon-192.png');
    expect(icon.ok()).toBeTruthy();
  });
});
