import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Series taxonomy', () => {
  test('series list renders series cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/series`);

    await expect(page.getByRole('heading', { name: 'Series', level: 1 })).toBeVisible();

    const seriesCards = page.locator('.series-card');
    await expect(seriesCards.first()).toBeVisible();
  });

  test('series page shows description and ordered posts', async ({ page }) => {
    await page.goto(`${BASE_URL}/series/hugo-basics/`);

    await expect(page.getByRole('heading', { name: 'Hugo Basics', level: 1 })).toBeVisible();
    await expect(page.locator('.series-description')).toContainText('getting started with Hugo');

    const postLinks = page.locator('ul.posts-list-simple li.post a');
    await expect(postLinks.first()).toHaveText('Hugo Basics Part 1');
    await expect(postLinks.nth(1)).toHaveText('Hugo Basics Part 2');

    const firstBadge = page.locator('ul.posts-list-simple li.post').first().locator('.series-order');
    await expect(firstBadge).toContainText('Part 1');
  });
});
