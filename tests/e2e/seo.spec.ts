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
test('homepage includes canonical, twitter (from params.social), and JSON-LD site metadata', async ({ page }) => {
    await page.goto(BASE_URL);

    const canonicalHref = await getCanonical(page);
    const expectedCanonical = new URL('/', BASE_URL).toString();
    expect(canonicalHref).toBe(expectedCanonical);

    const twitterSite = page.locator('meta[name="twitter:site"]');
    await expect(twitterSite).toHaveCount(1);
    await expect(twitterSite).toHaveAttribute('content', '@zetxek');

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

  test('blog post JSON-LD extracts image from images.featured_image (YAML format)', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/test-image-yaml-format/`);

    const jsonLd = await parseJsonLd(page);
    const blogPosting = jsonLd.find(item => item['@type'] === 'BlogPosting');
    expect(blogPosting).toBeTruthy();
    expect(blogPosting?.headline).toBe('Test Post - YAML Image Format');
    
    // Verify image is correctly extracted from images.featured_image
    expect(blogPosting?.image).toBeTruthy();
    expect(Array.isArray(blogPosting?.image)).toBe(true);
    const imageArray = blogPosting?.image as string[];
    expect(imageArray.length).toBeGreaterThan(0);
    expect(imageArray[0]).toContain('/img/blog/test-yaml-format.png');
  });

  test('blog post JSON-LD extracts image from featuredImage parameter', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/test-image-featured-image/`);

    const jsonLd = await parseJsonLd(page);
    const blogPosting = jsonLd.find(item => item['@type'] === 'BlogPosting');
    expect(blogPosting).toBeTruthy();
    expect(blogPosting?.headline).toBe('Test Post - FeaturedImage Parameter');
    
    // Verify image is correctly extracted from featuredImage parameter
    expect(blogPosting?.image).toBeTruthy();
    expect(Array.isArray(blogPosting?.image)).toBe(true);
    const imageArray = blogPosting?.image as string[];
    expect(imageArray.length).toBeGreaterThan(0);
    expect(imageArray[0]).toContain('/img/blog/test-featured-image.png');
  });

  test('blog post JSON-LD falls back to site-level image when no page image specified', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/test-image-no-image/`);

    const jsonLd = await parseJsonLd(page);
    const blogPosting = jsonLd.find(item => item['@type'] === 'BlogPosting');
    expect(blogPosting).toBeTruthy();
    expect(blogPosting?.headline).toBe('Test Post - No Image Fallback');
    
    // Verify image falls back to site-level image from hugo.toml (params.images)
    expect(blogPosting?.image).toBeTruthy();
    expect(Array.isArray(blogPosting?.image)).toBe(true);
    const imageArray = blogPosting?.image as string[];
    expect(imageArray.length).toBeGreaterThan(0);
    expect(imageArray[0]).toContain('/img/og-img.png');
  });

  test('blog post JSON-LD extracts image from images array format', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/test-image-array-format/`);

    const jsonLd = await parseJsonLd(page);
    const blogPosting = jsonLd.find(item => item['@type'] === 'BlogPosting');
    expect(blogPosting).toBeTruthy();
    expect(blogPosting?.headline).toBe('Test Post - Images Array Format');
    
    // Verify image is correctly extracted from images array (first element)
    expect(blogPosting?.image).toBeTruthy();
    expect(Array.isArray(blogPosting?.image)).toBe(true);
    const imageArray = blogPosting?.image as string[];
    expect(imageArray.length).toBeGreaterThan(0);
    expect(imageArray[0]).toContain('/img/blog/test-images-array.png');
  });
});
