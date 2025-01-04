import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';

test.describe('Theme basic functionality', () => {
  test.beforeAll(async () => {
    // Optional: Add server health check
    await fetch(BASE_URL);
  });

  test('homepage loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Adritian/);
  });

  test('theme switcher works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('#bd-theme');
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  });

  test('navigation is visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('footer links work', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.footer_links')).toBeVisible();
  });
});