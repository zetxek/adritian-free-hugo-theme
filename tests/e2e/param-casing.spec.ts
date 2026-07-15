import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// Regression coverage for issue #570: Site.Params in this theme are
// overwhelmingly camelCase, but logo_text1, logo_text2, and
// blog.featured_sort_by_weight broke that convention. Added camelCase
// aliases (logoText1, logoText2, blog.featuredSortByWeight) as the primary
// names, falling back to the old snake_case names — exampleSite/hugo.toml
// was updated to use the new names as the canonical example.
test.describe('camelCase param names (logoText1/logoText2/featuredSortByWeight)', () => {
  test('header logo renders from logoText1/logoText2', async ({ page }) => {
    await page.goto(BASE_URL);
    const navbarBrand = page.locator('a.navbar-brand');
    await expect(navbarBrand.locator('span').first()).toHaveText('Adritian');
    await expect(navbarBrand.locator('span').nth(1)).toHaveText('Theme');
  });

  test('blog list builds and renders a featured post using featuredSortByWeight', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/blog/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('.featured-post-container')).toBeVisible();
  });
});
