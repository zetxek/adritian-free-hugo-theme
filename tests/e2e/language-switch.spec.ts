import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';

test.describe('Language switching functionality', () => {
  test('switches between languages and verifies lang attribute', async ({ page }) => {
    // Go to homepage
    await page.goto(BASE_URL);
    
    // Verify initial English state
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Language').last()).toBeVisible();
    await expect(page.getByText('Experience').first()).toBeVisible();

    // Switch to Spanish
    await page.locator('div#footer-language-selector button').click();
    await page.getByText('Español').last().click();

    // Verify Spanish
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByText('Idioma').last()).toBeVisible();
    await expect(page.getByText('Experiencia').first()).toBeVisible();

    // Switch to French
    await page.locator('div#footer-language-selector button').click();
    await page.getByText('Français').last().click();

    // Verify French
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByText('Langue').last()).toBeVisible();
    await expect(page.getByText('Expérience').first()).toBeVisible();
  });

  test('maintains language when navigating to experience pages', async ({ page }) => {
    // Start in Spanish
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    // Click on an experience link
    await page.getByText('Ver todo').click();
    
    // Verify URL and language maintained
    await expect(page).toHaveURL(`${BASE_URL}/es/experience/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByText('Experiencia').first()).toBeVisible();
  });

  test('preserves translations across page types', async ({ page }) => {
    // Go to French experience page
    await page.goto(`${BASE_URL}/fr/experience`);
    
    // Verify French state
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByText('Expérience').first()).toBeVisible();
    
    // Navigate to home
    await page.getByText('ACCUEIL').click();
    
    // Verify language maintained
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByText('Langue').last()).toBeVisible();
  });
});