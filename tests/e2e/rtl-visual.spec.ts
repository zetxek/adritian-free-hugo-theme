import { expect, test } from '@playwright/test';
import { getLTRPage, getRTLPage } from '../utils/rtl-helpers';


test.describe('RTL Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');
  });

  test('Homepage visual comparison LTR vs RTL', async ({ page }) => {
    // Set consistent viewport for comparison
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Screenshot LTR homepage
    await getLTRPage(page, '/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveScreenshot('homepage-ltr.png', {
      animations: 'disabled',
    });

    // Screenshot RTL homepage
    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveScreenshot('homepage-rtl.png', {
      animations: 'disabled',
    });
  });

  test('Homepage header section visual test', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Test header in RTL
    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('header, .header');
    if (await header.count() > 0) {
      await expect(header.first()).toHaveScreenshot('header-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Homepage showcase section visual test', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Test showcase in RTL
    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    const showcase = page.locator('.showcase-section, .rad-showcase');
    if (await showcase.count() > 0) {
      await expect(showcase.first()).toHaveScreenshot('showcase-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Homepage footer section visual test', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Test footer in RTL
    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer, .footer_links');
    if (await footer.count() > 0) {
      await expect(footer.first()).toHaveScreenshot('footer-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Blog post visual comparison LTR vs RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Screenshot LTR blog post
    await getLTRPage(page, '/blog/sample');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toHaveScreenshot('blog-post-ltr.png', {
      animations: 'disabled',
    });

    // Screenshot RTL blog post
    await getRTLPage(page, '/blog/sample');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toHaveScreenshot('blog-post-rtl.png', {
      animations: 'disabled',
    });
  });

  test('Blog post with code blocks and blockquotes visual test', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/blog/sample');
    await page.waitForLoadState('networkidle');
    
    // Test code block section
    const codeBlock = page.locator('pre').first();
    if (await codeBlock.count() > 0) {
      await expect(codeBlock).toHaveScreenshot('code-block-rtl.png', {
        animations: 'disabled',
      });
    }
    
    // Test blockquote section
    const blockquote = page.locator('blockquote').first();
    if (await blockquote.count() > 0) {
      await expect(blockquote).toHaveScreenshot('blockquote-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Navigation menu visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    const navbar = page.locator('nav.navbar, .navbar');
    if (await navbar.count() > 0) {
      await expect(navbar.first()).toHaveScreenshot('navbar-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Navigation dropdown visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    // Open language selector dropdown
    const languageSelector = page.locator('div#header-language-selector button, div#footer-language-selector button').first();
    if (await languageSelector.count() > 0) {
      await languageSelector.click();
      await page.waitForTimeout(300); // Wait for dropdown animation
      
      const dropdown = page.locator('.dropdown-menu').first();
      if (await dropdown.count() > 0) {
        await expect(dropdown).toHaveScreenshot('dropdown-rtl.png', {
          animations: 'disabled',
        });
      }
    }
  });

  test('Breadcrumb visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/blog/sample');
    await page.waitForLoadState('networkidle');
    
    const breadcrumbs = page.locator('.breadcrumbs');
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs.first()).toHaveScreenshot('breadcrumbs-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Table of Contents visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/blog/new-features-demo');
    await page.waitForLoadState('networkidle');
    
    const toc = page.locator('.table-of-contents');
    if (await toc.count() > 0) {
      await expect(toc.first()).toHaveScreenshot('toc-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Testimonial component visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    const testimonial = page.locator('.testimonial').first();
    if (await testimonial.count() > 0) {
      await expect(testimonial).toHaveScreenshot('testimonial-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Skills section visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    const skillsSection = page.locator('.skills-section').first();
    if (await skillsSection.count() > 0) {
      await expect(skillsSection).toHaveScreenshot('skills-rtl.png', {
        animations: 'disabled',
      });
    }
  });

  test('Mobile viewport visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('html')).toHaveScreenshot('mobile-rtl.png', {
      animations: 'disabled',
    });
  });

  test('Tablet viewport visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await getRTLPage(page, '/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('html')).toHaveScreenshot('tablet-rtl.png', {
      animations: 'disabled',
    });
  });

  test('Search page visual test in RTL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await getRTLPage(page, '/search');
    await page.waitForLoadState('networkidle');
    
    const searchSection = page.locator('.search-section, #search-results').first();
    if (await searchSection.count() > 0) {
      await expect(searchSection).toHaveScreenshot('search-rtl.png', {
        animations: 'disabled',
      });
    }
  });
});

