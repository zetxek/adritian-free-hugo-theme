import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

test.describe('Projects section', () => {
  test('lists projects as cards that link to their pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/projects/`);

    await expect(page.locator('h1')).toHaveText('Projects');
    const cards = page.locator('.project-card');
    await expect(cards).toHaveCount(3);

    await cards.getByRole('link', { name: 'Robo Advisor' }).click();
    await expect(page).toHaveURL(/\/projects\/robo-advisor\/?$/);
  });

  test('project page shows the website link and the portfolio button', async ({ page }) => {
    await page.goto(`${BASE_URL}/projects/robo-advisor/`);

    await expect(page.locator('h1')).toHaveText('Robo Advisor');
    const links = page.locator('.project-links');
    await expect(links.getByRole('link', { name: 'Visit website' })).toHaveAttribute('href', 'https://www.adrianmoreno.info');
    await expect(links.getByRole('link', { name: 'Case Study' })).toBeVisible();
  });
});
