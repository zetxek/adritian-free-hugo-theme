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

  test('success and error panels start hidden', async ({ page }) => {
    await expect(page.locator('#rad-subscription-success')).toBeHidden();
    await expect(page.locator('#rad-subscription-fail')).toBeHidden();
  });
});
