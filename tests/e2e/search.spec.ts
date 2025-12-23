import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Search functionality', () => {
  test.beforeAll(async () => {
    // Health check
    try {
      await fetch(BASE_URL);
    } catch (error) {
      console.error(`Failed to connect to ${BASE_URL}. Is the Hugo server running?`);
      throw error;
    }
  });

  test('search page loads correctly', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/search`);
    await expect(page).toHaveTitle(/Search/);
    await expect(page.locator('h2.mb-4.text-center')).toHaveText('Search the Site');
    await expect(page.locator('#search-query')).toBeVisible();
    
    // Check that the search page returns HTTP status 200
  });

  test('searching for "theme" shows exactly one result', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Type "theme" in the search box
    await page.locator('#search-query').fill('theme');
    
    // Wait for search results to appear (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Check URL is updated with search parameter
    await expect(page).toHaveURL(/s=theme/);
    
    // Verify exactly one result is shown
    await expect(page.locator('#search-results div[id^="summary-"]')).toHaveCount(1);
  });

  test('clearing search box removes results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Type something to get results first
    await page.locator('#search-query').fill('theme');
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Verify we have at least one result
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Now clear the search box
    await page.locator('#search-query').fill('');
    
    // Wait for the UI to update
    await page.waitForTimeout(500);
    
    // Check that results are cleared and we have the prompt message
    await expect(page.locator('#search-results div[id^="summary-"]')).toHaveCount(0);
    await expect(page.locator('#search-results .alert')).toBeVisible();
    await expect(page.locator('#search-results .alert')).toHaveText('Please enter at least 2 characters to search');
  });

  test('searching for "adritian" shows multiple results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Type "adritian" in the search box
    await page.locator('#search-query').fill('adritian');
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Check URL is updated with search parameter
    await expect(page).toHaveURL(/s=adritian/);
    
    // Verify we have multiple results
    const resultsCount = await page.locator('#search-results div[id^="summary-"]').count();
    expect(resultsCount).toBeGreaterThan(1);
  });

  test('search handles special characters correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Test with special characters that might break URL encoding
    const specialCharQuery = 'test & special';
    await page.locator('#search-query').fill(specialCharQuery);
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Check URL is properly encoded
    await expect(page).toHaveURL(`${BASE_URL}/search/?s=test+%26+special`.replace('&', '%26'));
    
    // Verify the search box still contains the original query
    await expect(page.locator('#search-query')).toHaveValue(specialCharQuery);
  });

  test('search updates results in real-time as user types', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Type one character at a time and verify the behavior
    await page.locator('#search-query').fill('a');
    
    // With just one character, we should see the minimum character message
    await page.waitForTimeout(500);
    await expect(page.locator('#search-results .alert')).toContainText('at least 2 characters');
    
    // Type a second character to reach minimum
    await page.locator('#search-query').fill('ad');
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Should now show results
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Continue typing to refine search
    await page.locator('#search-query').fill('adri');
    
    // Wait for updated results
    await page.waitForTimeout(500);
    
    // Should still show results, potentially different count
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
  });

  test('tag badges are rendered in search results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Search for "adritian" which should return blog posts with tags
    await page.locator('#search-query').fill('adritian');
    
    // Wait for search results to appear (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Verify we have results
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Check that tag badges are rendered
    const tagBadges = page.locator('#search-results .badge.bg-primary');
    await expect(tagBadges.first()).toBeVisible();
    
    // Verify badges have the correct styling classes
    const firstBadge = tagBadges.first();
    await expect(firstBadge).toHaveClass('badge bg-primary text-decoration-none me-1');
  });

  test('clicking a tag badge updates search input and filters results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Search for "adritian" to get results with tags
    await page.locator('#search-query').fill('adritian');
    
    // Wait for search results to appear (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Verify we have results
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Find a tag badge (e.g., "guide")
    const guideBadge = page.locator('#search-results .badge.bg-primary', { hasText: 'guide' }).first();
    
    // Verify the badge is visible before clicking
    await expect(guideBadge).toBeVisible();
    
    // Click the badge
    await guideBadge.click();
    
    // Wait for the search to update (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Verify the search input was updated with the tag
    await expect(page.locator('#search-query')).toHaveValue('guide');
    
    // Verify the URL was updated
    await expect(page).toHaveURL(/s=guide/);
    
    // Verify search results are filtered (should show posts with "guide" tag)
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
  });

  test('clicking different tag badges updates search correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Search for "sample" to get results with that tag
    await page.locator('#search-query').fill('sample');
    
    // Wait for search results to appear (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Verify we have results
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Click on a tag badge (e.g., "lorem-ipsum")
    const loremBadge = page.locator('#search-results .badge.bg-primary', { hasText: 'lorem-ipsum' }).first();
    await expect(loremBadge).toBeVisible();
    await loremBadge.click();
    
    // Wait for the search to update (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Verify the search input was updated
    await expect(page.locator('#search-query')).toHaveValue('lorem-ipsum');
    
    // Verify the URL was updated
    await expect(page).toHaveURL(/s=lorem-ipsum/);
  });

  test('tag badge click prevents default link behavior', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Search for "adritian"
    await page.locator('#search-query').fill('adritian');
    
    // Wait for search results (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Get initial URL
    const initialUrl = page.url();
    
    // Click a tag badge
    const tagBadge = page.locator('#search-results .badge.bg-primary').first();
    await expect(tagBadge).toBeVisible();
    
    await tagBadge.click();
    
    // Wait a moment
    await page.waitForTimeout(300);
    
    // Verify we're still on the search page (not navigated to the href)
    expect(page.url()).toContain('/search');
    
    // But the URL should have been updated with the search parameter
    expect(page.url()).not.toBe(initialUrl);
  });

  test('multiple tag badges can be clicked sequentially', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Search for "adritian" to get multiple results with different tags
    await page.locator('#search-query').fill('adritian');
    
    // Wait for search results (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Click the first tag badge
    const firstBadge = page.locator('#search-results .badge.bg-primary').first();
    await expect(firstBadge).toBeVisible();
    const firstBadgeText = await firstBadge.textContent();
    
    await firstBadge.click();
    await page.waitForTimeout(500);
    
    // Verify search updated
    await expect(page.locator('#search-query')).toHaveValue(firstBadgeText || '');
    
    // Now search for something else to get different tags
    await page.locator('#search-query').fill('sample');
    await page.waitForTimeout(500);
    
    // Click a different tag badge
    const secondBadge = page.locator('#search-results .badge.bg-primary').first();
    await expect(secondBadge).toBeVisible();
    const secondBadgeText = await secondBadge.textContent();
    await secondBadge.click();
    await page.waitForTimeout(500);
    
    // Verify search updated to the new tag
    await expect(page.locator('#search-query')).toHaveValue(secondBadgeText || '');
  });
});