import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

test.describe('Showcase page', () => {
  test('renders showcase cards from data file', async ({ page }) => {
    await page.goto(`${BASE_URL}/showcase/`);

    // Page title is present
    await expect(page.locator('h1')).toBeVisible();

    // Cards are rendered
    const cards = page.locator('.showcase-item');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('has skip-to-content target', async ({ page }) => {
    await page.goto(`${BASE_URL}/showcase/`);
    const main = page.locator('#main-content');
    await expect(main).toBeAttached();
  });

  test('tag filter buttons toggle card visibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/showcase/`);

    const allItems = page.locator('.showcase-item');
    const totalCount = await allItems.count();
    expect(totalCount).toBeGreaterThan(0);

    // Click a non-"All" filter button
    const filterButtons = page.locator('#showcase-filters button');
    const secondFilter = filterButtons.nth(1);
    const filterTag = await secondFilter.getAttribute('data-filter');
    await secondFilter.click();

    // The clicked button should be active with aria-pressed
    await expect(secondFilter).toHaveAttribute('aria-pressed', 'true');

    // Some items should be hidden (unless all have this tag)
    const visibleItems = page.locator('.showcase-item:visible');
    const visibleCount = await visibleItems.count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThanOrEqual(totalCount);

    // Visible items should have the selected tag
    for (let i = 0; i < visibleCount; i++) {
      const tags = await visibleItems.nth(i).getAttribute('data-tags');
      expect(tags!.split(' ')).toContain(filterTag);
    }

    // Click "All" to restore
    const allButton = filterButtons.first();
    await allButton.click();
    await expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(await page.locator('.showcase-item:visible').count()).toBe(totalCount);
  });

  test('submit CTA links to GitHub issue template', async ({ page }) => {
    await page.goto(`${BASE_URL}/showcase/`);
    const submitLink = page.locator('a.btn-primary', { hasText: 'Submit your site' });
    await expect(submitLink).toBeVisible();
    const href = await submitLink.getAttribute('href');
    expect(href).toContain('github.com/zetxek/adritian-free-hugo-theme/issues/new');
    expect(href).toContain('showcase-submission');
  });
});
