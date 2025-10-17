import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}
console.log(`Running tests against ${BASE_URL}`);

test.describe('Theme basic functionality', () => {
  test.beforeAll(async () => {
    // Health check
    try {
      await fetch(BASE_URL);
    } catch (error) {
      console.error(`Failed to connect to ${BASE_URL}. Is the Hugo server running?`);
      throw error;
    }
  });

  test('homepage loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Adritian/);
  });

  test('theme switcher works', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // set the browser theme preference to "light"
    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });


    await page.goto(BASE_URL);
    // attribute exists
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme');
    // click on theme switcher
    await page.click('div#footer-color-selector button.bd-theme-selector');
    /* click on the html element:
    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                    ☀️ Light
                  </button>
    */
   await page.getByRole('button', { name: '☀️ Light' }).last().click();
   await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    // click on theme switcher
    await page.click('div#footer-color-selector button.bd-theme-selector');
    /* click on the html element:
    <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="true">
                    🌑 Dark
                    <span class="theme-icon dark d-none" aria-hidden="true"></span>
                  </button>
    */
    await expect(page.getByText('🌑 Dark').last()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  });

  test('navigation is visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav.navbar')).toBeVisible();
  });

  test('footer links work', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.footer_links')).toBeVisible();
  });

  test('skip to content link works', async ({ page }) => {
    // Navigate to a content page
    await page.goto(`${BASE_URL}/blog`);
    
    // The skip link should be initially hidden but in the DOM
    const skipLink = page.locator('.skip-to-content-link');
    await expect(skipLink).toBeAttached();
    
    // Focus the skip link (simulates tabbing to it)
    await skipLink.focus();
    
    // Now it should be visible
    await expect(skipLink).toBeVisible();
    
    // Press Enter key on the skip link
    await skipLink.press('Enter');
    
    // Verify we jumped to the main content
    // Check URL hash
    await expect(page).toHaveURL(/#main-content$/);
    
    // Verify focus is moved to main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });
});

test('footer_right should contain exactly 2 dropdown element for language and theme', async ({ page }) => {
 test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

  await page.goto(`${BASE_URL}/disable-menu/`);

  // Verify footer and footer_right exist
  await expect(page.locator('footer')).toBeAttached();
  await expect(page.locator('footer .footer_right')).toBeAttached();

  // Verify exactly 2 dropdown elements exist within footer_right
  await expect(page.locator('footer .footer_right .dropdown')).toHaveCount(2);
});


test('should load all homepage images correctly', async ({ page }) => {
  await page.goto('http://localhost:1313');
  
  // Wait for network to be idle (most images loaded)
  await page.waitForLoadState('networkidle');
  
  // Helper function to check images - handles both regular and lazy-loaded images
  const checkImageElements = async (selector: string) => {
    const elements = page.locator(selector);
    const count = await elements.count();
    
    console.log(`Checking images with selector "${selector}" - found ${count} elements`);
    await expect(count).toBeGreaterThan(0);
    if (count === 0) throw new Error(`Expected to find at least one element matching "${selector}"`);
    
    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      await expect(element).toBeVisible();
      
      const isLazyLoaded = await element.evaluate(el => 
        el.classList.contains('lozad') || el.hasAttribute('data-src'));
      
      if (isLazyLoaded) {
        // For lazy-loaded images, check that data attributes exist
        const dataSrc = await element.getAttribute('data-src');
        expect(dataSrc).toBeTruthy();
      } else {
        // For regular images, check naturalWidth
        const naturalWidth = await element.evaluate(el => (el as HTMLImageElement).naturalWidth);
        await expect(naturalWidth).toBeGreaterThan(0);
        if (naturalWidth === 0) throw new Error('Image should have loaded (naturalWidth > 0)');
      }
    }
  };
  
  // Check all required image elements
  await checkImageElements('.profile-image img');
  
  // .image-left-overflow might be an element with background image or contain an img
  const leftOverflowElement = page.locator('.image-left-overflow').first();
  await expect(leftOverflowElement).toBeVisible();
  
  // Check if it contains any img elements
  const hasImg = await page.locator('.image-left-overflow img').count() > 0;
  if (hasImg) {
    await checkImageElements('.image-left-overflow img');
  }
  
  await checkImageElements('.client-works-container picture img');
  await checkImageElements('.testimonial__author .picture img');
});