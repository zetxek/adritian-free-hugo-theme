import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// Regression coverage for enableRobotsTXT being unset (issue #562): Hugo
// silently skips a custom robots.txt template unless enableRobotsTXT=true
// is set in site config, so layouts/robots.txt previously never rendered.
test.describe('robots.txt', () => {
  test('is accessible and returns a 200', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`);
    expect(response?.status()).toBe(200);
  });

  test('is served as plain text', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/text\/plain/i);
  });

  test('declares a User-agent directive', async ({ page }) => {
    await page.goto(`${BASE_URL}/robots.txt`);
    const body = await page.locator('body').innerText();
    expect(body).toContain('User-agent: *');
  });

  test('references the sitemap at the site root', async ({ page }) => {
    await page.goto(`${BASE_URL}/robots.txt`);
    const body = await page.locator('body').innerText();
    expect(body).toContain(`Sitemap: ${BASE_URL}/sitemap.xml`);
  });

  test('disallows crawling outside of production (hugo.IsProduction / site.Params.env unset in test env)', async ({ page }) => {
    await page.goto(`${BASE_URL}/robots.txt`);
    const body = await page.locator('body').innerText();
    expect(body).toContain('Disallow: /');
  });
});
