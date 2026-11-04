import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

console.log(`Running tests against ${BASE_URL}`);

test.describe('Accessibility polish', () => {
  test('main landmark and skip target exist on skills page', async ({ page }) => {
    await page.goto(`${BASE_URL}/skills/`);

    const mainLandmark = page.locator('main');
    await expect(mainLandmark).toBeVisible();

    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
    await expect(mainContent).toHaveAttribute('tabindex', '-1');
  });

  test('home page exposes a single skip target', async ({ page }) => {
    await page.goto(BASE_URL);

    const mainContent = page.locator('#main-content');
    await expect(mainContent).toHaveCount(1);
    await expect(mainContent).toBeVisible();
  });

  test('header and footer landmarks expose labels', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('header nav[aria-label]')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer nav[aria-label]')).toBeVisible();
  });

  test('dropdown toggles expose aria-controls and collapsed state', async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');

    await page.goto(BASE_URL);

    const languageToggle = page.locator('#btn-select-language-header');
    await expect(languageToggle).toHaveAttribute('aria-controls', 'languages-dropdown-header');
    await expect(languageToggle).toHaveAttribute('aria-expanded', 'false');

    const themeToggle = page.locator('#bd-theme-header');
    await expect(themeToggle).toHaveAttribute('aria-controls', 'theme-dropdown-header');
    await expect(themeToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('blog single page uses article landmark labeled by title', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog/new-features-demo/`);

    const article = page.locator('article#main-content');
    await expect(article).toHaveAttribute('aria-labelledby', 'blog-post-title');
    await expect(page.locator('#blog-post-title')).toBeVisible();
  });
});

// Regression coverage for the footer copyright line. `.footer__copy` used to be
// `white-space: nowrap`, so a longer notice could not wrap: at 320px the
// English notice ran 39px past the viewport and the Spanish one 74px, and
// because `html { overflow-x: hidden }` / `body { overflow: hidden }` clip
// rather than scroll, the tail was unreachable (WCAG 2.1 1.4.10 Reflow).
// Between 992px and ~1150px the same line intruded into the footer navigation
// column instead (23px English, 58px Spanish).
test.describe('Footer notice reflow', () => {
 for (const path of ['/', '/es/']) {
 test(`footer copyright notice stays inside the viewport at 320px (${path})`, async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 800 });
 await page.goto(`${BASE_URL}${path}`);

 const copy = page.locator('footer .footer__copy');
 await expect(copy).toHaveCount(1);

 const notice = copy.locator('span');
 // Fixture sanity: a selector that silently matches nothing must not pass.
 await expect(notice).toContainText('©');

 const { viewportWidth, inkRight } = await notice.evaluate((el: HTMLElement) => {
 const range = document.createRange();
 range.selectNodeContents(el);
 return {
 viewportWidth: document.documentElement.clientWidth,
 inkRight: Math.max(...Array.from(range.getClientRects(), (rect) => rect.right)),
 };
 });

 expect(inkRight).toBeLessThanOrEqual(viewportWidth);
 });
 }

 test('footer copyright notice does not intrude into its column at 992px', async ({ page }) => {
 await page.setViewportSize({ width: 992, height: 900 });
 // The Spanish notice is the longest of the bundled translations: worst case.
 await page.goto(`${BASE_URL}/es/`);

 const measurement = await page.evaluate(() => {
 const column = document.querySelector<HTMLElement>('footer .footer_left');
 const span = document.querySelector<HTMLElement>('footer .footer__copy span');
 if (!column || !span) return null;

 const range = document.createRange();
 range.selectNodeContents(span);
 return {
 inkRight: Math.max(...Array.from(range.getClientRects(), (rect) => rect.right)),
 columnRight: column.getBoundingClientRect().right,
 };
 });

 // A missing footer column or notice must fail loudly, not skip.
 expect(measurement).not.toBeNull();
 expect(measurement!.inkRight).toBeLessThanOrEqual(measurement!.columnRight);
 });
});
