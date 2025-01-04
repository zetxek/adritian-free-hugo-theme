import { test, expect } from '@playwright/test';

test.describe('Theme basic functionality', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Adritian/);
  });

  test('theme switcher works', async ({ page }) => {
    await page.goto('/');
    await page.click('#bd-theme');
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  });

  test('navigation is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.footer_links')).toBeVisible();
  });
});