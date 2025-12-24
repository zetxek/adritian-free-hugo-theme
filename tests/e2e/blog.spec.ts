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
    await page.click('text=Sample content: formatting styles'); // Adjust text if needed
    await expect(page).toHaveURL(`${BASE_URL}/blog/sample/`);
    await expect(page.getByRole('heading', { name: /sample content/i })).toBeVisible();
  });
});

