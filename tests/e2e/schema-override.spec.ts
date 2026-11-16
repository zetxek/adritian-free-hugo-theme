import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

async function getJsonLdScripts(page) {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return scripts.map((script) => JSON.parse(script));
}

test.describe('Per-page JSON-LD schema override', () => {
  test('blog post with `schema` front matter renders a FAQPage with camelCase keys preserved, alongside BlogPosting', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/content-sync-preview/`);

    const scripts = await getJsonLdScripts(page);

    const faqPage = scripts.find((s) => s['@type'] === 'FAQPage');
    expect(faqPage).toBeTruthy();
    expect(Array.isArray(faqPage.mainEntity)).toBe(true);
    expect(faqPage.mainEntity.length).toBeGreaterThan(0);
    expect(faqPage.mainEntity[0]['@type']).toBe('Question');
    expect(faqPage.mainEntity[0].acceptedAnswer).toBeTruthy();
    expect(faqPage.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');

    const blogPosting = scripts.find((s) => s['@type'] === 'BlogPosting');
    expect(blogPosting).toBeTruthy();
  });

  test('blog post without `schema` front matter has no FAQPage JSON-LD', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/getting-started/`);

    const scripts = await getJsonLdScripts(page);
    const faqPage = scripts.find((s) => s['@type'] === 'FAQPage');
    expect(faqPage).toBeFalsy();
  });
});
