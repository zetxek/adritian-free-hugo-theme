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
    expect(vtn).toBe('none');
  });

  test('footer does not have view-transition-name', async ({ page }) => {
    await page.goto(BASE_URL);
    const footer = page.locator('footer.footer');
    const vtn = await footer.evaluate(el => getComputedStyle(el).viewTransitionName);
    expect(vtn).toBe('none');
  });
});

test.describe('Scroll-triggered animations', () => {
  test('rad-animate elements become visible after animation', async ({ page }) => {
    await page.goto(BASE_URL);
    const firstAnimated = page.locator('.rad-animate').first();
    await expect(firstAnimated).toBeVisible();
    // Animation should complete within 1s, verify element is fully opaque
    await page.waitForTimeout(600);
    const opacity = await firstAnimated.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('rad-waiting elements have CSS animations defined', async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for JS to add rad-waiting and trigger animations
    await page.waitForTimeout(300);
    const animInfo = await page.evaluate(() => {
      const el = document.querySelector('.rad-animate.rad-fade-down');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { animationName: cs.animationName, animationDuration: cs.animationDuration };
    });
    expect(animInfo).not.toBeNull();
    expect(animInfo!.animationName).toBe('radFadeDown');
    expect(animInfo!.animationDuration).toBe('0.4s');
  });
});
