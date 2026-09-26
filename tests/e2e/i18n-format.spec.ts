import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// Regression coverage for issue #572: all 14 i18n/*.yaml files were
// mechanically converted from the legacy go-i18n verbose array format
// (`- id: "x"` / `translation: "y"`) to a flat key-value map. These tests
// verify translations still resolve correctly post-conversion, across
// multiple locales (including RTL), and specifically pin down the
// resolution of the "contact_button" key that had a duplicate definition
// in en.yaml before this fix deduplicated it.
test.describe('i18n flat-format translations', () => {
  test('English: skip-to-content link resolves the flat-format translation', async ({ page }) => {
    await page.goto(BASE_URL);
    const skipLink = page.locator('.skip-to-content-link');
    await expect(skipLink).toHaveText('Skip to main content');
    await expect(skipLink).toHaveAttribute('aria-label', 'Skip to main content');
  });

  test('Spanish: skip-to-content link resolves the flat-format translation', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const skipLink = page.locator('.skip-to-content-link');
    await expect(skipLink).toHaveText('Saltar al contenido principal');
  });

  test('Arabic (RTL): skip-to-content link resolves the flat-format translation', async ({ page }) => {
    await page.goto(`${BASE_URL}/ar/`);
    const skipLink = page.locator('.skip-to-content-link');
    await expect(skipLink).toHaveText('انتقل إلى المحتوى الرئيسي');
  });

  test('contact button resolves to the first (live) definition, not the removed duplicate', async ({ page }) => {
    // en.yaml previously defined "contact_button" twice ("Send message" and
    // "Send Message"); the conversion deduplicated it, keeping the first
    // definition to match pre-existing live behavior. This guards against
    // that resolution silently flipping.
    await page.goto(BASE_URL);
    const contactButton = page.locator('footer .section--contact button[type="submit"]');
    await expect(contactButton).toHaveText('Send message');
  });

  // While verifying the i18n conversion, we discovered exampleSite/i18n/
  // was a stale, un-migrated shadow copy of the theme's i18n files for
  // exactly the 5 locales exampleSite activates (en/es/fr/ar/he) — Hugo's
  // module system lets site-level content override the theme's mounted
  // i18n, so it was silently masking the theme's actual i18n files for any
  // key defined in both. It also still contained the old site-specific
  // content #561 had already stripped from the theme's i18n (meta_title,
  // logo text, etc.), except for footer_notice, which was genuinely still
  // live (exampleSite/hugo.toml never set params.footer.notice). Removed
  // the shadow directory and ported footer_notice to
  // [languages.<lang>.params.footer].notice per language, matching the
  // "site content belongs in hugo.toml, not i18n" principle from #561.
  test.describe('Footer notice (ported from the removed exampleSite/i18n shadow copy)', () => {
    const expected: Record<string, string> = {
      '': '© Adritian. Free Hugo theme by Adrián Moreno Peña.',
      'es/': '© Adritian. Tema gratuito de Hugo por Adrián Moreno Peña.',
      'fr/': '© Adritian. Thème gratuit Hugo par Adrián Moreno Peña.',
      'ar/': '© أدريتيان. قالب هوغو مجاني من إنشاء أدريان مورينو بينيا.',
      'he/': '© אדריטיאן. תבנית הוגו חינמית מאת אדריאן מורנו פניה.',
    };

    for (const [langPath, text] of Object.entries(expected)) {
      test(`footer notice renders correctly for /${langPath}`, async ({ page }) => {
        await page.goto(`${BASE_URL}/${langPath}`);
        await expect(page.locator('footer .footer__copy')).toHaveText(text);
      });
    }
  });
});
