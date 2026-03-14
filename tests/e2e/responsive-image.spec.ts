import { test, expect } from '@playwright/test';

test('responsive image renders <picture> with srcset in blog post', async ({ page }) => {
  await page.goto('/blog/getting-started/');

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

  // Original format source
  const origSource = picture.locator('source[type="image/png"]');
  await expect(origSource).toHaveCount(1);

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

  // Scroll the image into view and screenshot
  await img.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/responsive-image-demo.png' });
});
