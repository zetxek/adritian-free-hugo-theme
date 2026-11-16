import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// Extract repeated selectors into constants
const FOOTER_THEME_CONTAINER = 'div#footer-color-selector';
const FOOTER_THEME_SELECTOR = `${FOOTER_THEME_CONTAINER} button.bd-theme-selector`;
const FOOTER_THEME_LIGHT = `${FOOTER_THEME_CONTAINER} .dropdown-item[data-bs-theme-value="light"]`;
const FOOTER_THEME_DARK = `${FOOTER_THEME_CONTAINER} .dropdown-item[data-bs-theme-value="dark"]`;
const FOOTER_THEME_AUTO = `${FOOTER_THEME_CONTAINER} .dropdown-item[data-bs-theme-value="auto"]`;
const THEME_BUTTONS = 'button.bd-theme-selector';
const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('Theme switching functionality', () => {
  test('verifies bold styling of selected theme and updates on switch', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Go to homepage
    await page.goto(BASE_URL);
    
    // Open theme dropdown
    await page.locator(FOOTER_THEME_SELECTOR).click();
    
    // Verify initial Light theme is bold (font-weight: 700)
    const lightButton = page.locator(FOOTER_THEME_LIGHT);
    await expect(lightButton).toHaveCSS('font-weight', '700');
    
    // Switch to Dark theme
    await page.locator(FOOTER_THEME_DARK).click();
    
    // Verify Dark theme is now bold and Light is not
    const darkButton = page.locator(FOOTER_THEME_DARK);
    await expect(darkButton).toHaveCSS('font-weight', '700');
    await expect(lightButton).toHaveCSS('font-weight', '400');
    
    // Switch to Auto theme
    await page.locator(FOOTER_THEME_SELECTOR).click();
    await page.locator(FOOTER_THEME_AUTO).click();
    
    // Verify Auto theme is bold and others are not
    const autoButton = page.locator(FOOTER_THEME_AUTO);
    await expect(autoButton).toHaveCSS('font-weight', '700');
    await expect(darkButton).toHaveCSS('font-weight', '400');
    await expect(lightButton).toHaveCSS('font-weight', '400');
  });

  test('theme selection persists after page reload', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Go to homepage
    await page.goto(BASE_URL);
    
    // Switch to Dark theme
    await page.locator(FOOTER_THEME_SELECTOR).click();
    await page.locator(FOOTER_THEME_DARK).click();
    
    // Reload page
    await page.reload();
    
    // Open dropdown and verify Dark theme is still bold
    await page.locator(FOOTER_THEME_SELECTOR).click();
    const darkButton = page.locator(FOOTER_THEME_DARK);
    await expect(darkButton).toHaveCSS('font-weight', '700');
  });

  // WCAG 2.5.3 Label in Name: the accessible name must contain the visible label
  test('theme switcher accessible name contains its visible label', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    for (const { url, helper } of [
      { url: BASE_URL, helper: 'Toggle theme' },
      { url: `${BASE_URL}/es/`, helper: 'Seleccionar esquema de color' },
    ]) {
      await page.goto(url);

      const buttons = page.locator(THEME_BUTTONS);
      await expect(buttons).toHaveCount(2);

      for (let i = 0; i < 2; i++) {
        const button = buttons.nth(i);
        const visible = ((await button.locator('.current-theme').textContent()) ?? '').trim();
        expect(visible.length).toBeGreaterThan(0);
        const escaped = escapeRegExp(visible);
        await expect(button).toHaveAccessibleName(new RegExp(`^${escaped}`));
        await expect(button).toHaveAccessibleName(new RegExp(escaped));
        // Not the bare helper text
        await expect(button).not.toHaveAccessibleName(helper);
      }
    }
  });
});
