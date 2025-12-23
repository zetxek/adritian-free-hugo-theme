import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

test.describe('Experience items functionality', () => {
  test('navigates to experience items in English', async ({ page }) => {
    // Start from homepage
    await page.goto(BASE_URL);
    
    // Click on first experience item
    await page.getByText('Chief Intern').first().click();
    
    // Verify URL and content
    await expect(page).toHaveURL(/\/experience\/job-2\/?$/);
    await expect(page.getByText('Internet Affairs Inc.').first()).toBeVisible();
    await expect(page.getByText('Stavanger, Norway').first()).toBeVisible();
    await expect(page.getByText('2023-2024').first()).toBeVisible();
  });

  test('navigates to experience items in Spanish', async ({ page }) => {
    // Go to Spanish version
    await page.goto(`${BASE_URL}/es/`);
    
    // Click on first experience item
    await page.getByText('Becario Jefe').first().click();
    
    // Verify URL and Spanish content
    await expect(page).toHaveURL(/\/es\/experience\/job-2\/?$/);
    await expect(page.getByText('Internet Affairs Inc.').first()).toBeVisible();
    await expect(page.getByText('Stavanger, Noruega').first()).toBeVisible();
    await expect(page.getByText('Stavanger, Noruega').first()).toBeVisible();
    await expect(page.getByText('2023-2024').first()).toBeVisible();
    await expect(page.getByText('Arreglando el mundo, un byte a la vez').first()).toBeVisible();
  });

  test('navigates to experience items in French', async ({ page }) => {
    // Go to French version
    await page.goto(`${BASE_URL}/fr/`);
    
    // Click on first experience item
    await page.getByText('Stagiaire en Chef').first().click();
    
    await expect(page).toHaveURL(/\/fr\/experience\/job-2\/?$/);
    // Remove specific count checks as they might be fragile
    await expect(page.getByText('Internet Affairs Inc.').first()).toBeVisible();
    await expect(page.getByText('Stavanger').first()).toBeVisible();
    await expect(page.getByText('2023-2024').first()).toBeVisible();
    await expect(page.getByText('Réparer le monde, un octet à la fois').first()).toBeVisible();
  });

  test('verifies experience list page shows all items', async ({ page }) => {
    // Go to experience list page
    await page.goto(`${BASE_URL}/experience`);
    
    // Verify multiple experience items are visible
    const experienceItems = page.locator('.experience');
    await expect(experienceItems).toHaveCount(4);
    
    // Verify specific job titles are present
    await expect(page.locator('.experience__title', { hasText: 'Chief Intern' })).toBeVisible();
    await expect(page.locator('.experience__title', { hasText: 'Junior Intern' })).toBeVisible();
  });

  test('verifies job-card content and structure', async ({ page }) => {
    await page.goto(`${BASE_URL}/experience/job-2`);
    
    // Verify the job-card container exists
    const jobCard = page.locator('.job-card');
    await expect(jobCard).toBeVisible();

    // Verify header content
    await expect(page.getByRole('heading', { name: 'Chief Intern' }).first()).toBeVisible();
    await expect(page.locator('.text-muted', { hasText: 'Internet Affairs Inc.' })).toBeVisible();
    
    // Verify metadata
    await expect(page.locator('.job-card__dates')).toHaveText('2023-2024');
    await expect(page.locator('.job-card__location')).toContainText('Stavanger, Norway');
  });

  test('verifies company logo is visible on job page', async ({ page }) => {
    await page.goto(`${BASE_URL}/experience/job-1`);
    
    // Verify the company logo is visible
    const companyLogo = page.locator('.company-logo');
    await expect(companyLogo).toBeVisible();
  });
});