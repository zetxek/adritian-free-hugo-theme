import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('List style functionality', () => {
  test('summary style shows full post previews', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);

    // Check for summary style elements on the blog list
    const articleSummary = page.locator('article.post.summary');
    await expect(articleSummary.first()).toBeVisible();

    // Verify summary components are present
    await expect(articleSummary.first().locator('h2.post-title')).toBeVisible();
    await expect(articleSummary.first().locator('.post-meta')).toBeVisible();
    await expect(articleSummary.first().locator('.post-summary')).toBeVisible();
    await expect(articleSummary.first().locator('.btn-outline-secondary')).toBeVisible();
  });

}); 
