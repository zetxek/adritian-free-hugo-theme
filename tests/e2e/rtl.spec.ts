import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

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

  test('breadcrumb renders correctly in RTL', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/blog/sample`);
    
    // Verify breadcrumbs are visible
    const breadcrumbs = page.locator('.breadcrumbs');
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs).toBeVisible();
      
      // Verify breadcrumb items align correctly
      const textAlign = await breadcrumbs.evaluate((el) => window.getComputedStyle(el).textAlign);
      expect(['right', 'start']).toContain(textAlign);
    }
  });

  test('code block alignment in RTL', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/blog/sample`);
    
    // Find code blocks
    const codeBlocks = page.locator('pre');
    const count = await codeBlocks.count();
    
    if (count > 0) {
      const firstCodeBlock = codeBlocks.first();
      const direction = await firstCodeBlock.evaluate((el) => window.getComputedStyle(el).direction);
      // Code blocks should remain LTR even in RTL pages
      expect(direction).toBe('ltr');
    }
  });

  test('blockquote border positioning in RTL', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/blog/sample`);
    
    // Find blockquotes
    const blockquotes = page.locator('blockquote');
    const count = await blockquotes.count();
    
    if (count > 0) {
      const firstBlockquote = blockquotes.first();
      const borderRight = await firstBlockquote.evaluate((el) => window.getComputedStyle(el).borderRightWidth);
      const borderLeft = await firstBlockquote.evaluate((el) => window.getComputedStyle(el).borderLeftWidth);
      
      // Border should be on the right in RTL
      expect(parseInt(borderRight) || 0).toBeGreaterThan(0);
      expect(parseInt(borderLeft) || 0).toBe(0);
    }
  });

  test('Table of Contents border positioning in RTL', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/blog/new-features-demo`);
    
    // Find table of contents
    const toc = page.locator('.table-of-contents');
    const count = await toc.count();
    
    if (count > 0) {
      const firstToc = toc.first();
      const borderRight = await firstToc.evaluate((el) => window.getComputedStyle(el).borderRightWidth);
      const borderLeft = await firstToc.evaluate((el) => window.getComputedStyle(el).borderLeftWidth);
      
      // Border should be on the right in RTL
      expect(parseInt(borderRight) || 0).toBeGreaterThan(0);
      expect(parseInt(borderLeft) || 0).toBe(0);
    }
  });

  test('image mirroring functionality in RTL', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/`);
    
    // Check showcase image (should be mirrored)
    const showcaseImage = page.locator('.showcase-section .profile-image img');
    const showcaseCount = await showcaseImage.count();
    
    if (showcaseCount > 0) {
      const transform = await showcaseImage.first().evaluate((el) => window.getComputedStyle(el).transform);
      // Should be mirrored (contains negative scale or scaleX(-1))
      expect(transform).not.toBe('none');
    }
  });

  test('responsive behavior in RTL mode', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}/ar/`);
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Verify navigation is still functional
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
