import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}
console.log(`Running tests against ${BASE_URL}`);

test.describe('Newsletter section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  test('renders the form with the configured action and labels', async ({ page }) => {
    const form = page.locator('#rad-subscription');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute('action', '/');
    await expect(form).toHaveAttribute('method', 'POST');

    const email = form.locator('#rad-subscription-email');
    await expect(email).toHaveAttribute('placeholder', 'Enter your email');
    await expect(email).toHaveAttribute('aria-label', 'Enter your email');

    await expect(form.locator('#rad-subscription-submit')).toHaveText('Subscribe');
  });

  test('the note renders inline markup instead of escaping it', async ({ page }) => {
    // newsletter_note commonly needs a link to a privacy policy, since the GDPR
    // expects one where an address is collected. Before safeHTML was applied it
    // appeared on the page as literal "<strong>"/"<a href=...>" text.
    const note = page.locator('#emailHelp');
    await expect(note).toBeVisible();

    await expect(note.locator('strong')).toHaveText('never');
    await expect(note).toHaveText('We respect your privacy and will never share your data.');

    const raw = await note.innerText();
    expect(raw).not.toContain('<strong>');
  });

  test('the note is wired to the email input for assistive technology', async ({ page }) => {
    await expect(page.locator('#rad-subscription-email')).toHaveAttribute(
      'aria-describedby',
      'emailHelp',
    );
  });

  test('success and error panels start hidden but present', async ({ page }) => {
    const success = page.locator('#rad-subscription-success');
    const fail = page.locator('#rad-subscription-fail');

    // toBeHidden() alone also passes when an element is absent from the DOM, so
    // assert presence first — otherwise this test would still pass if the
    // panels were removed entirely.
    await expect(success).toBeAttached();
    await expect(fail).toBeAttached();

    await expect(success).toBeHidden();
    await expect(fail).toBeHidden();
  });

  test('focusing the email field draws exactly one focus ring', async ({ page }) => {
    // Bootstrap's .form-control:focus glow and the pill's own ring used to
    // stack into a double outline, because the glow was only suppressed in the
    // dark colour mode — .section--cta is black in every mode, so light-mode
    // visitors saw both of them at once.
    const email = page.locator('#rad-subscription-email');
    await email.focus();

    await expect(email).toHaveCSS('box-shadow', 'none');

    const ring = await page
      .locator('.rad-subscription-group')
      .evaluate((el) => getComputedStyle(el).boxShadow);
    expect(ring).not.toBe('none');
  });

  test('the focus ring is not alarm red', async ({ page }) => {
    // A red ring on an untouched field reads as a validation error. White is
    // the one colour guaranteed to stay legible here whatever $primary a site
    // configures, because .section--cta is black in every colour mode.
    await page.locator('#rad-subscription-email').focus();

    const ring = await page
      .locator('.rad-subscription-group')
      .evaluate((el) => getComputedStyle(el).boxShadow);

    expect(ring).toContain('255, 255, 255');
    expect(ring).not.toContain('233, 62, 52');
  });

  test('outcome panels are live regions so results are announced', async ({ page }) => {
    // JavaScript reveals these after submission; without live-region roles the
    // outcome is never announced to assistive technology.
    const success = page.locator('#rad-subscription-success');
    await expect(success).toHaveAttribute('role', 'status');
    await expect(success).toHaveAttribute('aria-live', 'polite');

    const fail = page.locator('#rad-subscription-fail');
    await expect(fail).toHaveAttribute('role', 'alert');
    await expect(fail).toHaveAttribute('aria-live', 'assertive');
  });
});
