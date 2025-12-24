import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Hugo sections functionality', () => {
  test('articles section loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/articles/`);
    
    // Check that section page loads
    await expect(page.locator('h1')).toContainText('Articles');
    
    // Verify section content is displayed
    await expect(page.getByText('Welcome to the articles section')).toBeVisible();
    
    // Check that article posts are listed
    const articleCount = await page.locator('article.post').count();
    expect(articleCount).toBeGreaterThan(0);
  });

  test('individual article pages load correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/articles/first-article/`);
    
    // Check that individual article loads
    await expect(page.locator('h1')).toContainText('First Article');
    await expect(page.getByText('This is the first article content')).toBeVisible();
  });

  test('news section loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/news/`);
    
    // Check that section page loads
    await expect(page.locator('h1')).toContainText('News');
    // Verify section content is displayed
    await expect(page.getByText('Latest news updates').first()).toBeVisible();

    // Check that news posts are listed
    const newsCount = await page.locator('article.post').count();
    expect(newsCount).toBeGreaterThan(0);
  });

  test('individual news pages load correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/news/breaking-news/`);
    
    // Check that individual news item loads
    await expect(page.locator('h1')).toContainText('Breaking News');
    await expect(page.getByText('This is breaking news content')).toBeVisible();
  });


  test('section pagination works if applicable', async ({ page }) => {
    await page.goto(`${BASE_URL}/articles/`);
    
    // Check if pagination exists and works
    const paginationExists = await page.locator('.pagination').count() > 0;
    
    if (paginationExists) {
      // Test pagination if it exists
      await expect(page.locator('.pagination')).toBeVisible();
      
      // Check if there's a next page link and it works
      const nextLink = page.locator('.pagination a[rel="next"]');
      if (await nextLink.count() > 0) {
        await nextLink.click();
        await expect(page.locator('h1')).toContainText('Articles');
      }
    }
  });

  test('section RSS feeds are accessible', async ({ page }) => {
    // Test articles RSS feed
    const articlesRssResponse = await page.request.get(`${BASE_URL}/articles/index.xml`);
    expect(articlesRssResponse.status()).toBe(200);
    
    // Test news RSS feed
    const newsRssResponse = await page.request.get(`${BASE_URL}/news/index.xml`);
    expect(newsRssResponse.status()).toBe(200);
  });

  test('existing blog section still works', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/`);
    
    // Verify existing blog section still works
    await expect(page.locator('h1').first()).toContainText('Demo Blog');
    await expect(page.getByText('Welcome to the demo blog')).toBeVisible();
  });
});
