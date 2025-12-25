import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Blog page content', () => {
  test('should show "Demo Blog" heading and "Welcome to the demo blog" text', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    
    // Verify heading is displayed
    await expect(page.getByRole('heading', { name: /demo blog/i })).toBeVisible();
    
    // Verify body text is displayed
    await expect(page.getByText('Welcome to the demo blog')).toBeVisible();
  });

  test('should navigate to the sample blog article by clicking on the post link', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const firstPostLink = page.locator('.posts-list .post-title a').first();
    await expect(firstPostLink).toBeVisible();

    const href = await firstPostLink.getAttribute('href');
    expect(href, 'Expected blog list to contain a post link').toBeTruthy();

    const linkText = (await firstPostLink.textContent())?.trim();
    await firstPostLink.click();

    const expectedUrl = new URL(href!, BASE_URL).toString();
    await expect(page).toHaveURL(expectedUrl);

    if (linkText) {
      await expect(page.getByRole('heading', { level: 1 })).toContainText(linkText);
    } else {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
});
