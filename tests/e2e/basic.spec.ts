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
    await expect(page).toHaveTitle(/Adritian/);
  });

  test('theme switcher works', async ({ page }) => {
    // set the browser theme preference to "light"
    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });


    await page.goto(BASE_URL);
    // attribute exists
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme');
    // click on theme switcher
    await page.click('#bd-theme-footer');
    /* click on the html element:
    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                    ☀️ Light
                  </button>
    */
   await page.getByRole('button', { name: '☀️ Light' }).last().click();
   await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    // click on theme switcher
    await page.click('#bd-theme-footer');
    /* click on the html element:
    <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="true">
                    🌑 Dark
                    <span class="theme-icon dark d-none" aria-hidden="true"></span>
                  </button>
    */
    await expect(page.getByText('🌑 Dark').last()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  });

  test('navigation is visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('footer links work', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.footer_links')).toBeVisible();
  });

  test('skip to content link works', async ({ page }) => {
    // Navigate to a content page
    await page.goto(`${BASE_URL}/blog`);
    
    // The skip link should be initially hidden but in the DOM
    const skipLink = page.locator('.skip-to-content-link');
    await expect(skipLink).toBeAttached();
    
    // Focus the skip link (simulates tabbing to it)
    await skipLink.focus();
    
    // Now it should be visible
    await expect(skipLink).toBeVisible();
    
    // Press Enter key on the skip link
    await skipLink.press('Enter');
    
    // Verify we jumped to the main content
    // Check URL hash
    await expect(page).toHaveURL(/#main-content$/);
    
    // Verify focus is moved to main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });
});