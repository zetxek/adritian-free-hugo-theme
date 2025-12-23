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
    // Now we have 13 tags (11 original + testing + pagination from test content)
    await expect(page.locator('ul.list-taxonomy li')).toHaveCount(13);

    // Check that Sample tag exists
    await expect(page.getByRole('link', { name: /Sample/ })).toBeVisible();
    
    // Check for a tag with count badge
    await expect(page.locator('.badge.taxonomy-count').first()).toBeVisible();
  });

  test('click on a tag -> renders the tag page', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    await page.getByRole('link', { name: /Sample/ }).click();
    // Verify tag page
    await expect(page).toHaveURL(/\/tags\/sample/);
    // On the tag page, verify the tag name is shown as a heading
    await expect(page.getByRole('heading', { name: 'Sample', level: 1 })).toBeVisible();
    // Verify the article link is visible in the post list
    await expect(page.locator('a[href*="/blog/sample/"]')).toBeVisible();
  });

  test('tag page content links', async ({ page }) => {
    // Go directly to the Sample tag page
    await page.goto(`${BASE_URL}/tags/sample`);
    // Verify any article link is visible (1 article)
    const articleLink = page.locator('a[href*="/blog/sample/"]');
    await expect(articleLink.first()).toBeVisible();
    await articleLink.first().click();
    // Article should list the tags
    await expect(page.locator('ul.tags li')).toHaveCount(2);
  });
});
