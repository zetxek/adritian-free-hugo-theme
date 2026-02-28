import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

/**
 * Tests for dark mode code block readability.
 * Regression test for https://github.com/zetxek/adritian-free-hugo-theme/issues/475
 *
 * Root cause: CSS specificity conflict — `[data-bs-theme=dark] .blog .post-content .highlight pre`
 * was overriding the `.chroma` dark background rule, causing invisible text on blog posts.
 */
test.describe('Dark mode code block readability', () => {
  test.beforeEach(async ({ page }) => {
    // Force dark mode via OS media query emulation so the theme init script picks it up
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`${BASE_URL}/blog/other-installation-methods/`);
    await page.waitForLoadState('networkidle');

    // Ensure the html element has data-bs-theme="dark" set
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');

    // Open the first details/summary block to make the code block visible
    await page.evaluate(() => {
      document.querySelectorAll('details').forEach(d => d.setAttribute('open', ''));
    });
  });

  test('code block text should be readable (light color) in dark mode', async ({ page }) => {
    // The first .chroma pre element contains the config code
    const codeBlock = page.locator('pre.chroma').first();
    await expect(codeBlock).toBeVisible();

    // In dark mode the text must NOT be black/dark — it must be a light colour.
    // We compare the red channel: dark text has r ≤ 50, light text has r ≥ 150.
    const color = await codeBlock.evaluate((el: Element) => window.getComputedStyle(el).color);
    // color is "rgb(R, G, B)" – extract R
    const r = parseInt(color.replace(/^rgb\((\d+).*/, '$1'), 10);
    expect(r, `Expected light text in dark mode, got color: ${color}`).toBeGreaterThan(150);
  });

  test('code block background should be dark in dark mode', async ({ page }) => {
    const codeBlock = page.locator('pre.chroma').first();
    await expect(codeBlock).toBeVisible();

    // Background must be a dark colour in dark mode (r ≤ 100).
    const bg = await codeBlock.evaluate((el: Element) => window.getComputedStyle(el).backgroundColor);
    const r = parseInt(bg.replace(/^rgb\((\d+).*/, '$1'), 10);
    expect(r, `Expected dark background in dark mode, got background: ${bg}`).toBeLessThan(100);
  });

  test('code block text and background should have sufficient contrast in dark mode', async ({ page }) => {
    const codeBlock = page.locator('pre.chroma').first();
    await expect(codeBlock).toBeVisible();

    const [color, bg] = await codeBlock.evaluate((el: Element) => {
      const s = window.getComputedStyle(el);
      return [s.color, s.backgroundColor];
    });

    // Parse rgb values
    const parseR = (c: string) => parseInt(c.replace(/^rgb\((\d+).*/, '$1'), 10);
    const textR = parseR(color);
    const bgR = parseR(bg);

    // Text should be significantly lighter than background
    expect(textR - bgR, `Insufficient contrast — text: ${color}, bg: ${bg}`).toBeGreaterThan(100);
  });

  test('inline code should be readable in dark mode', async ({ page }) => {
    // `hugo.toml` inline code in the body text
    const inlineCode = page.locator('.post-content code').first();
    await expect(inlineCode).toBeVisible();

    // Inline code uses the theme's `--bs-code-color` which is pinkish in light mode
    // and a light pink-purple in dark mode — in both cases the red channel is > 150.
    const color = await inlineCode.evaluate((el: Element) => window.getComputedStyle(el).color);
    const r = parseInt(color.replace(/^rgb\((\d+).*/, '$1'), 10);
    expect(r, `Expected readable inline code text in dark mode, got: ${color}`).toBeGreaterThan(150);
  });
});
