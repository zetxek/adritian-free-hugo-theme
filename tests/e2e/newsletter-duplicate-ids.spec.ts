import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

const PAGE_PATH = '/blog/shortcodes/';

// Regression coverage for the newsletter block rendering twice on the same
// document: the page's own {{< newsletter-section >}} shortcode (added to
// this page specifically to exercise this scenario) plus the footer's own
// copy, which layouts/partials/footer.html includes on every page. Before
// the id_suffix fix in layouts/partials/newsletter.html both instances
// emitted the exact same ids (form#rad-subscription, input
// #rad-subscription-email, panel#rad-subscription-success, etc.) — invalid
// HTML, and it left the second instance's aria-describedby="emailHelp"
// resolving to the first instance's help text instead of its own.
//
// The fix keeps the footer's copy on the legacy, unsuffixed ids (so sites
// with only a footer instance see no change) and suffixes the page's own
// instance "-content" instead, since the footer only renders once the
// site's footer content is known to also carry a newsletter block. Every
// assertion below failed before the fix: either the id collided outright,
// or aria-describedby resolved to the wrong instance's note.
test.describe('Newsletter section rendered twice on one page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}${PAGE_PATH}`);
  });

  test('no id attribute value is duplicated anywhere in the document', async ({ page }) => {
    const ids = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[id]')).map((el) => el.id),
    );

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toEqual([]);

    // The footer instance keeps the legacy, unsuffixed ids...
    for (const id of [
      'newsletter',
      'rad-subscription',
      'rad-subscription-email',
      'rad-subscription-submit',
      'rad-subscription-success',
      'rad-subscription-fail',
      'emailHelp',
    ]) {
      expect(ids.filter((candidate) => candidate === id)).toHaveLength(1);
    }

    // ...and the page's own instance is present, suffixed "-content",
    // alongside it.
    for (const id of [
      'newsletter-content',
      'rad-subscription-content',
      'rad-subscription-content-email',
      'rad-subscription-content-submit',
      'rad-subscription-content-success',
      'rad-subscription-content-fail',
      'emailHelp-content',
    ]) {
      expect(ids.filter((candidate) => candidate === id)).toHaveLength(1);
    }
  });

  test('each instance owns its own form, input, panels and help text', async ({ page }) => {
    const instances = [
      { section: '#newsletter-content', suffix: '-content' },
      { section: '#newsletter', suffix: '' },
    ];

    for (const { section, suffix } of instances) {
      const scope = page.locator(section);

      await expect(scope.locator(`#rad-subscription${suffix}`)).toBeVisible();
      await expect(scope.locator(`#rad-subscription${suffix}-email`)).toBeVisible();
      await expect(scope.locator(`#rad-subscription${suffix}-success`)).toBeAttached();
      await expect(scope.locator(`#rad-subscription${suffix}-fail`)).toBeAttached();
      await expect(scope.locator(`#emailHelp${suffix}`)).toBeVisible();
    }

    // The bug: with duplicate ids, the browser's own id-based resolution
    // (getElementById behind aria-describedby) always returns the *first*
    // matching element in the document, so the second instance's note would
    // silently resolve to the first instance's text. These two instances are
    // configured with different note text specifically so a wrong
    // resolution is caught here rather than masked by both notes happening
    // to read the same.
    const contentEmail = page.locator('#newsletter-content #rad-subscription-content-email');
    const contentDescribedBy = await contentEmail.getAttribute('aria-describedby');
    expect(contentDescribedBy).toBe('emailHelp-content');
    await expect(page.locator(`#${contentDescribedBy}`)).toHaveText(
      "We'll never share your email with anyone else.",
    );

    const footerEmail = page.locator('#newsletter #rad-subscription-email');
    const footerDescribedBy = await footerEmail.getAttribute('aria-describedby');
    expect(footerDescribedBy).toBe('emailHelp');
    await expect(page.locator(`#${footerDescribedBy}`)).toHaveText(
      'We respect your privacy and will never share your data.',
    );
  });

  test('submitting the content instance reveals only its own success panel', async ({ page }) => {
    const requestedUrls: string[] = [];
    await page.route('**/*', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        requestedUrls.push(new URL(request.url()).pathname);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
        return;
      }
      await route.continue();
    });

    const contentForm = page.locator('#newsletter-content #rad-subscription-content');
    await contentForm.locator('input[type="email"]').fill('reader@example.com');
    await contentForm.locator('button[type="submit"]').click();

    await expect(page.locator('#rad-subscription-content-success')).toBeVisible();
    await expect(page.locator('#rad-subscription-success')).toBeHidden();

    await expect.poll(() => requestedUrls).toContain('/api/subscribe-shortcodes-demo');
  });

  test('submitting the footer instance reveals only its own success panel', async ({ page }) => {
    const requestedUrls: string[] = [];
    await page.route('**/*', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        requestedUrls.push(new URL(request.url()).pathname);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
        return;
      }
      await route.continue();
    });

    const footerForm = page.locator('#newsletter #rad-subscription');
    await footerForm.locator('input[type="email"]').fill('reader@example.com');
    await footerForm.locator('button[type="submit"]').click();

    await expect(page.locator('#rad-subscription-success')).toBeVisible();
    await expect(page.locator('#rad-subscription-content-success')).toBeHidden();

    await expect.poll(() => requestedUrls).toContain('/');
  });
});
