import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}
console.log(`Running tests against ${BASE_URL}`);

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
    await page.screenshot({ path: 'test-result/screenshots/homepage.png', fullPage: true });
    await expect(page).toHaveTitle(/Adritian/);
  });

  test('theme switcher works', async ({ page }) => {
    await page.goto(BASE_URL);
    // attribute exists
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme');
    await page.screenshot({ path: 'test-result/screenshots/base-theme.png', fullPage: true });
    // click on theme switcher
    await page.click('#bd-theme');
    /* click on the html element:
    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                    ☀️ Light
                  </button>
    */
    await page.click('text=☀️ Light');
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    await page.screenshot({ path: 'test-result/screenshots/light.png', fullPage: true });
    // click on theme switcher
    await page.click('#bd-theme');
    /* click on the html element:
    <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="true">
                    🌑 Dark
                    <span class="theme-icon dark d-none" aria-hidden="true"></span>
                  </button>
    */
    await page.click('text=🌑 Dark');
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    await page.screenshot({ path: 'test-result/screenshots/dark.png', fullPage: true });
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