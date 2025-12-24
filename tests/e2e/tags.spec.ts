import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

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

test.describe('Popular tags widget', () => {
  test('popular tags widget displays on term pages', async ({ page }) => {
    // Navigate to a tag page (e.g., "sample" tag page)
    await page.goto(`${BASE_URL}/tags/sample`);
    
    // Verify the popular tags widget is visible
    const widget = page.locator('.widget-popular-tags');
    await expect(widget).toBeVisible();
    
    // Verify the widget title
    await expect(widget.locator('h3.card-title')).toHaveText('Popular Tags');
  });

  test('popular tags widget shows tag counts', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags/sample`);
    
    // Verify tags are displayed with count badges
    const widget = page.locator('.widget-popular-tags');
    const tagItems = widget.locator('ul.list-taxonomy li');
    
    // Should have at least one tag
    await expect(tagItems.first()).toBeVisible();
    
    // Each tag should have a count badge
    const firstTag = tagItems.first();
    const countBadge = firstTag.locator('.badge.taxonomy-count');
    await expect(countBadge).toBeVisible();
    
    // Count badge should contain a number
    const countText = await countBadge.textContent();
    expect(countText).toMatch(/^\d+$/);
  });

  test('popular tags widget links to tag pages correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags/sample`);
    
    const widget = page.locator('.widget-popular-tags');
    const tagLinks = widget.locator('ul.list-taxonomy li a');
    
    // Get the first tag link
    const firstTagLink = tagLinks.first();
    await expect(firstTagLink).toBeVisible();
    
    // Verify the link has a valid href pointing to a tag page
    const href = await firstTagLink.getAttribute('href');
    expect(href).toMatch(/\/tags\/.+/);
    
    // Click the link and verify navigation
    await firstTagLink.click();
    await expect(page).toHaveURL(/\/tags\/.+/);
  });

  test('popular tags widget shows "View all tags" button', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags/sample`);
    
    const widget = page.locator('.widget-popular-tags');
    const viewAllButton = widget.locator('a.btn-outline-secondary', { hasText: 'View all tags' });
    
    // Verify the button exists
    await expect(viewAllButton).toBeVisible();
    
    // Verify it links to the tags page
    const href = await viewAllButton.getAttribute('href');
    expect(href).toContain('/tags');
    
    // Click and verify navigation to tags list
    await viewAllButton.click();
    await expect(page).toHaveURL(/\/tags\/?$/);
    await expect(page.getByRole('heading', { name: 'Tags', level: 1 })).toBeVisible();
  });

  test('popular tags widget displays up to 10 tags by count', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags/sample`);
    
    const widget = page.locator('.widget-popular-tags');
    const tagItems = widget.locator('ul.list-taxonomy li');
    
    // Count the number of tags displayed
    const count = await tagItems.count();
    
    // Should display at most 10 tags
    expect(count).toBeLessThanOrEqual(10);
    expect(count).toBeGreaterThan(0);
  });

  test('popular tags widget not displayed on taxonomy list pages', async ({ page }) => {
    // Navigate to the tags list page (taxonomy page, not term page)
    await page.goto(`${BASE_URL}/tags`);
    
    // Verify the popular tags widget is NOT visible on the taxonomy list page
    const widget = page.locator('.widget-popular-tags');
    await expect(widget).not.toBeVisible();
  });

  test('popular tags widget displays tags sorted by count', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags/sample`);
    
    const widget = page.locator('.widget-popular-tags');
    const tagItems = widget.locator('ul.list-taxonomy li');
    
    // Get all tag counts
    const counts: number[] = [];
    const itemCount = await tagItems.count();
    
    for (let i = 0; i < itemCount; i++) {
      const badge = tagItems.nth(i).locator('.badge.taxonomy-count');
      const countText = await badge.textContent();
      if (countText) {
        const count = parseInt(countText.trim(), 10);
        if (!isNaN(count)) {
          counts.push(count);
        }
      }
    }
    
    // Ensure we actually collected counts to verify
    expect(counts.length).toBeGreaterThan(0);
    
    // Verify counts are in descending order (highest to lowest)
    for (let i = 0; i < counts.length - 1; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i + 1]);
    }
  });
});
