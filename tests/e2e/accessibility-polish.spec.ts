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

// WCAG 2.1 1.4.3 (Contrast, Minimum): link and secondary text must reach 4.5:1
// in both colour schemes. Computed here from the rendered styles (no axe).
test.describe('Colour contrast AA (links and secondary text)', () => {
  const MIN_CONTRAST = 4.5;

  // Per page: one text link and one secondary/meta text element. The skills
  // page has no link inside <main>, so its link is the primary navigation.
  const targets = [
    { path: '/', link: 'main a.btn-frameless', meta: 'main .experience__date' },
    { path: '/blog/', link: 'main a[href^="/blog/"]', meta: 'main .post-date' },
    { path: '/tags/hugo/', link: 'main li.post > a', meta: 'main li.post .meta' },
    { path: '/skills/', link: 'header .navbar a.nav-link:visible', meta: 'main .skill-level' },
    // #emailHelp-content is muted text inside the black .section--cta band.
    { path: '/blog/shortcodes/', link: 'header .navbar a.nav-link:visible', meta: '#emailHelp-content' },
    ];

  for (const scheme of ['light', 'dark'] as const) {
    for (const target of targets) {
      test(`${target.path} link and meta text pass AA in ${scheme} mode`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(`${BASE_URL}${target.path}`);
        // Entrance animations fade elements in; measure the settled colours.
        await page.addStyleTag({
          content: '.rad-animate, .rad-animation-group { opacity: 1 !important; transform: none !important; }',
        });

        const contrastOf = (selector: string) =>
          page.locator(selector).first().evaluate((el: HTMLElement) => {
            type Rgba = [number, number, number, number];
            const parse = (value: string): Rgba => {
              const m = value.match(/rgba?\(([^)]+)\)/);
              if (!m) return [0, 0, 0, 0];
              const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
              return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
            };
            const over = (top: Rgba, base: Rgba): Rgba => {
              const a = top[3] + base[3] * (1 - top[3]);
              if (a === 0) return [0, 0, 0, 0];
              const mix = (i: number) => (top[i] * top[3] + base[i] * base[3] * (1 - top[3])) / a;
              return [mix(0), mix(1), mix(2), a];
            };
            const luminance = ([r, g, b]: Rgba) => {
              const [lr, lg, lb] = [r, g, b].map((c) => {
                const s = c / 255;
                return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
              });
              return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
            };

            // Effective background: composite ancestors' backgrounds, innermost first.
            let background: Rgba = [0, 0, 0, 0];
            for (let node: HTMLElement | null = el; node; node = node.parentElement) {
              background = over(background, parse(getComputedStyle(node).backgroundColor));
              if (background[3] >= 1) break;
            }
            background = over(background, [255, 255, 255, 1]); // canvas default

            const style = getComputedStyle(el);
            const foreground = over(parse(style.color), background);
            const [hi, lo] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
            return {
              ratio: (hi + 0.05) / (lo + 0.05),
              fg: style.color,
              bg: `rgb(${background.slice(0, 3).map(Math.round).join(', ')})`,
              text: (el.textContent ?? '').trim().slice(0, 40),
            };
          });

        for (const [kind, selector] of [['link', target.link], ['meta', target.meta]] as const) {
          // A selector that matches nothing must fail, not pass as a no-op.
          await expect(page.locator(selector).first(), `${kind} "${selector}" exists`).toBeVisible();
          const result = await contrastOf(selector);
          expect(
            result.ratio,
            `${kind} "${result.text}" (${selector}) ${result.fg} on ${result.bg} in ${scheme} mode: ${result.ratio.toFixed(2)}:1`,
          ).toBeGreaterThanOrEqual(MIN_CONTRAST);
        }
      });
    }
  }
});
