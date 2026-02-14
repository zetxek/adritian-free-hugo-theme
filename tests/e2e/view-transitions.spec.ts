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

  test('view-transition-name is set on header', async ({ page }) => {
    await page.goto(BASE_URL);
    const header = page.locator('header.header');
    const vtn = await header.evaluate(el => getComputedStyle(el).viewTransitionName);
    expect(vtn).toBe('header');
  });

  test('view-transition-name is set on footer', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because footer may differ without menus');
    await page.goto(BASE_URL);
    const footer = page.locator('footer.footer');
    const vtn = await footer.evaluate(el => getComputedStyle(el).viewTransitionName);
    expect(vtn).toBe('footer');
  });

  test('blog post footer does NOT have view-transition-name', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/`);
    const blogFooters = page.locator('article footer, .blog-summary footer');
    const count = await blogFooters.count();
    if (count > 0) {
      const vtn = await blogFooters.first().evaluate(el => getComputedStyle(el).viewTransitionName);
      expect(vtn).not.toBe('footer');
    }
  });
});
