import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

console.log(`Running tests against ${BASE_URL}`);

test.describe('Accessibility polish', () => {
  test('main landmark and skip target exist on skills page', async ({ page }) => {
    await page.goto(`${BASE_URL}/skills/`);

    const mainLandmark = page.locator('main[role="main"]');
    await expect(mainLandmark).toBeVisible();

    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
    await expect(mainContent).toHaveAttribute('tabindex', '-1');
  });

  test('home page exposes a single skip target', async ({ page }) => {
    await page.goto(BASE_URL);

    const mainContent = page.locator('#main-content');
    await expect(mainContent).toHaveCount(1);
    await expect(mainContent).toBeVisible();
  });

  test('header and footer landmarks expose labels', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('header nav[aria-label]')).toBeVisible();
    await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();
    await expect(page.locator('footer nav[aria-label]')).toBeVisible();
  });

  test('dropdown toggles expose aria-controls and collapsed state', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(BASE_URL);

    const languageToggle = page.locator('#btn-select-language-header');
    await expect(languageToggle).toHaveAttribute('aria-controls', 'languages-dropdown-header');
    await expect(languageToggle).toHaveAttribute('aria-expanded', 'false');

    const themeToggle = page.locator('#bd-theme-header');
    await expect(themeToggle).toHaveAttribute('aria-controls', 'theme-dropdown-header');
    await expect(themeToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('blog single page uses article landmark labeled by title', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/new-features-demo/`);

    const article = page.locator('article#main-content');
    await expect(article).toHaveAttribute('aria-labelledby', 'blog-post-title');
    await expect(page.locator('#blog-post-title')).toBeVisible();
  });
});
