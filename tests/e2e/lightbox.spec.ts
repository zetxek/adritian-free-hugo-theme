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

    // Tab to the image to focus it
    await img.press('Enter');

    const overlay = page.locator('.lightbox-overlay.lightbox-active');
    await expect(overlay).toBeVisible();
  });
});
