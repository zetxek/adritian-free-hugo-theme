import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1313';

test.describe('Tag functionality', () => {
  test('visiting tags list', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    // Verify we reached the tags page
    await expect(page.getByRole('heading', { name: 'Tags', level: 1 })).toBeVisible();
  });

  test('verify there are 2 tags, each with 1 article', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    await expect(page.locator('ul.list-taxonomy li')).toHaveCount(2);

    // Each item shows how many articles
    // e.g. "Lorem-Ipsum (1)" or "Sample (1)"
    await expect(page.getByText('Sample (1)')).toBeVisible();
  });

  test('click on a tag -> renders the tag page', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    await page.getByRole('link', { name: /Sample/ }).click();
    // Verify tag page
    await expect(page).toHaveURL(/\/tags\/sample/);
    await expect(page.getByRole('heading', { name: 'Sample' })).toBeVisible();
  });

  test('tag page content links', async ({ page }) => {
    // Go directly to the Sample tag page
    await page.goto(`${BASE_URL}/tags/sample`);
    // Verify any article link is visible (1 article)
    const articleLink = page.locator('.post a[href*="/blog/sample/"]');
    await expect(articleLink).toBeVisible();
    await articleLink.click();
    // Article should list the tags
    await expect(page.locator('ul.tags li')).toHaveCount(2);
  });
});
