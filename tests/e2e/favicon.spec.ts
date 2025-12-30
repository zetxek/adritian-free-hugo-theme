import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

console.log(`Running tests against ${BASE_URL}`);

test('favicon and manifest links are present', async ({ page }) => {
  await page.goto(BASE_URL);

  const faviconIco = page.locator('head link[rel="icon"][href$="favicon.ico"]');
  await expect(faviconIco).toHaveCount(1);

  const icon16 = page.locator('head link[rel="icon"][sizes="16x16"]');
  await expect(icon16).toHaveAttribute('href', /icon-16\.png$/);

  const icon32 = page.locator('head link[rel="icon"][sizes="32x32"]');
  await expect(icon32).toHaveAttribute('href', /icon-32\.png$/);

  const appleTouch = page.locator('head link[rel="apple-touch-icon"][sizes="180x180"]');
  await expect(appleTouch).toHaveAttribute('href', /apple-touch-icon\.png$/);

  const manifest = page.locator('head link[rel="manifest"]');
  await expect(manifest).toHaveAttribute('href', /site\.webmanifest$/);
});
