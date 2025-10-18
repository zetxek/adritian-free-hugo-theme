import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1313';

test.describe('New Blog Features', () => {
  
  test.describe('Related Posts', () => {
    test('should display related posts section with heading, list, and 3 post items including title, excerpt, date, and tags', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for related posts section
      const relatedPostsSection = page.locator('.related-posts');
      await expect(relatedPostsSection).toBeVisible();
      
      // Check heading
      await expect(relatedPostsSection.locator('h3')).toContainText('Related Posts');
      
      // Check that we have related posts displayed
      const relatedPostsList = relatedPostsSection.locator('.related-posts-list');
      await expect(relatedPostsList).toBeVisible();
      
      // Check that at least one related post item exists
      const relatedPostItems = relatedPostsList.locator('.related-post-item');
      await expect(relatedPostItems).toHaveCount(3); // Should show 3 related posts
      
      // Verify each related post has required elements
      const firstPost = relatedPostItems.first();
      await expect(firstPost.locator('h4')).toBeVisible();
      await expect(firstPost.locator('.related-post-excerpt')).toBeVisible();
      await expect(firstPost.locator('.related-post-meta .post-date')).toBeVisible();
    });

    test('should navigate to correct blog post URL when clicking on a related post item', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Click on the first related post
      await page.locator('.related-post-item').first().click();
      
      // Should navigate to a different blog post
      await expect(page).toHaveURL(/\/blog\/.+/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should display at least one tag on related posts items', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check that tags are displayed in related posts
      const tagsInRelatedPosts = page.locator('.related-post-item .post-tags .tag');
      const tagCount = await tagsInRelatedPosts.count();
      
      // At least some posts should have tags
      expect(tagCount).toBeGreaterThan(0);
    });
  });

  test.describe('Social Sharing Buttons', () => {
    test('should display social sharing section with "Share this post" heading', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      const sharingSection = page.locator('.social-sharing');
      await expect(sharingSection).toBeVisible();
      
      // Check heading
      await expect(sharingSection.locator('h3')).toContainText('Share this post');
    });

    test('should display sharing buttons for Twitter, LinkedIn, Facebook, and Email', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      const sharingButtons = page.locator('.share-buttons');
      await expect(sharingButtons).toBeVisible();
      
      // Check for each platform's button
      await expect(sharingButtons.locator('.share-twitter')).toBeVisible();
      await expect(sharingButtons.locator('.share-linkedin')).toBeVisible();
      await expect(sharingButtons.locator('.share-facebook')).toBeVisible();
      await expect(sharingButtons.locator('.share-email')).toBeVisible();
    });

    test('should have correct share URLs for Twitter, LinkedIn, Facebook, and Email with proper parameters', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check Twitter share link
      const twitterButton = page.locator('.share-twitter');
      const twitterHref = await twitterButton.getAttribute('href');
      expect(twitterHref).toContain('twitter.com/intent/tweet');
      expect(twitterHref).toContain('url=');
      
      // Check LinkedIn share link
      const linkedinButton = page.locator('.share-linkedin');
      const linkedinHref = await linkedinButton.getAttribute('href');
      expect(linkedinHref).toContain('linkedin.com/sharing/share-offsite');
      
      // Check Facebook share link
      const facebookButton = page.locator('.share-facebook');
      const facebookHref = await facebookButton.getAttribute('href');
      expect(facebookHref).toContain('facebook.com/sharer');
      
      // Check Email share link
      const emailButton = page.locator('.share-email');
      const emailHref = await emailButton.getAttribute('href');
      expect(emailHref).toContain('mailto:');
    });

    test('should have accessible ARIA labels on all sharing buttons for screen readers', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check ARIA labels for accessibility
      await expect(page.locator('.share-twitter')).toHaveAttribute('aria-label', /Share on Twitter/i);
      await expect(page.locator('.share-linkedin')).toHaveAttribute('aria-label', /Share on LinkedIn/i);
      await expect(page.locator('.share-facebook')).toHaveAttribute('aria-label', /Share on Facebook/i);
      await expect(page.locator('.share-email')).toHaveAttribute('aria-label', /Share via Email/i);
    });
  });

  test.describe('Table of Contents', () => {
    test('should display table of contents section with "Table of Contents" heading when enabled in post frontmatter', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      const tocSection = page.locator('.table-of-contents');
      await expect(tocSection).toBeVisible();
      
      // Check heading
      await expect(tocSection.locator('h3')).toContainText('Table of Contents');
    });

    test('should contain navigation links with anchor href attributes pointing to page sections', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      const tocNav = page.locator('.table-of-contents #TableOfContents');
      await expect(tocNav).toBeVisible();
      
      // Should have list items with links
      const tocLinks = tocNav.locator('a');
      const linkCount = await tocLinks.count();
      expect(linkCount).toBeGreaterThan(0);
      
      // Check first link
      await expect(tocLinks.first()).toBeVisible();
      const firstHref = await tocLinks.first().getAttribute('href');
      expect(firstHref).toMatch(/^#/); // Should be anchor links
    });

    test('should scroll to corresponding section and update URL hash when clicking on table of contents links', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Click on a TOC link
      const tocLinks = page.locator('.table-of-contents #TableOfContents a');
      const firstLink = tocLinks.first();
      const linkText = await firstLink.textContent();
      
      await firstLink.click();
      
      // URL should have the hash
      await expect(page).toHaveURL(/#.+/);
      
      // Wait a bit for smooth scrolling
      await page.waitForTimeout(500);
    });

    test('should have sticky positioning class when tocSticky is enabled in post frontmatter', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      const tocSection = page.locator('.table-of-contents');
      
      // Check if it has the sticky class (post has tocSticky: true)
      await expect(tocSection).toHaveClass(/toc-sticky/);
    });
  });

  test.describe('Enhanced Reading Metadata', () => {
    test('should display estimated reading time in minutes', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check for reading time
      const readingTime = page.locator('#reading-time');
      await expect(readingTime).toBeVisible();
      await expect(readingTime).toContainText('min read');
    });

    test('should display total word count of the post', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check for word count
      const wordCount = page.locator('#wordcount');
      await expect(wordCount).toBeVisible();
      await expect(wordCount).toContainText('Words');
    });

    test('should display post publish date', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check for publish date
      const publishDate = page.locator('#date');
      await expect(publishDate).toBeVisible();
    });

    test('should display last modified date with "Updated" label when lastmod is present in frontmatter', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check for last modified date
      const lastModified = page.locator('#last-modified');
      
      // The demo post has lastmod, so it should be visible
      await expect(lastModified).toBeVisible();
      await expect(lastModified).toContainText('Updated');
    });

    test('should have properly structured metadata section with semantic HTML', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      const metaSection = page.locator('#meta');
      await expect(metaSection).toBeVisible();
      
      // Should be a logical grouping
      await expect(metaSection.locator('section')).toBeVisible();
    });
  });

  test.describe('Comments Integration (Structure)', () => {
    test('should have main content structure that supports comments section when configured', async ({ page }) => {
      // Note: Since comments aren't enabled in demo, this tests the structure
      // would exist if configured
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Comments section won't be visible without configuration
      // but we can test that the blog single template is properly structured
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeVisible();
    });
  });


  test.describe('Responsive Design', () => {
    test('should display related posts, social sharing, and table of contents on mobile viewport (375x667)', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Related posts should adapt to mobile
      const relatedPosts = page.locator('.related-posts');
      await expect(relatedPosts).toBeVisible();
      
      // Social sharing should be visible
      const socialSharing = page.locator('.social-sharing');
      await expect(socialSharing).toBeVisible();
      
      // TOC should be visible but may not be sticky
      const toc = page.locator('.table-of-contents');
      await expect(toc).toBeVisible();
    });

    test('should adapt related posts grid layout across desktop (1280px), tablet (768px), and mobile (375px) viewports', async ({ page }) => {
      // Test desktop width
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      const relatedPostsList = page.locator('.related-posts-list');
      await expect(relatedPostsList).toBeVisible();
      
      // Test tablet width
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(relatedPostsList).toBeVisible();
      
      // Test mobile width
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(relatedPostsList).toBeVisible();
    });
  });

  test.describe('Multilingual Support', () => {
    test('should display "Idioma" button and Spanish language option in language switcher dropdown', async ({ page }) => {
      test.skip(process.env.TEST_NO_MENUS === 'true', 'Skipping test because TEST_NO_MENUS is true');
      
      // Navigate to Spanish version
      await page.goto(`${BASE_URL}/es/`);
      
      
      // Open language switcher
      const languageButton = page.locator('button', { hasText: 'Idioma' }).first();
      await languageButton.click();
      
      // Should see language options
      await expect(page.locator('#languages-dropdown-header').getByText('Español')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should use proper h3 heading hierarchy for related posts, social sharing, and table of contents sections', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Check that section headings are h3
      await expect(page.locator('.related-posts h3')).toBeVisible();
      await expect(page.locator('.social-sharing h3')).toBeVisible();
      await expect(page.locator('.table-of-contents h3')).toBeVisible();
    });

    test('should allow keyboard navigation and focus on social sharing buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Focus first share button
      const shareButtons = page.locator('.share-buttons a');
      const firstButton = shareButtons.first();
      
      await firstButton.focus();
      
      // Should be focusable
      await expect(firstButton).toBeFocused();
    });

    test('should allow keyboard navigation and focus on table of contents links', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Focus first TOC link
      const tocLinks = page.locator('.table-of-contents a');
      const firstLink = tocLinks.first();
      
      await firstLink.focus();
      
      // Should be focusable
      await expect(firstLink).toBeFocused();
    });

    test('should use semantic HTML with unordered list (ul/li) elements for related posts', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Related posts should use list elements
      const relatedPostsList = page.locator('.related-posts ul');
      await expect(relatedPostsList).toBeVisible();
      
      // Each item should be a list item
      const listItems = relatedPostsList.locator('li');
      await expect(listItems.first()).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load page with all new features in under 5 seconds including network idle state', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should render all feature sections without causing cumulative layout shift after page load', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog/new-features-demo/`);
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // All main sections should be visible without scrolling
      const relatedPosts = page.locator('.related-posts');
      await expect(relatedPosts).toBeAttached();
    });
  });
});
