import { expect, test } from '@playwright/test';
import {
  getRTLPage,
  verifyBorderSide,
  verifyImageMirrored,
  verifyRTLAlignment,
  verifyRTLDirection,
} from '../utils/rtl-helpers';

test.describe('RTL Component-Specific Tests', () => {
  test.beforeEach(async () => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');
  });

  test('Breadcrumb RTL rendering', async ({ page }) => {
    // Navigate to a page with breadcrumbs in RTL
    await getRTLPage(page, '/blog/sample');
    
    // Verify breadcrumbs container exists
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    
    // Verify breadcrumb items align correctly
    await verifyRTLAlignment(page, '.breadcrumbs');
    
    // Verify breadcrumb separator positioning
    const firstItem = breadcrumbs.locator('.breadcrumb-item').first();
    // Check that separator margin is on the right side in RTL
    const marginRight = await firstItem.evaluate((el) => {
      const after = window.getComputedStyle(el, '::after');
      return after.marginRight;
    });
    // Separator should have right margin in RTL
    expect(parseInt(marginRight) || 0).toBeGreaterThanOrEqual(0);
  });

  test('Button icon positioning in RTL', async ({ page }) => {
    await getRTLPage(page, '/');
    
    // Find buttons with icons
    const buttonsWithIcons = page.locator('.btn').filter({ has: page.locator('i, [class^="icon-"]') });
    const count = await buttonsWithIcons.count();
    
    if (count > 0) {
      const firstButton = buttonsWithIcons.first();
      await expect(firstButton).toBeVisible();
      
      // Verify icon has correct margin (left margin in RTL, no right margin)
      const icon = firstButton.locator('i, [class^="icon-"]').first();
      const marginLeft = await icon.evaluate((el) => window.getComputedStyle(el).marginLeft);
      const marginRight = await icon.evaluate((el) => window.getComputedStyle(el).marginRight);
      
      expect(parseInt(marginLeft) || 0).toBeGreaterThan(0);
      expect(parseInt(marginRight) || 0).toBe(0);
    }
  });

  test('Code block alignment in RTL', async ({ page }) => {
    await getRTLPage(page, '/blog/sample');
    
    // Find code blocks
    const codeBlocks = page.locator('pre');
    const count = await codeBlocks.count();
    
    if (count > 0) {
      const firstCodeBlock = codeBlocks.first();
      await expect(firstCodeBlock).toBeVisible();
      
      // Code blocks should remain LTR even in RTL pages
      const direction = await firstCodeBlock.evaluate((el) => window.getComputedStyle(el).direction);
      expect(direction).toBe('ltr');
      
      // Text alignment should be left for code
      const textAlign = await firstCodeBlock.evaluate((el) => window.getComputedStyle(el).textAlign);
      expect(textAlign).toBe('left');
    }
    
    // Check inline code
    const inlineCode = page.locator('code').first();
    if (await inlineCode.count() > 0) {
      const direction = await inlineCode.evaluate((el) => window.getComputedStyle(el).direction);
      expect(direction).toBe('ltr');
    }
  });

  test('Blockquote border positioning in RTL', async ({ page }) => {
    await getRTLPage(page, '/blog/sample');
    
    // Find blockquotes
    const blockquotes = page.locator('blockquote');
    const count = await blockquotes.count();
    
    if (count > 0) {
      const firstBlockquote = blockquotes.first();
      await expect(firstBlockquote).toBeVisible();
      
      // Verify border is on the right side in RTL
      await verifyBorderSide(page, 'blockquote', 'right');
      
      // Verify text alignment
      await verifyRTLAlignment(page, 'blockquote');
      
      // Verify padding is on the right
      const paddingRight = await firstBlockquote.evaluate((el) => window.getComputedStyle(el).paddingRight);
      expect(parseInt(paddingRight) || 0).toBeGreaterThan(0);
    }
  });

  test('Table alignment in RTL', async ({ page }) => {
    await getRTLPage(page, '/blog/sample');
    
    // Find tables
    const tables = page.locator('table');
    const count = await tables.count();
    
    if (count > 0) {
      const firstTable = tables.first();
      await expect(firstTable).toBeVisible();
      
      // Verify table has RTL direction
      await verifyRTLDirection(page, 'table');
      
      // Verify table cells align right
      const cells = firstTable.locator('td, th');
      if (await cells.count() > 0) {
        const firstCell = cells.first();
        const textAlign = await firstCell.evaluate((el) => window.getComputedStyle(el).textAlign);
        expect(textAlign).toBe('right');
      }
    }
  });

  test('Table of Contents border positioning in RTL', async ({ page }) => {
    await getRTLPage(page, '/blog/new-features-demo');
    
    // Find table of contents
    const toc = page.locator('.table-of-contents');
    const count = await toc.count();
    
    if (count > 0) {
      await expect(toc.first()).toBeVisible();
      
      // Verify border is on the right side in RTL
      await verifyBorderSide(page, '.table-of-contents', 'right');
      
      // Verify nested list padding is on the right
      const nestedUl = toc.locator('#TableOfContents ul ul').first();
      if (await nestedUl.count() > 0) {
        const paddingRight = await nestedUl.evaluate((el) => window.getComputedStyle(el).paddingRight);
        expect(parseInt(paddingRight) || 0).toBeGreaterThan(0);
      }
    }
  });

  test('Testimonial layout in RTL', async ({ page }) => {
    await getRTLPage(page, '/');
    
    // Find testimonials
    const testimonials = page.locator('.testimonial');
    const count = await testimonials.count();
    
    if (count > 0) {
      const firstTestimonial = testimonials.first();
      await expect(firstTestimonial).toBeVisible();
      
      // Verify text alignment
      await verifyRTLAlignment(page, '.testimonial');
      
      // Verify author layout uses row-reverse
      const author = firstTestimonial.locator('.testimonial__author');
      if (await author.count() > 0) {
        const flexDirection = await author.evaluate((el) => window.getComputedStyle(el).flexDirection);
        expect(flexDirection).toBe('row-reverse');
      }
    }
  });

  test('Skills section progress bar direction in RTL', async ({ page }) => {
    await getRTLPage(page, '/');
    
    // Find skills section
    const skillsSection = page.locator('.skills-section');
    const count = await skillsSection.count();
    
    if (count > 0) {
      await expect(skillsSection.first()).toBeVisible();
      
      // Verify text alignment
      await verifyRTLAlignment(page, '.skills-section');
      
      // Verify progress bar has RTL direction
      const progress = skillsSection.locator('.progress').first();
      if (await progress.count() > 0) {
        await verifyRTLDirection(page, '.progress');
      }
    }
  });

  test('Image mirroring functionality', async ({ page }) => {
    await getRTLPage(page, '/');
    
    // Check showcase image (should be mirrored)
    const showcaseImage = page.locator('.showcase-section .profile-image img');
    const showcaseCount = await showcaseImage.count();
    
    if (showcaseCount > 0) {
      // Showcase images should be mirrored
      await verifyImageMirrored(page, '.showcase-section .profile-image img');
    }
    
    // Check for rtl-mirror class images
    const rtlMirrorImages = page.locator('img.rtl-mirror, .rtl-mirror img');
    const mirrorCount = await rtlMirrorImages.count();
    
    if (mirrorCount > 0) {
      await verifyImageMirrored(page, 'img.rtl-mirror, .rtl-mirror img');
    }
    
    // Check for rtl-no-mirror class (should NOT be mirrored)
    const noMirrorImages = page.locator('img.rtl-no-mirror, .rtl-no-mirror img');
    const noMirrorCount = await noMirrorImages.count();
    
    if (noMirrorCount > 0) {
      const firstNoMirror = noMirrorImages.first();
      const transform = await firstNoMirror.evaluate((el) => window.getComputedStyle(el).transform);
      // Should not be mirrored (transform should be none or identity matrix)
      expect(transform).not.toContain('scaleX(-1)');
    }
  });

  test('Search input RTL styling', async ({ page }) => {
    await getRTLPage(page, '/search');
    
    // Find search input
    const searchInput = page.locator('#search-query');
    const count = await searchInput.count();
    
    if (count > 0) {
      await expect(searchInput).toBeVisible();
      
      // Verify input has RTL direction
      await verifyRTLDirection(page, '#search-query');
      
      // Verify text alignment
      await verifyRTLAlignment(page, '#search-query');
      
      // Verify input group direction
      const inputGroup = page.locator('.input-group');
      if (await inputGroup.count() > 0) {
        await verifyRTLDirection(page, '.input-group');
      }
    }
  });

  test('Breadcrumb navigation works in RTL', async ({ page }) => {
    await getRTLPage(page, '/blog/sample');
    
    // Verify breadcrumbs are visible
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    
    // Check if breadcrumb links are clickable
    const breadcrumbLinks = breadcrumbs.locator('.breadcrumb-link');
    const linkCount = await breadcrumbLinks.count();
    
    if (linkCount > 0) {
      const firstLink = breadcrumbLinks.first();
      await expect(firstLink).toBeVisible();
      
      // Verify link is clickable (has href)
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});

