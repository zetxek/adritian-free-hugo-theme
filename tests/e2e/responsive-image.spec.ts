import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

test.describe('Responsive image shortcode (blog post)', () => {
  test('renders <picture> with srcset in blog post', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/getting-started/`);

    // Find the picture element inside the post content
    const picture = page.locator('.post-content picture').first();
    await expect(picture).toBeVisible();

    // WebP source with srcset
    const webpSource = picture.locator('source[type="image/webp"]');
    await expect(webpSource).toHaveCount(1);
    const webpSrcset = await webpSource.getAttribute('srcset');
    expect(webpSrcset).toContain('400w');
    expect(webpSrcset).toContain('800w');
    expect(webpSrcset).toContain('.webp');

    // Original format source (accept any non-webp image type)
    const origSource = picture.locator('source:not([type="image/webp"])');
    await expect(origSource).toHaveCount(1);
    const origType = await origSource.getAttribute('type');
    expect(origType).toMatch(/^image\/(png|jpeg|gif|webp|svg\+xml)$/);

    // Fallback img has lazy loading and dimensions
    const img = picture.locator('img');
    await expect(img).toHaveAttribute('loading', 'lazy');
    await expect(img).toHaveAttribute('decoding', 'async');
    await expect(img).toHaveAttribute('width');
    await expect(img).toHaveAttribute('height');
    await expect(img).toHaveAttribute('alt', 'Adritian theme demo');

    // sizes attribute is set
    const sizes = await webpSource.getAttribute('sizes');
    expect(sizes).toContain('768px');

    await img.scrollIntoViewIfNeeded();
  });
});

test.describe('Responsive image partial (blog list page)', () => {
  test('featured post thumbnail uses responsive image or fallback img', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/`);

    // The featured post container should be visible on page 1
    const featuredContainer = page.locator('.featured-post-container');
    await expect(featuredContainer).toBeVisible();

    // Main featured post should have an image (either <picture> or fallback <img>)
    const mainFeatured = featuredContainer.locator('.p-4.p-md-5.mb-4.rounded').first();
    const mainImg = mainFeatured.locator('picture img, img.featured-thumbnail');
    const imgCount = await mainImg.count();

    if (imgCount > 0) {
      const img = mainImg.first();
      await expect(img).toHaveAttribute('loading', 'lazy');
      await expect(img).toHaveAttribute('decoding', 'async');

      // Alt text should be the post title, not the list page title
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt).not.toBe('Demo Blog');
    }
  });

  test('secondary featured post thumbnails have correct alt text', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/`);

    // Secondary featured posts
    const secondaryCards = page.locator('.row.mb-2 .col-md-6');
    const cardCount = await secondaryCards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = secondaryCards.nth(i);
      const img = card.locator('picture img, img.secondary-featured-img').first();
      const imgExists = (await img.count()) > 0;

      if (imgExists) {
        // Alt text should be the individual post title, not the list page title
        const alt = await img.getAttribute('alt');
        const postTitle = await card.locator('h3').textContent();
        expect(alt).toBe(postTitle?.trim());
      }
    }
  });
});
