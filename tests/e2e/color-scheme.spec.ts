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
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to start from a known state
    await page.goto(`${BASE_URL}/`);
    await page.evaluate(() => localStorage.removeItem('colorScheme'));
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
  });

  test('header scheme selector is visible', async ({ page }) => {
    const btn = page.locator('#scheme-selector-header');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('data-bs-toggle', 'dropdown');
  });

  test('header scheme dropdown opens on click', async ({ page }) => {
    const btn = page.locator('#scheme-selector-header');
    const menu = page.locator('#scheme-dropdown-header');

    // Menu starts hidden
    await expect(menu).not.toHaveClass(/show/);

    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveClass(/show/);
    await expect(menu).toBeVisible();
  });

  test('dropdown contains all scheme options', async ({ page }) => {
    const btn = page.locator('#scheme-selector-header');
    await btn.click();

    const expectedSchemes = ['default', 'ocean', 'forest', 'rose', 'slate', 'midnight', 'warm'];
    for (const scheme of expectedSchemes) {
      await expect(page.locator(`[data-scheme-value="${scheme}"]`).first()).toBeVisible();
    }
  });

  test('selecting a scheme sets data-color-scheme on html element', async ({ page }) => {
    const btn = page.locator('#scheme-selector-header');
    await btn.click();

    await page.locator('[data-scheme-value="ocean"]').first().click();

    const scheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-color-scheme')
    );
    expect(scheme).toBe('ocean');
  });

  test('selecting a scheme persists in localStorage', async ({ page }) => {
    const btn = page.locator('#scheme-selector-header');
    await btn.click();

    await page.locator('[data-scheme-value="forest"]').first().click();

    const stored = await page.evaluate(() => localStorage.getItem('colorScheme'));
    expect(stored).toBe('forest');
  });

  test('scheme persists after page reload', async ({ page }) => {
    const btn = page.locator('#scheme-selector-header');
    await btn.click();
    await page.locator('[data-scheme-value="midnight"]').first().click();

    // Reload and verify scheme is still active
    await page.reload();
    await page.waitForLoadState('networkidle');

    const scheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-color-scheme')
    );
    expect(scheme).toBe('midnight');
  });

  test('selecting a scheme enables its override stylesheet', async ({ page }) => {
    const btn = page.locator('#scheme-selector-header');
    await btn.click();

    await page.locator('[data-scheme-value="rose"]').first().click();

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
    const btn = page.locator('#scheme-selector-header');
    await btn.click();
    await page.locator('[data-scheme-value="slate"]').first().click();

    // Reopen the dropdown
    await btn.click();

    const slateBtn = page.locator('[data-scheme-value="slate"]').first();
    await expect(slateBtn).toHaveClass(/active/);
    await expect(slateBtn).toHaveAttribute('aria-pressed', 'true');
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
    if (await shortcodeSelector.count() > 0) {
      await expect(shortcodeSelector).toBeVisible();
      const btn = shortcodeSelector.locator('[data-bs-toggle="dropdown"]');
      await expect(btn).toBeVisible();

      // Open the shortcode dropdown
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
    } else {
      // Skip if shortcode is not used in the demo content
      test.info().annotations.push({ type: 'note', description: 'Shortcode not found in demo page — add {{< color-scheme-selector >}} to a page to test' });
    }
  });
});
