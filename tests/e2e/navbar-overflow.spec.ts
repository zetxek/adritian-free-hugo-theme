import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}
console.log(`Running tests against ${BASE_URL}`);

test.describe('Navbar overflow handler', () => {
  test.beforeAll(async () => {
    // Health check
    try {
      await fetch(BASE_URL);
    } catch (error) {
      console.error(`Failed to connect to ${BASE_URL}. Is the Hugo server running?`);
      throw error;
    }
  });

  test('More dropdown is hidden when there is no overflow', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Use a very wide viewport to ensure no natural overflow
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    // Hide some nav items so it doesn't overflow naturally
    await page.addStyleTag({ content: '.navbar-nav > .nav-item:nth-child(-n+4) { display: none !important; }' });
    // Trigger resize to force recalculation
    await page.setViewportSize({ width: 1921, height: 1080 });
    await page.waitForTimeout(300);

    // More dropdown should not be visible when there's no overflow
    const moreItem = page.locator('#navbar-more-item');
    await expect(moreItem).not.toBeVisible();
  });

  test('More dropdown appears when forced via URL parameter', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}?force-overflow=true`);

    // More dropdown should be visible when forced
    const moreItem = page.locator('#navbar-more-item');
    await expect(moreItem).toBeVisible();

    // More button should be visible
    const moreButton = page.locator('#navbar-more-button');
    await expect(moreButton).toBeVisible();
    await expect(moreButton).toHaveText('More');
  });

  test('More dropdown contains overflowed items when forced', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}?force-overflow=true`);

    // More dropdown should be visible
    const moreItem = page.locator('#navbar-more-item');
    await expect(moreItem).toBeVisible();

    // Click More button to open dropdown
    await page.click('#navbar-more-button');

    // Wait for dropdown to be visible
    const moreDropdown = page.locator('#navbar-more-dropdown');
    await expect(moreDropdown).toBeVisible();

    // Dropdown should contain items
    const dropdownItems = moreDropdown.locator('li');
    const count = await dropdownItems.count();
    await expect(count).toBeGreaterThan(0);

    // Original items should be hidden
    const navbarNav = page.locator('.navbar-nav');
    const navItems = navbarNav.locator('> li:not(.more-dropdown)');
    const navItemsCount = await navItems.count();

    // At least some items should be hidden (marked with data-in-more)
    const itemsInMore = navbarNav.locator('> li[data-in-more="true"]');
    const itemsInMoreCount = await itemsInMore.count();
    await expect(itemsInMoreCount).toBeGreaterThan(0);
  });

  test('More dropdown inlines selector items with section headers', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}?force-overflow=true`);

    // Click More button to open dropdown
    await page.click('#navbar-more-button');

    const moreDropdown = page.locator('#navbar-more-dropdown');
    await expect(moreDropdown).toBeVisible();

    // Selector dropdowns (language/theme/scheme) get inlined into the More
    // dropdown as flat items grouped under .dropdown-header rows. Bootstrap 5
    // doesn't support nested toggles, so the previous nested structure was
    // broken. Verify at least one section header is rendered AND that actual
    // dropdown items follow.
    const headers = moreDropdown.locator('.dropdown-header');
    await expect(await headers.count()).toBeGreaterThan(0);

    const items = moreDropdown.locator('.dropdown-item');
    await expect(await items.count()).toBeGreaterThan(0);
  });

  test('Color scheme item inside More dropdown actually changes the scheme', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Tall viewport keeps the absolutely-positioned dropdown menu in view so
    // Playwright's auto-scroll can reach the items.
    await page.setViewportSize({ width: 1280, height: 1400 });
    await page.goto(`${BASE_URL}?force-overflow=true`);
    await page.click('#navbar-more-button');

    const moreDropdown = page.locator('#navbar-more-dropdown');
    await expect(moreDropdown).toBeVisible();

    // Pick a non-default scheme that should be present (Forest is in the
    // included data file).
    const schemeButton = moreDropdown.locator('[data-scheme-value="forest"]').first();
    if (await schemeButton.count() === 0) {
      test.skip(true, 'forest scheme not available in this build');
    }
    // force:true bypasses the viewport check — the dropdown is rendered
    // outside the visible area but the element itself is interactable.
    await schemeButton.click({ force: true });

    // The switcher applies the choice to <html data-color-scheme="..."> and
    // persists it under localStorage key "colorScheme". This proves the click
    // handler bound directly to the original <button> element survived being
    // moved into the More dropdown.
    await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'forest', { timeout: 2000 });
  });

  test('More dropdown items are clickable and navigate correctly', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}?force-overflow=true`);

    // Click More button to open dropdown
    await page.click('#navbar-more-button');

    const moreDropdown = page.locator('#navbar-more-dropdown');
    await expect(moreDropdown).toBeVisible();

    // Find a regular link (not a dropdown toggle) in the More dropdown
    const regularLink = moreDropdown.locator('a:not(.dropdown-toggle)').first();
    const linkCount = await regularLink.count();

    if (linkCount > 0) {
      const href = await regularLink.getAttribute('href');
      if (href) {
        // Click the link
        await regularLink.click();

        // Verify navigation
        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }
    }
  });

  test('More dropdown is hidden on mobile', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(`${BASE_URL}?force-overflow=true`);

    // More dropdown should be hidden on mobile
    const moreItem = page.locator('#navbar-more-item');
    await expect(moreItem).not.toBeVisible();
  });

  test('More dropdown reappears when switching from mobile to desktop', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Start with mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(`${BASE_URL}?force-overflow=true`);

    // More dropdown should be hidden on mobile
    const moreItem = page.locator('#navbar-more-item');
    await expect(moreItem).not.toBeVisible();

    // Switch to desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Wait for resize debounce
    await page.waitForTimeout(200);

    // More dropdown should be visible on desktop
    await expect(moreItem).toBeVisible();
  });

  test('More dropdown disappears when removing force-overflow parameter', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Use a very wide viewport and hide some items to ensure no natural overflow
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Start with force-overflow
    await page.goto(`${BASE_URL}?force-overflow=true`);

    // Hide some nav items so it doesn't overflow naturally when parameter is removed
    await page.addStyleTag({ content: '.navbar-nav > .nav-item:nth-child(-n+4) { display: none !important; }' });

    // More dropdown should be visible
    const moreItem = page.locator('#navbar-more-item');
    await expect(moreItem).toBeVisible();

    // Navigate without force-overflow
    await page.goto(BASE_URL);
    await page.addStyleTag({ content: '.navbar-nav > .nav-item:nth-child(-n+4) { display: none !important; }' });
    
    // Trigger resize to force recalculation
    await page.setViewportSize({ width: 1921, height: 1080 });
    await page.waitForTimeout(300);

    // More dropdown should be hidden
    await expect(moreItem).not.toBeVisible();
  });

  test('More dropdown handles window resize correctly', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    // Start with a wide viewport where everything fits
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto(BASE_URL);
    await page.addStyleTag({ content: '.navbar-nav > .nav-item:nth-child(-n+4) { display: none !important; }' });

    // Trigger resize to force recalculation
    await page.setViewportSize({ width: 1921, height: 1080 });
    await page.waitForTimeout(300);

    // More dropdown should be hidden
    const moreItem = page.locator('#navbar-more-item');
    await expect(moreItem).not.toBeVisible();

    // Resize to narrow viewport to trigger overflow
    await page.setViewportSize({ width: 768, height: 1080 });

    // Wait for resize debounce
    await page.waitForTimeout(200);

    // Just verify the handler ran without errors. Note on narrow viewports
    // the navbar itself might be hidden inside the hamburger menu, so check it exists.
    const navbarNav = page.locator('.header .navbar-nav');
    await expect(navbarNav).toBeAttached();
  });

  test('More dropdown button has correct accessibility attributes', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}?force-overflow=true`);

    const moreButton = page.locator('#navbar-more-button');

    // Check accessibility attributes
    await expect(moreButton).toHaveAttribute('type', 'button');
    await expect(moreButton).toHaveAttribute('data-bs-toggle', 'dropdown');
    await expect(moreButton).toHaveAttribute('aria-expanded', 'false');
    await expect(moreButton).toHaveAttribute('aria-haspopup', 'true');

    // Click to open dropdown
    await moreButton.click();

    // aria-expanded should change to true
    await expect(moreButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('More dropdown menu has correct accessibility attributes', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(`${BASE_URL}?force-overflow=true`);

    const moreDropdown = page.locator('#navbar-more-dropdown');

    // Check accessibility attributes
    await expect(moreDropdown).toHaveAttribute('aria-labelledby', 'navbar-more-button');
    await expect(moreDropdown).toHaveClass(/dropdown-menu/);
  });
});

test.describe('Navbar overflow footer mode', () => {
  test.beforeEach(async ({ page }) => {
    // Inject override variable before page loads
    await page.addInitScript(() => {
      (window as any).__TEST_OVERFLOW_MODE = 'footer';
    });
  });

  test('Overflow items are moved to the footer', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test');
    
    // We add ?force-overflow=true to force at least the last item to overflow
    await page.goto(`${BASE_URL}/?force-overflow=true`);

    // Verify the "More" dropdown is NOT created
    await expect(page.locator('#navbar-more-button')).not.toBeAttached();

    // Verify that there is at least one item moved to the footer
    const footerOverflowItems = page.locator('.footer_links .navbar-nav .overflow-footer-item');
    const count = await footerOverflowItems.count();
    await expect(count).toBeGreaterThan(0);

    // Verify original item is hidden in the header
    const hiddenOriginals = page.locator('.header .navbar-nav > li[data-in-footer="true"]');
    await expect(hiddenOriginals).toHaveCount(count);
    for (let i = 0; i < count; i++) {
      await expect(hiddenOriginals.nth(i)).toBeHidden();
    }
  });

  test('Footer overflow items have appended IDs for accessibility', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test');
    
    await page.goto(`${BASE_URL}/?force-overflow=true`);

    const footerOverflowItem = page.locator('.footer_links .navbar-nav .overflow-footer-item').first();
    await expect(footerOverflowItem).toBeAttached();

    // Elements inside it should have "-footer" appended to IDs to avoid duplicate IDs
    const elementsWithId = footerOverflowItem.locator('[id]');
    const count = await elementsWithId.count();
    for (let i = 0; i < count; i++) {
      const id = await elementsWithId.nth(i).getAttribute('id');
      expect(id).toMatch(/-footer$/);
    }
  });
});

