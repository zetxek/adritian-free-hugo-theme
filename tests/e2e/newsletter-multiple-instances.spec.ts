import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

const CLONE_ACTION = '/api/subscribe-clone';

// Regression coverage for subscription.js only ever wiring up the first
// newsletter form on the page, and posting to a hard-coded "" URL instead of
// the form's own action. A page that renders the newsletter block twice (its
// own shortcode in content plus the footer block, which is the theme's
// documented setup) left every form after the first submitting natively —
// the browser would navigate to the action and the visitor would see raw
// JSON — and even a wired second form would have posted to the current page
// URL and revealed the first form's success/fail panels instead of its own.
//
// The homepage only has one newsletter instance in content, and authoring a
// second one there would require giving every emitted element (form,
// email input, submit button, success/fail panel) a unique id per instance,
// which is a separate follow-up (it would conflict with theme PR #615,
// currently in review, which touches the same template lines). Id
// duplication is irrelevant to what this test proves: that every form on the
// page gets wired, and that each one talks to its own action and reveals its
// own panels rather than another instance's. So instead we clone the
// existing `.rad-subscription-group` in the browser and give the clone a
// distinct action.
//
// The clone's own <script src="js/subscription.js"> tag does not
// auto-execute (script elements inserted via cloneNode/appendChild never
// run), so nothing re-scans the DOM for new forms after we append the clone.
// In the real duplicated-instance scenario this rescan instead happens
// because the second instance's own <script> tag executes during initial
// parsing. We simulate that here by re-dispatching `DOMContentLoaded`, which
// the fixed script listens for indefinitely (that's what makes its
// initialisation idempotent) — this re-runs the same scan a second real
// instance would have triggered, without relying on clone-script execution
// quirks.
async function injectClonedInstance(page: import('@playwright/test').Page) {
  await page.evaluate((cloneAction) => {
    const original = document.querySelector('.rad-subscription-group');
    if (!original) {
      throw new Error('expected an existing .rad-subscription-group on the page');
    }
    const clone = original.cloneNode(true) as HTMLElement;
    clone.classList.add('rad-subscription-group--clone');

    const form = clone.querySelector('form');
    if (!form) {
      throw new Error('expected a form inside the cloned .rad-subscription-group');
    }
    form.setAttribute('action', cloneAction);
    // cloneNode(true) copies attributes verbatim, including the
    // data-rad-subscription-bound marker the script has already set on the
    // live original by this point in the page lifecycle. A real second
    // server-rendered instance would never start out already marked bound,
    // so strip it here to accurately simulate a fresh, unbound form.
    delete form.dataset.radSubscriptionBound;

    document.body.appendChild(clone);
    document.dispatchEvent(new Event('DOMContentLoaded'));
  }, CLONE_ACTION);
}

test.describe('Newsletter section with multiple instances on the page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await injectClonedInstance(page);
  });

  test('submitting the second instance posts to its own action, not the first instance', async ({ page }) => {
    const firstForm = page.locator('.rad-subscription-group').first().locator('form');
    const cloneForm = page.locator('.rad-subscription-group--clone form');

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

    await cloneForm.locator('input[type="email"]').fill('reader@example.com');
    await cloneForm.locator('button[type="submit"]').click();

    // The clone's own success panel appears...
    await expect(page.locator('.rad-subscription-group--clone [id$="-success"]')).toBeVisible();
    // ...the first instance's success panel does not...
    await expect(page.locator('.rad-subscription-group').first().locator('[id$="-success"]')).toBeHidden();
    // ...and the first instance's form was never touched.
    await expect(firstForm).toBeVisible();

    await expect.poll(() => requestedUrls).toContain(CLONE_ACTION);
    expect(requestedUrls).not.toContain('/');
  });

  test('a failed submission on the second instance reveals only its own fail panel', async ({ page }) => {
    const cloneForm = page.locator('.rad-subscription-group--clone form');

    await page.route(`**${CLONE_ACTION}`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'subscription service unavailable' }),
      });
    });

    await cloneForm.locator('input[type="email"]').fill('reader@example.com');
    await cloneForm.locator('button[type="submit"]').click();

    await expect(page.locator('.rad-subscription-group--clone [id$="-fail"]')).toBeVisible();
    await expect(page.locator('.rad-subscription-group').first().locator('[id$="-fail"]')).toBeHidden();
  });
});
