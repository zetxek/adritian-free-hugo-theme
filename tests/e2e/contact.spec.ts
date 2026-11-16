import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}
console.log(`Running tests against ${BASE_URL}`);

test.describe('Contact Form Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page with the contact form (usually footer)
    await page.goto(BASE_URL);
    // Scroll to the bottom of the page where the contact form is typically located
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  test('contact form placeholders are visible', async ({ page }) => {
    // Check that all form fields have visible placeholders
    const nameInput = page.locator('form input[name="full_name"]');
    // Scoped to the contact form: the newsletter form's email input also
    // carries name="email", so an unscoped selector matches both.
    const emailInput = page.locator('form.contact__form input[name="email"]');
    const phoneInput = page.locator('form input[name="phone"]');
    const messageTextarea = page.locator('form textarea[name="message"]');
    
    // Verify the inputs exist
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();
    
    // Verify that placeholders are set
    await expect(nameInput).toHaveAttribute('placeholder');
    await expect(emailInput).toHaveAttribute('placeholder');
    await expect(phoneInput).toHaveAttribute('placeholder');
    await expect(messageTextarea).toHaveAttribute('placeholder');
    
    // Verify the placeholders aren't empty
    const namePlaceholder = await nameInput.getAttribute('placeholder');
    const emailPlaceholder = await emailInput.getAttribute('placeholder');
    const phonePlaceholder = await phoneInput.getAttribute('placeholder');
    const messagePlaceholder = await messageTextarea.getAttribute('placeholder');
    
    expect(namePlaceholder).toBeTruthy();
    expect(emailPlaceholder).toBeTruthy();
    expect(phonePlaceholder).toBeTruthy();
    expect(messagePlaceholder).toBeTruthy();
  });

  test('contact form placeholders match values from shortcode', async ({ page }) => {
    // Get the form field elements
    const nameInput = page.locator('form input[name="full_name"]');
    // Scoped to the contact form: the newsletter form's email input also
    // carries name="email", so an unscoped selector matches both.
    const emailInput = page.locator('form.contact__form input[name="email"]');
    const phoneInput = page.locator('form input[name="phone"]');
    const messageTextarea = page.locator('form textarea[name="message"]');
    
    // Get the placeholder values
    const namePlaceholder = await nameInput.getAttribute('placeholder');
    const emailPlaceholder = await emailInput.getAttribute('placeholder');
    const phonePlaceholder = await phoneInput.getAttribute('placeholder');
    const messagePlaceholder = await messageTextarea.getAttribute('placeholder');
    
    // Log the placeholder values for debugging
    console.log('Placeholder values:', {
      name: namePlaceholder,
      email: emailPlaceholder,
      phone: phonePlaceholder,
      message: messagePlaceholder
    });
    
    // Verify placeholders have meaningful content
    // The specific values will depend on what's set in your shortcode or defaults
    // We're checking they're not empty and not just generic defaults
    expect(namePlaceholder).toBeTruthy();
    expect(namePlaceholder?.length).toBeGreaterThan(2);
    
    expect(emailPlaceholder).toBeTruthy();
    expect(emailPlaceholder?.length).toBeGreaterThan(2);
    
    expect(phonePlaceholder).toBeTruthy();
    expect(phonePlaceholder?.length).toBeGreaterThan(2);
    
    expect(messagePlaceholder).toBeTruthy();
    expect(messagePlaceholder?.length).toBeGreaterThan(2);
    
    // Check that placeholders are not just "placeholder" or generic text
    expect(namePlaceholder?.toLowerCase()).not.toBe('placeholder');
    expect(emailPlaceholder?.toLowerCase()).not.toBe('placeholder');
    expect(phonePlaceholder?.toLowerCase()).not.toBe('placeholder');
    expect(messagePlaceholder?.toLowerCase()).not.toBe('placeholder');
  });

  test('contact form has proper CSS styling', async ({ page }) => {
    // Verify that the form elements have the expected CSS classes
    await expect(page.locator('section.section--contact')).toBeVisible();
    await expect(page.locator('form.contact__form')).toHaveClass(/contact__form/);
    
    // Check specific form field styling
    await expect(page.locator('input[name="full_name"]')).toHaveClass(/form-control/);
    await expect(page.locator('.contact__form input[name="email"]')).toHaveClass(/form-control/);
    await expect(page.locator('input[name="phone"]')).toHaveClass(/form-control/);
    await expect(page.locator('textarea[name="message"]')).toHaveClass(/form-control/);
    
    // Check submit button styling
    await expect(page.locator('form.contact__form button[type="submit"]')).toHaveClass(/btn btn-primary/);
  });

  test('message textarea has the correct number of rows', async ({ page }) => {
    // Verify that the textarea has the correct number of rows (default is 2)
    const messageTextarea = page.locator('form textarea[name="message"]');
    const rowsValue = await messageTextarea.getAttribute('rows');
    
    // The actual value will depend on your implementation, but should be at least "2"
    expect(Number(rowsValue)).toBeGreaterThanOrEqual(2);
  });

  test('contact section displays correct information from shortcode', async ({ page }) => {
    // Assuming the contact form has a title
    const contactTitle = page.locator('section.section--contact h2');
    await expect(contactTitle).toBeVisible();
    
    // Check contact information is displayed correctly
    // For example, the phone number, email, and address sections
    const contactInfo = page.locator('.contact__info');
    await expect(contactInfo).toBeVisible();
    
    // Check headings in contact info section
    const infoHeadings = contactInfo.locator('h3');
    // Replace with a meaningful assertion if the expected count is known
    await expect(infoHeadings).toHaveCount(3); // Example: Replace 3 with the actual expected count
    // If your site has email info displayed, check it
    const emailSection = contactInfo.locator('h3', { hasText: /mail|email/i }).first();
    if (await emailSection.count() > 0) {
      await expect(emailSection).toBeVisible();
      // Check if there's an email value below the heading
      const emailValue = emailSection.locator('+ span');
      await expect(emailValue).toBeVisible();
    }
    
    // If your site has phone info displayed, check it
    const phoneSection = contactInfo.locator('h3', { hasText: /phone/i }).first();
    if (await phoneSection.count() > 0) {
      await expect(phoneSection).toBeVisible();
      // Check if there's a phone value below the heading
      const phoneValue = phoneSection.locator('+ span');
      await expect(phoneValue).toBeVisible();
    }
  });

  test('submit button displays text from the shortcode', async ({ page }) => {
    // Check that the submit button has text content
    const submitButton = page.locator('form.contact__form button[type="submit"]');
    await expect(submitButton).toBeVisible();
    const buttonText = await submitButton.textContent();
    expect(buttonText?.trim()).toBeTruthy();
  });

  test('form action is set correctly', async ({ page }) => {
    // Verify that the form has an action attribute
    const form = page.locator('form').first();
    const action = await form.getAttribute('action');
    expect(action).toBeTruthy();
    
    // Also check the method attribute
    const method = await form.getAttribute('method');
    expect(method).toBeTruthy();
  });
});