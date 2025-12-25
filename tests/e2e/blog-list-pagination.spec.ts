import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1313';

test.describe('Blog list pagination', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the blog list page
    await page.goto(`${BASE_URL}/blog`);
  });

  test('should display pagination controls when there are enough blog posts', async ({ page }) => {
    // Verify pagination list exists
    const paginationList = page.locator('ul.pagination');
    await expect(paginationList).toBeVisible();
    
    // Verify pagination has page items
    const pageItems = paginationList.locator('li.page-item');
    await expect(pageItems.first()).toBeVisible();
  });

  test('should show current page as active on first page', async ({ page }) => {
    // On the first page, page 1 should be active
    const activePage = page.locator('li.page-item.active a.page-link');
    await expect(activePage).toBeVisible();
    await expect(activePage).toHaveText('1');
  });

  test('should display featured posts only on the first page', async ({ page }) => {
    // Featured posts should be visible on page 1
    const featuredPostContainer = page.locator('.featured-post-container');
    await expect(featuredPostContainer).toBeVisible();
    
    // Check for main featured post
    const mainFeaturedPost = featuredPostContainer.locator('.p-4.p-md-5.mb-4.rounded');
    const mainFeaturedCount = await mainFeaturedPost.count();
    expect(mainFeaturedCount).toBeGreaterThan(0);
    
    // Navigate to page 2
    await page.goto(`${BASE_URL}/blog/page/2`);
    
    // Featured posts should NOT be visible on page 2
    const featuredPostContainerPage2 = page.locator('.featured-post-container');
    await expect(featuredPostContainerPage2).not.toBeVisible();
  });

  test('should display secondary featured posts only on first page', async ({ page }) => {
    // Check for secondary featured posts (2nd and 3rd featured)
    const secondaryFeatured = page.locator('.row.mb-2 .col-md-6');
    const secondaryCount = await secondaryFeatured.count();
    
    // Should have 0, 1, or 2 secondary featured posts
    expect(secondaryCount).toBeLessThanOrEqual(2);
    
    // Navigate to page 2
    await page.goto(`${BASE_URL}/blog/page/2`);
    
    // Secondary featured posts should NOT be visible on page 2
    const secondaryFeaturedPage2 = page.locator('.row.mb-2 .col-md-6');
    const secondaryCountPage2 = await secondaryFeaturedPage2.count();
    expect(secondaryCountPage2).toBe(0);
  });

  test('should navigate to next page when next button is clicked', async ({ page }) => {
    // Find and click the next button
    const nextButton = page.locator('a.page-link[aria-label="Next"]');
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    // Verify URL changed to page 2
    await expect(page).toHaveURL(/\/blog\/page\/2\/?$/);
    
    // Verify page 2 is now active
    const activePage = page.locator('li.page-item.active a.page-link');
    await expect(activePage).toHaveText('2');
  });

  test('should navigate to previous page when previous button is clicked', async ({ page }) => {
    // First go to page 2
    await page.goto(`${BASE_URL}/blog/page/2`);
    
    // Find and click the previous button
    const prevButton = page.locator('a.page-link[aria-label="Previous"]');
    await expect(prevButton).toBeVisible();
    await prevButton.click();
    
    // Verify we're back on page 1
    await expect(page).toHaveURL(/\/blog\/?$/);
    
    // Verify page 1 is now active
    const activePage = page.locator('li.page-item.active a.page-link');
    await expect(activePage).toHaveText('1');
  });

  test('should disable previous button on first page', async ({ page }) => {
    // On first page, previous button should be disabled
    const prevButton = page.locator('li.page-item.disabled a.page-link[aria-label="Previous"]');
    await expect(prevButton).toBeVisible();
    await expect(prevButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('should disable next button on last page', async ({ page }) => {
    // Navigate to the last page
    // With 17 total posts, 3 featured (not paginated), 14 non-featured, and pagerSize=3
    // We should have ceil(14/3) = 5 pages
    await page.goto(`${BASE_URL}/blog/page/5`);
    
    // Next button should be disabled
    const nextButton = page.locator('li.page-item.disabled a.page-link[aria-label="Next"]');
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('should display correct number of non-featured posts per page', async ({ page }) => {
    // With pagerSize=3, each page should have up to 3 non-featured posts
    const posts = page.locator('.posts-list .row--padded');
    const postCount = await posts.count();
    
    // Should have up to 3 posts (based on pagerSize setting)
    expect(postCount).toBeLessThanOrEqual(3);
    expect(postCount).toBeGreaterThan(0);
  });

  test('should properly distribute non-featured posts across pages', async ({ page }) => {
    // Verify first page has non-featured posts
    const postsPage1 = page.locator('.posts-list .row--padded');
    const postCountPage1 = await postsPage1.count();
    expect(postCountPage1).toBeGreaterThan(0);
    
    // Navigate to page 2 and verify it also has non-featured posts
    await page.goto(`${BASE_URL}/blog/page/2`);
    const postsPage2 = page.locator('.posts-list .row--padded');
    const postCountPage2 = await postsPage2.count();
    expect(postCountPage2).toBeGreaterThan(0);
  });

  test('should navigate directly to a specific page by clicking page number', async ({ page }) => {
    // Click on page 2 link
    await page.locator('a.page-link', { hasText: /^2$/ }).click();
    
    // Verify we're on page 2
    await expect(page).toHaveURL(/\/blog\/page\/2\/?$/);
    
    // Verify page 2 is active
    const activePage = page.locator('li.page-item.active a.page-link');
    await expect(activePage).toHaveText('2');
  });

  test('should show all pages in window range', async ({ page }) => {
    // Window is 2, so on page 1 we should see nearby pages
    const pageLinks = page.locator('li.page-item:not(.disabled) a.page-link');
    
    // Get all page numbers (excluding prev/next arrows)
    const pageNumbers = await pageLinks.allTextContents();
    const numericPages = pageNumbers.filter(text => /^\d+$/.test(text));
    
    // Should show page 1
    expect(numericPages).toContain('1');
    
    // Should show at least 2 pages
    expect(numericPages.length).toBeGreaterThanOrEqual(2);
  });

  test('should maintain pagination when navigating between pages', async ({ page }) => {
    // Navigate through pages and verify pagination controls stay consistent
    
    // Start on page 1
    await expect(page.locator('li.page-item.active a.page-link')).toHaveText('1');
    
    // Go to page 2
    await page.locator('a.page-link', { hasText: /^2$/ }).click();
    await expect(page.locator('li.page-item.active a.page-link')).toHaveText('2');
    
    // Go to page 3
    await page.locator('a.page-link', { hasText: /^3$/ }).click();
    await expect(page.locator('li.page-item.active a.page-link')).toHaveText('3');
    
    // Go back to page 1
    await page.locator('a.page-link', { hasText: /^1$/ }).click();
    await expect(page.locator('li.page-item.active a.page-link')).toHaveText('1');
  });

  test('should have accessible pagination controls', async ({ page }) => {
    // Verify pagination exists
    const pagination = page.locator('ul.pagination');
    await expect(pagination).toBeVisible();
    
    // Check that page links are keyboard accessible
    // Use page 2 link since page 1 is the current page and not focusable
    const secondPageLink = page.locator('a.page-link[aria-label="Page 2"]');
    await secondPageLink.focus();
    await expect(secondPageLink).toBeFocused();
  });

  test('should exclude featured posts from pagination count', async ({ page }) => {
    // Featured posts should only appear on page 1
    // Non-featured posts should be paginated
    
    // On page 1, we should see featured posts AND paginated non-featured posts
    const featuredContainer = page.locator('.featured-post-container');
    await expect(featuredContainer).toBeVisible();
    
    const nonFeaturedPosts = page.locator('.posts-list .row--padded');
    const nonFeaturedCount = await nonFeaturedPosts.count();
    expect(nonFeaturedCount).toBeGreaterThan(0);
    
    // On page 2, we should only see non-featured posts
    await page.goto(`${BASE_URL}/blog/page/2`);
    const featuredContainerPage2 = page.locator('.featured-post-container');
    await expect(featuredContainerPage2).not.toBeVisible();
    
    const nonFeaturedPostsPage2 = page.locator('.posts-list .row--padded');
    const nonFeaturedCountPage2 = await nonFeaturedPostsPage2.count();
    expect(nonFeaturedCountPage2).toBeGreaterThan(0);
  });
});

test.describe('Blog list pagination - edge cases', () => {
  test('should handle direct navigation to page 2', async ({ page }) => {
    // Navigate directly to page 2
    await page.goto(`${BASE_URL}/blog/page/2`);
    
    // Should load successfully
    await expect(page.locator('h1')).toBeVisible();
    
    // Should show pagination
    const pagination = page.locator('ul.pagination');
    await expect(pagination).toBeVisible();
    
    // Page 2 should be active
    const activePage = page.locator('li.page-item.active a.page-link');
    await expect(activePage).toHaveText('2');
    
    // Featured posts should NOT be visible
    const featuredContainer = page.locator('.featured-post-container');
    await expect(featuredContainer).not.toBeVisible();
  });

  test('should handle direct navigation to last page', async ({ page }) => {
    // Navigate directly to the last page (page 5)
    await page.goto(`${BASE_URL}/blog/page/5`);
    
    // Should load successfully
    await expect(page.locator('h1')).toBeVisible();
    
    // Should show posts
    const posts = page.locator('.posts-list .row--padded');
    const postCount = await posts.count();
    expect(postCount).toBeGreaterThan(0);
    
    // Next button should be disabled
    const nextButton = page.locator('li.page-item.disabled a.page-link[aria-label="Next"]');
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('should handle direct navigation to non-existent page gracefully', async ({ page }) => {
    // Try to navigate to page 999 which doesn't exist
    const response = await page.goto(`${BASE_URL}/blog/page/999`);
    
    // Should return 404 or redirect to valid page
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
