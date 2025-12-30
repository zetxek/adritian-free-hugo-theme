import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

const getCanonical = async (page: import('@playwright/test').Page) => {
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  return canonical.getAttribute('href');
};

const parseJsonLd = async (page: import('@playwright/test').Page) => {
  const scripts = page.locator('script[type="application/ld+json"]');
  const count = await scripts.count();
  const objects: Record<string, unknown>[] = [];

  for (let i = 0; i < count; i += 1) {
    const raw = (await scripts.nth(i).innerText()).trim();
    if (!raw) {
      continue;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      objects.push(...parsed);
    } else {
      objects.push(parsed);
    }
  }

  return objects;
};

test.describe('SEO metadata', () => {
  test('homepage includes canonical, twitter, and JSON-LD site metadata', async ({ page }) => {
    await page.goto(BASE_URL);

    const canonicalHref = await getCanonical(page);
    const expectedCanonical = new URL('/', BASE_URL).toString();
    expect(canonicalHref).toBe(expectedCanonical);

    const twitterSite = page.locator('meta[name="twitter:site"]');
    await expect(twitterSite).toHaveAttribute('content', '@zetxek');

    const twitterCreator = page.locator('meta[name="twitter:creator"]');
    await expect(twitterCreator).toHaveAttribute('content', '@zetxek');

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', /summary/i);

    const jsonLd = await parseJsonLd(page);
    const webSite = jsonLd.find(item => item['@type'] === 'WebSite');
    expect(webSite).toBeTruthy();

    const person = jsonLd.find(item => item['@type'] === 'Person');
    expect(person).toBeTruthy();
  });

  test('blog post includes BlogPosting JSON-LD and canonical', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/new-features-demo/`);

    const canonicalHref = await getCanonical(page);
    const expectedCanonical = new URL('/blog/new-features-demo/', BASE_URL).toString();
    expect(canonicalHref).toBe(expectedCanonical);

    const jsonLd = await parseJsonLd(page);
    const blogPosting = jsonLd.find(item => item['@type'] === 'BlogPosting');
    expect(blogPosting).toBeTruthy();
    expect(blogPosting?.headline).toBe('New Theme Features Demo');
  });
});
