import { Page, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:1313';

/**
 * Navigate to RTL version of a page
 * @param page Playwright page object
 * @param path Path to navigate to (e.g., '/blog/post')
 * @param lang RTL language code (default: 'ar')
 * @returns Promise that resolves when navigation is complete
 */
export async function getRTLPage(page: Page, path: string = '', lang: string = 'ar'): Promise<void> {
  const url = `${BASE_URL}/${lang}${path}`;
  await page.goto(url);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}

/**
 * Navigate to LTR version of a page
 * @param page Playwright page object
 * @param path Path to navigate to (e.g., '/blog/post')
 * @param lang LTR language code (default: 'en')
 * @returns Promise that resolves when navigation is complete
 */
export async function getLTRPage(page: Page, path: string = '', lang: string = 'en'): Promise<void> {
  const url = `${BASE_URL}/${lang}${path}`;
  await page.goto(url);
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}

/**
 * Verify text alignment is right-aligned in RTL mode
 * @param page Playwright page object
 * @param selector CSS selector for the element to check
 */
export async function verifyRTLAlignment(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  const textAlign = await element.evaluate((el) => window.getComputedStyle(el).textAlign);
  expect(textAlign).toBe('right');
}

/**
 * Compare element positions between LTR and RTL layouts
 * @param page Playwright page object
 * @param selector CSS selector for the element to compare
 * @param ltrUrl LTR page URL
 * @param rtlUrl RTL page URL
 */
export async function compareLayouts(
  page: Page,
  selector: string,
  ltrUrl: string,
  rtlUrl: string
): Promise<{ ltr: DOMRect; rtl: DOMRect }> {
  // Get LTR position
  await page.goto(ltrUrl);
  const ltrElement = page.locator(selector).first();
  await ltrElement.waitFor({ state: 'visible' });
  const ltrBox = await ltrElement.boundingBox();
  if (!ltrBox) throw new Error(`Element ${selector} not found on LTR page`);

  // Get RTL position
  await page.goto(rtlUrl);
  const rtlElement = page.locator(selector).first();
  await rtlElement.waitFor({ state: 'visible' });
  const rtlBox = await rtlElement.boundingBox();
  if (!rtlBox) throw new Error(`Element ${selector} not found on RTL page`);

  return {
    ltr: {
      x: ltrBox.x,
      y: ltrBox.y,
      width: ltrBox.width,
      height: ltrBox.height,
      top: ltrBox.y,
      right: ltrBox.x + ltrBox.width,
      bottom: ltrBox.y + ltrBox.height,
      left: ltrBox.x,
      toJSON: () => ({}),
    },
    rtl: {
      x: rtlBox.x,
      y: rtlBox.y,
      width: rtlBox.width,
      height: rtlBox.height,
      top: rtlBox.y,
      right: rtlBox.x + rtlBox.width,
      bottom: rtlBox.y + rtlBox.height,
      left: rtlBox.x,
      toJSON: () => ({}),
    },
  };
}

/**
 * Verify layout is mirrored correctly in RTL
 * @param page Playwright page object
 * @param selector CSS selector for the element to check
 * @param expectedSide Expected side ('left' or 'right')
 */
export async function verifyMirroredLayout(
  page: Page,
  selector: string,
  expectedSide: 'left' | 'right'
): Promise<void> {
  const element = page.locator(selector).first();
  await element.waitFor({ state: 'visible' });
  const box = await element.boundingBox();
  if (!box) throw new Error(`Element ${selector} not found`);

  const pageWidth = page.viewportSize()?.width || 1920;
  const isOnLeft = box.x < pageWidth / 2;
  const isOnRight = box.x + box.width > pageWidth / 2;

  if (expectedSide === 'left') {
    expect(isOnLeft).toBe(true);
  } else {
    expect(isOnRight).toBe(true);
  }
}

/**
 * Verify border is on the correct side in RTL
 * @param page Playwright page object
 * @param selector CSS selector for the element to check
 * @param expectedSide Expected side ('left' or 'right')
 */
export async function verifyBorderSide(
  page: Page,
  selector: string,
  expectedSide: 'left' | 'right'
): Promise<void> {
  const element = page.locator(selector).first();
  const borderLeft = await element.evaluate((el) => window.getComputedStyle(el).borderLeftWidth);
  const borderRight = await element.evaluate((el) => window.getComputedStyle(el).borderRightWidth);

  const leftWidth = parseInt(borderLeft) || 0;
  const rightWidth = parseInt(borderRight) || 0;
  
  if (expectedSide === 'left') {
    expect(leftWidth).toBeGreaterThan(0);
    // Check that left border is greater than or equal to right border
    expect(leftWidth).toBeGreaterThanOrEqual(rightWidth);
  } else {
    expect(rightWidth).toBeGreaterThan(0);
    // Check that right border is greater than or equal to left border
    expect(rightWidth).toBeGreaterThanOrEqual(leftWidth);
  }
}

/**
 * Verify element has RTL direction
 * @param page Playwright page object
 * @param selector CSS selector for the element to check
 */
export async function verifyRTLDirection(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector).first();
  const direction = await element.evaluate((el) => window.getComputedStyle(el).direction);
  expect(direction).toBe('rtl');
}

/**
 * Verify image is mirrored in RTL
 * @param page Playwright page object
 * @param selector CSS selector for the image to check
 */
export async function verifyImageMirrored(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector).first();
  const transform = await element.evaluate((el) => window.getComputedStyle(el).transform);
  // scaleX(-1) returns a matrix like "matrix(-1, 0, 0, 1, 0, 0)"
  // Parse the matrix to check if the first value (scaleX component) is -1
  expect(transform).toContain('matrix');
  
  // Extract matrix values: matrix(a, b, c, d, tx, ty)
  // For scaleX(-1), the 'a' value (first number) should be -1
  const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
  expect(matrixMatch).not.toBeNull();
  
  if (matrixMatch) {
    const values = matrixMatch[1].split(',').map(v => parseFloat(v.trim()));
    // First value is the scaleX component
    expect(values[0]).toBe(-1);
  }
}

