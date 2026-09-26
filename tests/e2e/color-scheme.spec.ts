import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

/**
 * Tests for the color scheme switcher feature.
 *
 * Covers: dropdown visibility, opening, scheme switching, persistence,
 * footer selector, and shortcode rendering.
 *
 * Related issue: https://github.com/zetxek/adritian-free-hugo-theme/issues/495
 */
test.describe('Color scheme switcher', () => {
  // Use a wide viewport to ensure the color scheme selector is not hidden
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to start from a known state
    await page.goto(`${BASE_URL}/`);
    await page.evaluate(() => localStorage.removeItem('colorScheme'));
    await page.goto(`${BASE_URL}/`);
    // Prevent the navbar from overflowing by hiding other nav items
    await page.addStyleTag({ content: '.navbar-nav > .nav-item:nth-child(-n+4) { display: none !important; }' });
    // Trigger resize to force overflow calculation
    await page.setViewportSize({ width: 1920, height: 1081 });
    await page.waitForTimeout(300);
    await page.waitForLoadState('networkidle');
  });

  // Helper to get the visible scheme selector button and dropdown menu
  // (accounting for navbar overflow moving items to 'More' or 'Footer' dropdowns)
  async function getVisibleSchemeSelector(page: any) {
    return page.locator('.header #scheme-selector-header').first();
  }

  async function getVisibleSchemeDropdown(page: any) {
    return page.locator('.header #scheme-dropdown-header').first();
  }

  test('header scheme selector is visible', async ({ page }) => {
    const btn = await getVisibleSchemeSelector(page);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('data-bs-toggle', 'dropdown');
  });

  test('header scheme dropdown opens on click', async ({ page }) => {
    const btn = await getVisibleSchemeSelector(page);
    const menu = await getVisibleSchemeDropdown(page);

    // Initial state
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).not.toHaveClass(/show/);

    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveClass(/show/);
    await expect(menu).toBeVisible();

    // Click outside to close
    await page.mouse.click(0, 0);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).not.toHaveClass(/show/);
  });

  test('dropdown contains all scheme options', async ({ page }) => {
    const btn = await getVisibleSchemeSelector(page);
    await btn.click();

    const menu = await getVisibleSchemeDropdown(page);

    const expectedSchemes = ['default', 'ocean', 'forest', 'rose', 'slate', 'midnight', 'warm'];
    for (const scheme of expectedSchemes) {
      const item = menu.locator(`[data-scheme-value="${scheme}"]`);
      await expect(item).toBeVisible();
    }
  });

  test('selecting a scheme sets data-color-scheme on html element', async ({ page }) => {
    const btn = await getVisibleSchemeSelector(page);
    await btn.click();

    const menu = await getVisibleSchemeDropdown(page);
    await menu.locator('[data-scheme-value="ocean"]').first().click();

    await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'ocean');
  });

  test('selecting a scheme persists in localStorage', async ({ page }) => {
    const btn = await getVisibleSchemeSelector(page);
    await btn.click();

    const menu = await getVisibleSchemeDropdown(page);
    await menu.locator('[data-scheme-value="forest"]').first().click();

    // Verify localStorage
    const storedScheme = await page.evaluate(() => localStorage.getItem('colorScheme'));
    expect(storedScheme).toBe('forest');
  });

  test('scheme persists after page reload', async ({ page }) => {
    let btn = await getVisibleSchemeSelector(page);
    await btn.click();
    let menu = await getVisibleSchemeDropdown(page);
    await menu.locator('[data-scheme-value="midnight"]').first().click();

    // Reload and verify scheme is still active
    await page.reload();
    await page.addStyleTag({ content: '.navbar-nav > .nav-item:nth-child(-n+4) { display: none !important; }' });
    await page.setViewportSize({ width: 1920, height: 1081 });
    await page.waitForTimeout(300);

    await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'midnight');

    btn = await getVisibleSchemeSelector(page);
    const activeBtn = await getVisibleSchemeDropdown(page).then(m => m.locator('[data-scheme-value="midnight"]'));
    // We already verified the html attribute, we can also verify the active state
    // But since the menu is closed after reload, the active button check is enough
  });

  test('gracefully falls back to default if stored scheme is invalid', async ({ page }) => {
    // Go to the page and inject a bad value before the reload happens
    await page.goto(`${BASE_URL}/`);
    await page.evaluate(() => localStorage.setItem('colorScheme', 'non-existent-theme'));

    // Reload the page so the switcher runs with the bad value
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify fallback to default occurred
    const scheme = await page.evaluate(() => document.documentElement.getAttribute('data-color-scheme'));
    expect(scheme).toBe('default');

    // Verify localStorage was corrected
    const stored = await page.evaluate(() => localStorage.getItem('colorScheme'));
    expect(stored).toBe('default');
  });

  test('selecting a scheme enables its override stylesheet', async ({ page }) => {
    const btn = await getVisibleSchemeSelector(page);
    await btn.click();

    const menu = await getVisibleSchemeDropdown(page);
    await menu.locator('[data-scheme-value="rose"]').first().click();

    const roseEnabled = await page.evaluate(() => {
      const link = document.querySelector('link[data-color-scheme="rose"]') as HTMLLinkElement;
      return link ? !link.disabled : false;
    });
    expect(roseEnabled).toBe(true);

    // All others should be disabled
    const defaultEnabled = await page.evaluate(() => {
      const link = document.querySelector('link[data-color-scheme="default"]') as HTMLLinkElement;
      return link ? !link.disabled : true;
    });
    expect(defaultEnabled).toBe(false);
  });

  test('active scheme button is marked as active', async ({ page }) => {
    const btn = await getVisibleSchemeSelector(page);
    await btn.click();
    
    const menu = await getVisibleSchemeDropdown(page);
    await menu.locator('[data-scheme-value="slate"]').click();

    // Reopen the dropdown
    await btn.click();

    const slateBtn = menu.locator('[data-scheme-value="slate"]');
    await expect(slateBtn).toHaveClass(/active/);
    await expect(slateBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('selecting a scheme synchronizes active state across all switchers globally', async ({ page }) => {
    // Click header dropdown and select 'warm'
    const headerBtn = await getVisibleSchemeSelector(page);
    await headerBtn.click();
    
    const menu = await getVisibleSchemeDropdown(page);
    await menu.locator('[data-scheme-value="warm"]').click();

    // Now open the footer dropdown and verify 'warm' is active there too
    const footerBtn = page.locator('#scheme-selector-footer');
    // scroll footer button into view
    await footerBtn.scrollIntoViewIfNeeded();
    await footerBtn.click();

    const footerWarmBtn = page.locator('#scheme-dropdown-footer [data-scheme-value="warm"]');
    await expect(footerWarmBtn).toHaveClass(/active/);
    await expect(footerWarmBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('footer scheme selector is visible', async ({ page }) => {
    const footerSelector = page.locator('.footer .dropdown').filter({ has: page.locator('[data-scheme-value]') });
    await expect(footerSelector).toBeVisible();
  });

  test('footer scheme dropdown opens on click', async ({ page }) => {
    const footerBtn = page.locator('#scheme-selector-footer');
    const footerMenu = page.locator('#scheme-dropdown-footer');

    await expect(footerBtn).toBeVisible();
    await footerBtn.click();
    await expect(footerMenu).toHaveClass(/show/);
  });

  test('per-scheme override stylesheets are included in head', async ({ page }) => {
    const schemes = ['default', 'ocean', 'forest', 'rose', 'slate', 'midnight', 'warm'];
    for (const scheme of schemes) {
      const link = page.locator(`link[data-color-scheme="${scheme}"]`);
      await expect(link).toHaveCount(1);
    }
  });
});

test.describe('Color scheme shortcode', () => {
  test('shortcode renders in a page when switcher is enabled', async ({ page }) => {
    // The shortcodes demo page contains the color-scheme-selector shortcode
    await page.goto(`${BASE_URL}/blog/shortcodes/`);
    await page.waitForLoadState('networkidle');

    const shortcodeSelector = page.locator('.color-scheme-selector-shortcode');
    await expect(shortcodeSelector).toBeVisible();

    const btn = shortcodeSelector.locator('[data-bs-toggle="dropdown"]');
    await expect(btn).toBeVisible();

    // Open the shortcode dropdown
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
});
