import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1313';

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
    await expect(page.getByText('2023-2024')).toBeVisible();
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
    await expect(page.getByText('2023-2024')).toBeVisible();
    await expect(page.getByText('Arreglando el mundo, un byte a la vez')).toBeVisible();
  });

  test('navigates to experience items in French', async ({ page }) => {
    // Go to French version
    await page.goto(`${BASE_URL}/fr/`);
    
    // Click on first experience item
    await page.getByText('Stagiaire en Chef').first().click();
    
    // Verify URL and French content
    await expect(page).toHaveURL(/\/fr\/experience\/job-2\/?$/);
    await expect(page.getByText('Internet Affairs Inc.')).toHaveCount(4);
    await expect(page.getByText('Stavanger')).toHaveCount(4);
    await expect(page.getByText('2023-2024')).toBeVisible();
    await expect(page.getByText('Réparer le monde, un octet à la fois')).toBeVisible();
  });

  test('verifies experience list page shows all items', async ({ page }) => {
    // Go to experience list page
    await page.goto(`${BASE_URL}/experience`);
    
    // Verify multiple experience items are visible
    const experienceItems = page.locator('.experience');
    await expect(experienceItems).toHaveCount(4);
    
    // Verify specific job titles are present
    await expect(page.getByText('Chief Intern')).toBeVisible();
    await expect(page.getByText('Junior Intern')).toBeVisible();
  });
});