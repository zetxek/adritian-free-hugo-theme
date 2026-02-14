import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

async function getBreadcrumbJsonLd(page) {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  for (const script of scripts) {
    const data = JSON.parse(script);
    if (data['@type'] === 'BreadcrumbList') {
      return data;
    }
  }
  return null;
}

test.describe('BreadcrumbList JSON-LD', () => {
  test('homepage has no breadcrumb JSON-LD', async ({ page }) => {
    await page.goto(BASE_URL);
    const breadcrumb = await getBreadcrumbJsonLd(page);
    expect(breadcrumb).toBeNull();
  });

  test('blog post has breadcrumb with 3 items', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/getting-started/`);
    const breadcrumb = await getBreadcrumbJsonLd(page);
    expect(breadcrumb).not.toBeNull();
    expect(breadcrumb['@context']).toBe('https://schema.org');
    expect(breadcrumb.itemListElement).toHaveLength(3);

    // First item is Home
    expect(breadcrumb.itemListElement[0].position).toBe(1);
    expect(breadcrumb.itemListElement[0].name).toBe('Home');

    // Second item is Blog section
    expect(breadcrumb.itemListElement[1].position).toBe(2);
    expect(breadcrumb.itemListElement[1].item).toContain('/blog/');

    // Third item is the page itself
    expect(breadcrumb.itemListElement[2].position).toBe(3);
    expect(breadcrumb.itemListElement[2].item).toContain('/blog/getting-started/');
  });

  test('section list page has breadcrumb with 2 items', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/`);
    const breadcrumb = await getBreadcrumbJsonLd(page);
    expect(breadcrumb).not.toBeNull();
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0].name).toBe('Home');
    expect(breadcrumb.itemListElement[1].item).toContain('/blog/');
  });

  test('404 page has no breadcrumb JSON-LD', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page/`, { waitUntil: 'domcontentloaded' });
    const breadcrumb = await getBreadcrumbJsonLd(page);
    expect(breadcrumb).toBeNull();
  });
});
