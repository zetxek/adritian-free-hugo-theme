import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Author taxonomy', () => {
  test('authors list renders author cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/authors`);

    await expect(page.getByRole('heading', { name: 'Authors', level: 1 })).toBeVisible();

    const authorCards = page.locator('.author-card');
    await expect(authorCards.first()).toBeVisible();
  });

  test('author card navigates to author page with bio and stats', async ({ page }) => {
    await page.goto(`${BASE_URL}/authors`);

    const authorCard = page.locator('.author-card').first();
    await expect(authorCard).toBeVisible();

    const authorLink = authorCard.locator('a').first();
    await expect(authorLink).toBeVisible();
    await expect(authorLink).toContainText(/Moreno/);

    await authorLink.click();

    await expect(page).toHaveURL(/\/authors\/.+/);
    await expect(page.getByRole('heading', { name: /Moreno/, level: 1 })).toBeVisible();

    const authorBio = page.locator('.author-bio');
    await expect(authorBio).toBeVisible();

    const authorStats = page.locator('.author-stats');
    await expect(authorStats).toBeVisible();
    await expect(authorStats).toContainText(/post/i);

    const posts = page.locator('ul.posts-list-simple li.post');
    await expect(posts.first()).toBeVisible();
  });

  test('author page uses author display name in breadcrumb', async ({ page }) => {
    await page.goto(`${BASE_URL}/authors/adrian-moreno-pena/`);

    const activeCrumb = page.locator('.breadcrumbs .breadcrumb-item.active');
    await expect(activeCrumb).toHaveText(/Moreno/);
  });

  test('author tags widget shows popular tags and links to tags list', async ({ page }) => {
    await page.goto(`${BASE_URL}/authors/adrian-moreno-pena/`);

    const widget = page.locator('.widget-popular-tags');
    await expect(widget).toBeVisible();
    await expect(widget.locator('h3.card-title')).toHaveText('Popular Tags');

    const viewAllButton = widget.locator('a.btn-outline-secondary', { hasText: 'View all tags' });
    await expect(viewAllButton).toBeVisible();

    await viewAllButton.click();
    await expect(page).toHaveURL(/\/tags\/?$/);
    await expect(page.getByRole('heading', { name: 'Tags', level: 1 })).toBeVisible();
  });
});
