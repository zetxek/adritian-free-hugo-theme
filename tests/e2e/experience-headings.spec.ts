import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Experience heading hierarchy', () => {
  test('homepage has exactly one h1', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('experience list page has exactly one h1, which is the section title', async ({ page }) => {
    await page.goto(`${BASE_URL}/experience/`);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1.first()).toHaveText(/Experience/i);
  });

  test('experience list page entry titles are h2, not h1', async ({ page }) => {
    await page.goto(`${BASE_URL}/experience/`);

    await expect(page.locator('.experience__description h2')).toHaveCount(4);
    await expect(page.locator('.experience__description h1')).toHaveCount(0);
  });

  test('no page-level h1 is emitted from an experience block on the homepage', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('.section-experience h1')).toHaveCount(0);
  });

  test('no page-level h1 is emitted from an experience block on /cv/', async ({ page }) => {
    await page.goto(`${BASE_URL}/cv/`);

    await expect(page.locator('.section-experience h1')).toHaveCount(0);
  });

  test('on the experience list page, the only section h1 is the section title, not an entry title', async ({ page }) => {
    await page.goto(`${BASE_URL}/experience/`);

    await expect(page.locator('.section-experience h1')).toHaveCount(1);
    await expect(page.locator('.experience__description h1')).toHaveCount(0);
  });

  test('/cv/ has no h1 inside .experience__description', async ({ page }) => {
    await page.goto(`${BASE_URL}/cv/`);

    await expect(page.locator('.experience__description h1')).toHaveCount(0);
  });
});
