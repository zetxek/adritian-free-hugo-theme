import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('HTML validation', () => {
  test('homepage has valid HTML structure', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check basic HTML structure
    await expect(page.locator('html')).toHaveAttribute('lang');
    await expect(page.locator('head')).toBeAttached();
    await expect(page.locator('body')).toBeAttached();
    
    // Verify meta tags
    await expect(page.locator('meta[charset]')).toBeAttached();
    await expect(page.locator('meta[name="viewport"]')).toBeAttached();
    await expect(page.locator('meta[name="description"]')).toBeAttached();
    
    // Check main structural elements
    await expect(page.locator('header')).toBeAttached();
    await expect(page.locator('footer')).toBeAttached();

  });

  test('page has valid theme attributes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const html = page.locator('html');
    
    // Check theme attributes are present
    await expect(html).toHaveAttribute('data-bs-theme');
    
    // If theme is forced, these attributes should be present
    const isForcedTheme = await html.getAttribute('theme-forced');
    if (isForcedTheme === 'true') {
      await expect(html).toHaveAttribute('theme-auto', 'false');
    }
  });

}); 