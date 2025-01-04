import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Theme basic functionality', () => {
  test.beforeAll(async () => {
    // Health check
    try {
      await fetch(BASE_URL);
    } catch (error) {
      console.error(`Failed to connect to ${BASE_URL}. Is the Hugo server running?`);
      throw error;
    }
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