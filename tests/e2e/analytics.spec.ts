import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// exampleSite ships params.analytics.plausible.enabled = false, so no
// Plausible script tag should ever be emitted with default config.
test.describe('Plausible analytics', () => {
  test('is not present with exampleSite default config (disabled)', async ({ page }) => {
    await page.goto(BASE_URL);

    const plausibleScript = page.locator('script[data-domain]');
    await expect(plausibleScript).toHaveCount(0);

    const html = await page.content();
    expect(html).not.toContain('plausible.io/js/script.js');
  });
});
