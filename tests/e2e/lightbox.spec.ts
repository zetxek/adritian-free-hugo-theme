import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

// Blog post with a non-linked image in .post-content
const POST_WITH_IMAGE = `${BASE_URL}/blog/new-icons/`;

test.describe('Lightbox functionality', () => {
  test('lightbox opens when clicking a post image', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await expect(img).toBeVisible();

    await img.click();

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();

    const lightboxImg = page.locator('.lightbox-img');
    await expect(lightboxImg).toBeVisible();
  });

  test('lightbox closes on Escape key', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await img.click();

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(overlay).not.toBeVisible();
  });

  test('lightbox closes on overlay click', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await img.click();

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();

    // Click the overlay background (top-left corner, away from image)
    await page.locator('.lightbox-overlay').click({ position: { x: 10, y: 10 } });

    await expect(overlay).not.toBeVisible();
  });

  test('lightbox close button works', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await img.click();

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();

    await page.locator('.lightbox-close').click();

    await expect(overlay).not.toBeVisible();
  });

  test('images inside links do not get lightbox role', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Images inside <a> tags should not have role="button" from lightbox
    const linkedImages = page.locator('a img');
    const count = await linkedImages.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = linkedImages.nth(i);
        await expect(img).not.toHaveAttribute('role', 'button');
      }
    }
  });

  test('lightbox images have keyboard accessibility', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await expect(img).toBeVisible();

    await expect(img).toHaveAttribute('role', 'button');
    await expect(img).toHaveAttribute('tabindex', '0');
  });

  test('lightbox has correct ARIA attributes', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await img.click();

    const overlay = page.locator('.lightbox-overlay');
    await expect(overlay).toHaveAttribute('role', 'dialog');
    await expect(overlay).toHaveAttribute('aria-modal', 'true');
    await expect(overlay).toHaveAttribute('aria-label', 'Image viewer');
  });

  test('lightbox opens with Enter key on image', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();

    await img.press('Enter');

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();
  });

  test('lightbox opens with Space key on image', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();

    await img.press(' ');

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();
  });

  test('lightbox displays the correct image', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    // Use the resolved src (absolute URL) since the browser resolves relative paths
    const originalSrc = await img.evaluate((el: HTMLImageElement) => el.currentSrc || el.src);

    await img.click();

    const lightboxImg = page.locator('.lightbox-img');
    await expect(lightboxImg).toHaveAttribute('src', originalSrc);
  });

  test('focus returns to image after closing lightbox', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await img.click();

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(overlay).not.toBeVisible();

    // Focus should return to the image that opened the lightbox
    await expect(img).toBeFocused();
  });

  test('body scroll is locked while lightbox is open', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const img = page.locator('.post-content img').first();
    await img.click();

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');

    await page.keyboard.press('Escape');

    const overflowAfter = await page.evaluate(() => document.body.style.overflow);
    expect(overflowAfter).not.toBe('hidden');
  });

  test('lightbox script is loaded on the page', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    const script = page.locator('script[src*="lightbox.js"]');
    await expect(script).toHaveCount(1);
  });

  test('lightbox rejects unsafe javascript: URLs', async ({ page }) => {
    await page.goto(POST_WITH_IMAGE);

    // Open the lightbox normally first so the overlay is created
    const img = page.locator('.post-content img').first();
    await img.click();
    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(overlay).not.toBeVisible();

    // Try to open lightbox with a javascript: URL via the page context
    const opened = await page.evaluate(() => {
      const overlay = document.querySelector('.lightbox-overlay');
      const lightboxImg = overlay?.querySelector('.lightbox-img') as HTMLImageElement;
      const previousSrc = lightboxImg?.src || '';

      // Simulate calling open() with a javascript: URL by clicking an image
      // whose data-src has been tampered with
      const testImg = document.querySelector('.post-content img') as HTMLImageElement;
      testImg.removeAttribute('src');
      testImg.setAttribute('data-src', 'javascript:alert(1)');
      testImg.click();

      // Check if the lightbox opened (it should NOT)
      return overlay?.classList.contains('lightbox-active') || false;
    });

    expect(opened).toBe(false);
  });
});
