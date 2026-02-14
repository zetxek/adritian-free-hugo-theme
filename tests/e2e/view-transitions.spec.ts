import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

test.describe('View Transitions', () => {
  test('meta tag is present by default', async ({ page }) => {
    await page.goto(BASE_URL);
    const meta = page.locator('meta[name="view-transition"]');
    await expect(meta).toHaveAttribute('content', 'same-origin');
  });

  test('view-transition-name is set on main content', async ({ page }) => {
    await page.goto(BASE_URL);
    const main = page.locator('main');
    const vtn = await main.evaluate(el => getComputedStyle(el).viewTransitionName);
    expect(vtn).toBe('main-content');
  });

  test('header does not have view-transition-name', async ({ page }) => {
    // Header is excluded from view transitions because its height changes
    // between sticky (scrolled) and non-sticky states
    await page.goto(BASE_URL);
    const header = page.locator('header.header');
    const vtn = await header.evaluate(el => getComputedStyle(el).viewTransitionName);
    expect(vtn).not.toBe('header');
  });

  test('footer does not have view-transition-name', async ({ page }) => {
    await page.goto(BASE_URL);
    const footer = page.locator('footer.footer');
    const vtn = await footer.evaluate(el => getComputedStyle(el).viewTransitionName);
    expect(vtn).not.toBe('footer');
  });
});
