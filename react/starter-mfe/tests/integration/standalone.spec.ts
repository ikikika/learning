import { test, expect } from '@playwright/test';

const THEME_STORAGE_KEY = 'starter-mfe-theme';

test.describe('standalone smoke', () => {
  test('viewport, offline banner, theme first visit + reload + use-system', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.evaluate(
      (key) => localStorage.removeItem(key),
      THEME_STORAGE_KEY,
    );
    await page.reload();

    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('demo-feature')).toBeVisible();

    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme === 'light' || theme === 'dark').toBeTruthy();

    await page.getByLabel('Use dark theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.getByLabel('Use system theme').click();
    const cleared = await page.evaluate(
      (key) => localStorage.getItem(key),
      THEME_STORAGE_KEY,
    );
    expect(cleared).toBeNull();

    await context.setOffline(true);
    await expect(page.getByTestId('connection-required')).toContainText(
      /internet connection required/i,
    );
  });
});
