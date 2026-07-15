import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// Regression coverage for issue #568: the "footer" content section must never
// be independently browsable, but its content must still be included inline
// on every page via the footer partial. The only thing that actually enforces
// this is that layouts/footer/{single,list,rss.xml}.html are deliberately
// empty templates — hugo.toml previously had dead outputFormats/outputs/
// disableKinds config that looked load-bearing but did nothing (confirmed via
// the "Unknown kind \"footer\" in outputs configuration" build warning it
// produced). These tests guard against either the empty templates being
// filled in, or the "footer" section becoming independently browsable again.
test.describe('Footer section output suppression', () => {
  test('footer section list page is not browsable', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/footer/`);
    expect(response?.status()).toBe(404);
  });

  test('footer content single page is not browsable', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/footer/footer/`);
    expect(response?.status()).toBe(404);
  });

  test('footer section has no RSS feed', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/footer/index.xml`);
    expect(response?.status()).toBe(404);
  });

  test('footer content (from content/footer/footer.md) still renders inline on the homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    // The contact section comes from the footer content type's markdown
    // body (rendered via the contact-section shortcode), not from static
    // template markup — so this specifically exercises the
    // `where .Site.Pages "Type" "footer"` lookup in the footer partial.
    await expect(page.locator('footer .section--contact')).toBeVisible();
    await expect(page.locator('footer .section--contact')).toContainText('Reach out');
  });

  test('footer content still renders inline on a blog post', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/sample/`);
    await expect(page.locator('footer .section--contact')).toBeVisible();
  });

  test('footer content still renders inline for a translated locale', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    // Spanish footer content uses a different shortcode "id" ("contacto"),
    // so assert on the locale-agnostic class rather than the section id.
    await expect(page.locator('footer .section--contact')).toBeVisible();
    await expect(page.locator('footer .section--contact')).toContainText('Contáctame');
  });
});
