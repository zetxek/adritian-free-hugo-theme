import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1313';

test.describe('Site without menus', () => {
  // Read environment variable TEST_NO_MENUS
  test.skip(process.env.TEST_NO_MENUS !== 'true', 'Skipping test because TEST_NO_MENUS is true');

  test('page should not have navigation menus when disabled', async ({ page }) => {
    // Navigate to the site with disabled menus
    await page.goto(`${BASE_URL}/disable-menu/`);

    // Verify header still exists but doesn't contain navigation
    await expect(page.locator('header')).toBeAttached();
    
    // Verify language selector is not present
    await expect(page.locator('#selector-language')).not.toBeAttached();
    
    // Verify main menu elements are not present
    await expect(page.locator('#main-menu')).not.toBeAttached();
    await expect(page.locator('#main-menu-mobile')).not.toBeAttached();

    // Verify the page still has basic required elements
    await expect(page.locator('main')).toBeAttached();
    await expect(page.locator('footer')).toBeAttached();
  });


  test('content should still be properly displayed', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    // Verify main content area exists and is visible
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
    await expect(mainContent.locator('.display-1')).toBeVisible();

    // Verify page title is still present
    await expect(page.locator('h1').first()).toBeVisible();
  });

  // 
}); 