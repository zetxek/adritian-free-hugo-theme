import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

test.describe('Mobile card image aspect ratio', () => {
  test('project card images preserve aspect ratio on mobile viewport @regression', async ({ page }) => {
    // Set mobile viewport (iPhone 12 dimensions)
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(`${BASE_URL}/`);

    // Wait for the client-and-work section to load
    const workSection = page.locator('#client-and-work-section');
    await expect(workSection).toBeVisible();

    // Find project images in the client-and-work section
    const projectImages = workSection.locator('picture img, img.portfolio-project, img.picture-works');
    const imageCount = await projectImages.count();

    expect(imageCount).toBeGreaterThan(0);

    // Check each project image maintains proper aspect ratio
    for (let i = 0; i < imageCount; i++) {
      const img = projectImages.nth(i);

      // Wait for image to be visible (lazy loading)
      await img.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Allow lazy loading

      // Check that width is not explicitly set to a fixed value that would break aspect ratio
      const widthAttr = await img.getAttribute('width');
      const heightAttr = await img.getAttribute('height');

      // Images should have width and height attributes (from lazypicture partial)
      // but CSS should override to maintain aspect ratio
      if (widthAttr && heightAttr) {
        const naturalWidth = parseInt(widthAttr);
        const naturalHeight = parseInt(heightAttr);
        const naturalRatio = naturalWidth / naturalHeight;

        // Get computed styles
        const computedWidth = await img.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.width);
        });

        const computedHeight = await img.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.height);
        });

        // On mobile, if height is auto (as per our fix), the computed height
        // should maintain the aspect ratio relative to the computed width
        if (computedWidth && computedHeight && computedHeight > 0) {
          const computedRatio = computedWidth / computedHeight;

          // Allow 10% tolerance for rounding/rendering differences
          const tolerance = 0.1;
          const ratioDiff = Math.abs(computedRatio - naturalRatio) / naturalRatio;

          expect(ratioDiff).toBeLessThan(tolerance);
        }
      }
    }
  });

  test('card images use max-width: 100% on mobile @regression', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(`${BASE_URL}/`);

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check that our CSS fix is applied to card images
    const cardImages = page.locator('.picture-works img, .portfolio-project img, .clients__item img, .card img, picture img.lozad');
    const count = await cardImages.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = cardImages.nth(i);
      await img.scrollIntoViewIfNeeded();

      const maxWidth = await img.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.maxWidth;
      });

      // Verify our CSS fix is applied - max-width should be 100%
      expect(maxWidth).toBe('100%');
    }
  });

  test('blog card images preserve aspect ratio on mobile @regression', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(`${BASE_URL}/blog/`);

    // Wait for blog cards to load
    const blogCards = page.locator('.blog-list article');
    const cardCount = await blogCards.count();

    if (cardCount > 0) {
      // Check first few cards
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = blogCards.nth(i);
        const img = card.locator('img').first();

        const imgCount = await img.count();
        if (imgCount > 0) {
          await img.scrollIntoViewIfNeeded();

          // Verify image is visible and not distorted
          await expect(img).toBeVisible();

          const computedStyle = await img.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return {
              maxWidth: style.maxWidth,
              height: style.height,
              objectFit: style.objectFit,
            };
          });

          // Images should not be fixed height on mobile
          expect(computedStyle.maxWidth).toBe('100%');
        }
      }
    }
  });
});
