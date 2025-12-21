import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';

test.describe('RTL (Right-to-Left) language support', () => {
  test.beforeAll(async () => {
    // Health check
    try {
      await fetch(BASE_URL);
    } catch (error) {
      console.error(`Failed to connect to ${BASE_URL}. Is the Hugo server running?`);
      throw error;
    }
  });

  test('Arabic page has RTL direction attribute', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/`);
    
    // Verify RTL direction attribute on html element
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('Hebrew page has RTL direction attribute', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/he/`);
    
    // Verify RTL direction attribute on html element
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'he');
  });

  test('LTR pages have correct direction attribute', async ({ page }) => {
    // English (default)
    await page.goto(BASE_URL);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Spanish
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    // French
    await page.goto(`${BASE_URL}/fr/`);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('Arabic language displays Arabic text correctly', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/`);
    
    // Verify Arabic translations are displayed
    await expect(page.getByText('اللغة').first()).toBeVisible();
  });

  test('Hebrew language displays Hebrew text correctly', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/he/`);
    
    // Verify Hebrew translations are displayed
    await expect(page.getByText('שפה').first()).toBeVisible();
  });

  test('can switch from LTR to RTL language', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Start with English (LTR)
    await page.goto(BASE_URL);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    
    // Switch to Arabic (RTL)
    await page.locator('div#footer-language-selector button').click();
    await page.getByText('العربية').last().click();
    
    // Verify switch to RTL
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('can switch from RTL to LTR language', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Start with Arabic (RTL)
    await page.goto(`${BASE_URL}/ar/`);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Switch to English (LTR)
    await page.locator('div#footer-language-selector button').click();
    await page.getByText('English').last().click();
    
    // Verify switch to LTR
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('RTL CSS styles are applied correctly', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/`);
    
    // Verify that the html element has the dir="rtl" attribute
    // This is the primary indicator that RTL styling should be applied
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // CSS direction property should be set by the browser based on dir attribute
    const html = page.locator('html');
    const direction = await html.evaluate(el => window.getComputedStyle(el).direction);
    expect(direction).toBe('rtl');
  });

  test('navigation works correctly in RTL mode', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/`);
    
    // Verify navbar is visible and functional
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Verify header navigation links are present
    const navItems = page.locator('.navbar-nav .nav-item');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer displays correctly in RTL mode', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/`);
    
    // Verify footer links are visible
    await expect(page.locator('.footer_links')).toBeVisible();
  });
});
