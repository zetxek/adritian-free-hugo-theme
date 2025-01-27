import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1313';

test.describe('List style functionality', () => {
  test('summary style shows full post previews', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags/sample`);
    
    // Check for summary style elements
    const articleSummary = page.locator('article.post.summary');
    await expect(articleSummary).toBeVisible();
    
    // Verify summary components are present
    await expect(page.locator('article.post.summary h2').first()).toBeVisible();
    await expect(page.locator('article.post.summary .post-meta').first()).toBeVisible();
    await expect(page.locator('article.post.summary .post-summary').first()).toBeVisible();
    await expect(page.locator('article.post.summary .btn-outline-secondary').first()).toBeVisible();
    
    // Verify tags are displayed
    await expect(page.locator('ul.tags li')).toHaveCount(2);
  });

}); 