import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// Helper to get RSS link elements from the page
const getRssLinks = async (page: import('@playwright/test').Page) => {
  return page.locator('link[rel="alternate"][type="application/rss+xml"]');
};

// Helper to extract all href values from RSS links
const getRssHrefs = async (page: import('@playwright/test').Page): Promise<string[]> => {
  const rssLinks = await getRssLinks(page);
  const hrefs: string[] = [];
  const count = await rssLinks.count();
  for (let i = 0; i < count; i++) {
    const href = await rssLinks.nth(i).getAttribute('href');
    if (href) hrefs.push(href);
  }
  return hrefs;
};

test.describe('RSS Feed Discoverability', () => {

  test.describe('Homepage RSS links', () => {
    test('homepage includes exactly one RSS link (home feed)', async ({ page }) => {
      await page.goto(BASE_URL);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(1);

      // Verify the RSS link points to the root feed
      const href = await rssLinks.first().getAttribute('href');
      expect(href).toMatch(/\/index\.xml$/);

      // Verify the type attribute
      await expect(rssLinks.first()).toHaveAttribute('type', 'application/rss+xml');
    });

    test('homepage RSS link includes site title', async ({ page }) => {
      await page.goto(BASE_URL);

      const rssLinks = await getRssLinks(page);
      const title = await rssLinks.first().getAttribute('title');
      expect(title).toBeTruthy();
    });
  });

  test.describe('Blog section RSS links', () => {
    test('blog list page includes home RSS and section RSS links', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(2);

      const hrefs = await getRssHrefs(page);

      // Should have one root RSS and one blog RSS
      expect(hrefs.some(h => h.match(/\/index\.xml$/) && !h.includes('/blog/'))).toBe(true);
      expect(hrefs.some(h => h.includes('/blog/index.xml'))).toBe(true);
    });

    test('blog section RSS link has correct URL format', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/`);

      const hrefs = await getRssHrefs(page);
      const blogRssHref = hrefs.find(h => h.includes('/blog/index.xml'));

      expect(blogRssHref).toBeTruthy();
      expect(blogRssHref).toContain('/blog/index.xml');
    });
  });

  test.describe('Taxonomy list page RSS links', () => {
    test('tags list page includes home RSS and taxonomy RSS links', async ({ page }) => {
      await page.goto(`${BASE_URL}/tags/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(2);

      const hrefs = await getRssHrefs(page);
      expect(hrefs.some(h => h.includes('/tags/index.xml'))).toBe(true);
    });

    test('categories list page includes home RSS and taxonomy RSS links', async ({ page }) => {
      await page.goto(`${BASE_URL}/categories/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(2);

      const hrefs = await getRssHrefs(page);
      expect(hrefs.some(h => h.includes('/categories/index.xml'))).toBe(true);
    });
  });

  test.describe('Term page RSS links', () => {
    test('tag term page includes home RSS and term RSS links', async ({ page }) => {
      await page.goto(`${BASE_URL}/tags/sample/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(2);

      const hrefs = await getRssHrefs(page);
      expect(hrefs.some(h => h.includes('/tags/sample/index.xml'))).toBe(true);
    });
  });

  test.describe('Single page (no section RSS)', () => {
    test('blog post page only includes home RSS link', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/sample/`);

      const rssLinks = await getRssLinks(page);
      // Single pages don't have their own RSS, only home RSS
      await expect(rssLinks).toHaveCount(1);

      const href = await rssLinks.first().getAttribute('href');
      expect(href).toMatch(/\/index\.xml$/);
      expect(href).not.toContain('/blog/sample/');
    });
  });

  test.describe('Multilingual RSS links', () => {
    test('Spanish homepage RSS link has correct language prefix', async ({ page }) => {
      await page.goto(`${BASE_URL}/es/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(1);

      const href = await rssLinks.first().getAttribute('href');
      expect(href).toContain('/es/');
      expect(href).toMatch(/\/es\/index\.xml$/);
    });

    test('Spanish blog section RSS has correct language prefix', async ({ page }) => {
      await page.goto(`${BASE_URL}/es/blog/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(2);

      const hrefs = await getRssHrefs(page);
      expect(hrefs.some(h => h.includes('/es/blog/index.xml'))).toBe(true);
    });

    test('Arabic (RTL) homepage RSS link has correct language prefix', async ({ page }) => {
      await page.goto(`${BASE_URL}/ar/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(1);

      const href = await rssLinks.first().getAttribute('href');
      expect(href).toContain('/ar/');
    });

    test('Hebrew (RTL) blog RSS has correct language prefix', async ({ page }) => {
      await page.goto(`${BASE_URL}/he/blog/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(2);

      const hrefs = await getRssHrefs(page);
      expect(hrefs.some(h => h.includes('/he/blog/index.xml'))).toBe(true);
    });

    test('French tags taxonomy RSS has correct language prefix', async ({ page }) => {
      await page.goto(`${BASE_URL}/fr/tags/`);

      const rssLinks = await getRssLinks(page);
      await expect(rssLinks).toHaveCount(2);

      const hrefs = await getRssHrefs(page);
      expect(hrefs.some(h => h.includes('/fr/tags/index.xml'))).toBe(true);
    });
  });

  test.describe('RSS feed accessibility', () => {
    test('home RSS feed is accessible and returns XML', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/index.xml`);
      expect(response?.status()).toBe(200);
      const contentType = response?.headers()['content-type'] ?? '';
      expect(contentType).toMatch(/xml|rss/i);
    });

    test('blog section RSS feed is accessible', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/blog/index.xml`);
      expect(response?.status()).toBe(200);
    });

    test('tags taxonomy RSS feed is accessible', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/tags/index.xml`);
      expect(response?.status()).toBe(200);
    });

    test('tag term RSS feed is accessible', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/tags/sample/index.xml`);
      expect(response?.status()).toBe(200);
    });

    test('multilingual RSS feeds are accessible', async ({ page }) => {
      // Spanish home RSS
      const esResponse = await page.goto(`${BASE_URL}/es/index.xml`);
      expect(esResponse?.status()).toBe(200);

      // Spanish blog RSS
      const esBlogResponse = await page.goto(`${BASE_URL}/es/blog/index.xml`);
      expect(esBlogResponse?.status()).toBe(200);
    });
  });

  test.describe('Footer section has no RSS', () => {
    test('footer section does not generate RSS feed', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/footer/index.xml`);
      // Should be 404 since footer output is disabled
      expect(response?.status()).toBe(404);
    });
  });

  test.describe('RSS link attributes', () => {
    test('RSS links have correct media type', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/`);

      const rssLinks = await getRssLinks(page);
      const count = await rssLinks.count();

      for (let i = 0; i < count; i++) {
        const type = await rssLinks.nth(i).getAttribute('type');
        expect(type).toBe('application/rss+xml');
      }
    });

    test('RSS links have title attributes', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/`);

      const rssLinks = await getRssLinks(page);
      const count = await rssLinks.count();

      for (let i = 0; i < count; i++) {
        const title = await rssLinks.nth(i).getAttribute('title');
        expect(title).toBeTruthy();
      }
    });
  });
});
