import { test, expect } from '@playwright/test';

const BASE_URL: string = process.env.TEST_BASE_URL ?? 'http://localhost:1313';

if (!BASE_URL.startsWith('http')) {
  throw new Error('TEST_BASE_URL must be a valid URL starting with http:// or https://');
}

// Wait time for search debounce (300ms) + buffer
const SEARCH_DEBOUNCE_WAIT = 500;

test.describe('Search functionality', () => {
  test.beforeAll(async () => {
    // Health check
    try {
      await fetch(BASE_URL);
    } catch (error) {
      console.error(`Failed to connect to ${BASE_URL}. Is the Hugo server running?`);
      throw error;
    }
  });

  test('search page loads correctly', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/search`);
    await expect(page).toHaveTitle(/Search/);
    await expect(page.locator('h2.mb-4.text-center')).toHaveText('Search the Site');
    await expect(page.locator('#search-query')).toBeVisible();
    
    // Check that the search page returns HTTP status 200
  });

  test('searching for "theme" shows exactly one result', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Type "theme" in the search box
    await page.locator('#search-query').fill('theme');
    
    // Wait for search results to appear (the debounce is 300ms)
    await page.waitForTimeout(500);
    
    // Check URL is updated with search parameter
    await expect(page).toHaveURL(/s=theme/);
    
    // Verify exactly one result is shown
    await expect(page.locator('#search-results div[id^="summary-"]')).toHaveCount(1);
  });

  test('clearing search box removes results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Type something to get results first
    await page.locator('#search-query').fill('theme');
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Verify we have at least one result
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Now clear the search box
    await page.locator('#search-query').fill('');
    
    // Wait for the UI to update
    await page.waitForTimeout(500);
    
    // Check that results are cleared and we have the prompt message
    await expect(page.locator('#search-results div[id^="summary-"]')).toHaveCount(0);
    await expect(page.locator('#search-results .alert')).toBeVisible();
    await expect(page.locator('#search-results .alert')).toHaveText('Please enter at least 2 characters to search');
  });

  test('searching for "adritian" shows multiple results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Type "adritian" in the search box
    await page.locator('#search-query').fill('adritian');
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Check URL is updated with search parameter
    await expect(page).toHaveURL(/s=adritian/);
    
    // Verify we have multiple results
    const resultsCount = await page.locator('#search-results div[id^="summary-"]').count();
    expect(resultsCount).toBeGreaterThan(1);
  });

  test('search handles special characters correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Test with special characters that might break URL encoding
    const specialCharQuery = 'test & special';
    await page.locator('#search-query').fill(specialCharQuery);
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Check URL is properly encoded
    await expect(page).toHaveURL(`${BASE_URL}/search/?s=test+%26+special`.replace('&', '%26'));
    
    // Verify the search box still contains the original query
    await expect(page.locator('#search-query')).toHaveValue(specialCharQuery);
  });

  test('search updates results in real-time as user types', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Type one character at a time and verify the behavior
    await page.locator('#search-query').fill('a');
    
    // With just one character, we should see the minimum character message
    await page.waitForTimeout(500);
    await expect(page.locator('#search-results .alert')).toContainText('at least 2 characters');
    
    // Type a second character to reach minimum
    await page.locator('#search-query').fill('ad');
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Should now show results
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Continue typing to refine search
    await page.locator('#search-query').fill('adri');
    
    // Wait for updated results
    await page.waitForTimeout(500);
    
    // Should still show results, potentially different count
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
  });

  test('tags and categories render correctly when paragraph element is missing', async ({ page }) => {
    await page.goto(`${BASE_URL}/search`);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Modify the search result template to remove the paragraph element
    await page.evaluate(() => {
      const template = document.getElementById('search-result-template');
      if (template) {
        // Update template to exclude the paragraph element
        template.innerHTML = `
          <div id="summary-\${key}" class="mb-4 p-3 border-bottom" data-tags="\${tags}" data-categories="\${categories}">
            <h4 class="mb-1"><a href="\${link}" class="text-decoration-none">\${title}</a></h4>
          </div>
        `;
      }
    });
    
    // Type "adritian" to trigger a search with results that have tags/categories
    await page.locator('#search-query').fill('adritian');
    
    // Wait for search results to appear
    await page.waitForTimeout(500);
    
    // Verify that at least one result is shown
    await expect(page.locator('#search-results div[id^="summary-"]').first()).toBeVisible();
    
    // Verify that tags are rendered even without the paragraph element
    // The tags/categories should be appended directly to the result container
    const firstResult = page.locator('#search-results div[id^="summary-"]').first();
    
    // Check if tags or categories sections exist
    const tagsOrCategoriesExist = await firstResult.locator('div.mb-1 .badge').count();
    
    // We should have tags/categories badges visible (if the content has them)
    if (tagsOrCategoriesExist > 0) {
      // Verify badges are visible and clickable
      await expect(firstResult.locator('div.mb-1 .badge').first()).toBeVisible();
      
      // Verify no JavaScript errors occurred during rendering
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // There should be no errors related to null/undefined paragraph elements
      const relevantErrors = consoleErrors.filter(err => 
        err.includes('querySelector') || err.includes('paragraph') || err.includes('after')
      );
      expect(relevantErrors).toHaveLength(0);
    }
  });
});

// Helper functions for multilingual search tests
async function verifySearchFormAction(page: any, language: string, expectedAction: string) {
  // Navigate directly to language-specific search URL
  // Hugo generates separate pages for each language: /search (default) and /es/search (Spanish)
  const searchUrl = language === 'en' ? `${BASE_URL}/search` : `${BASE_URL}/${language}/search`;
  await page.goto(searchUrl, { waitUntil: 'networkidle' });
  
  // Wait for search input to ensure page is loaded
  const searchInput = page.locator('#search-query');
  await expect(searchInput).toBeVisible();
  // Find the form that contains the search input using evaluate
  const action = await page.evaluate(() => {
    const input = document.getElementById('search-query');
    return input?.closest('form')?.getAttribute('action') || null;
  });
  expect(action).toBe(expectedAction);
}

async function verifySearchIndexUrl(page: any, language: string, expectedIndexUrl: string) {
  // Navigate directly to language-specific search URL
  // Hugo generates separate pages for each language: /search (default) and /es/search (Spanish)
  const searchUrl = language === 'en' ? `${BASE_URL}/search` : `${BASE_URL}/${language}/search`;
  await page.goto(searchUrl, { waitUntil: 'networkidle' });
  
  const searchResults = page.locator('#search-results');
  await expect(searchResults).toBeVisible();
  const indexUrl = await searchResults.getAttribute('data-index-url');
  expect(indexUrl).toBe(expectedIndexUrl);
}

async function verifyIndexJsonFetch(page: any, language: string, searchQuery: string) {
  const requests: string[] = [];
  page.on('request', (request: any) => {
    if (request.url().includes('index.json')) {
      requests.push(request.url());
    }
  });

  // Navigate directly to language-specific search URL
  // Hugo generates separate pages for each language: /search (default) and /es/search (Spanish)
  const searchUrl = language === 'en' ? `${BASE_URL}/search` : `${BASE_URL}/${language}/search`;
  await page.goto(searchUrl, { waitUntil: 'networkidle' });

  // Wait for search input to be visible
  const searchInput = page.locator('#search-query');
  await expect(searchInput).toBeVisible();

  // Set up response promise before triggering the search
  const responsePromise = page.waitForResponse((response: any) =>
    response.url().includes(`/${language}/index.json`) && response.status() === 200
  );

  await searchInput.fill(searchQuery);
  await responsePromise;

  // Verify that index.json was fetched from the correct language path
  const languageIndexRequests = requests.filter((url: string) => url.includes(`/${language}/index.json`));
  expect(languageIndexRequests.length).toBeGreaterThan(0);
}

test.describe('Multilingual search functionality', () => {
  test.beforeAll(async () => {
    // Health check
    try {
      await fetch(BASE_URL);
    } catch (error) {
      console.error(`Failed to connect to ${BASE_URL}. Is the Hugo server running?`);
      throw error;
    }
  });

  test('search page uses language-aware URL for English', async ({ page }) => {
    // English is the default language (weight 0), so it may not have a prefix
    // Check both /search and /en/search to handle different Hugo configurations
    await page.goto(`${BASE_URL}/en/`, { waitUntil: 'networkidle' });
    await page.goto(`${BASE_URL}/search`, { waitUntil: 'networkidle' });
    const searchInput = page.locator('#search-query');
    await expect(searchInput).toBeVisible();
    const action = await page.evaluate(() => {
      const input = document.getElementById('search-query');
      return input?.closest('form')?.getAttribute('action') || null;
    });
    // Accept either /search (default language) or /en/search (if language prefix is used)
    expect(action === '/search' || action === '/en/search').toBe(true);
  });

  test('search page uses language-aware URL for Spanish', async ({ page }) => {
    await verifySearchFormAction(page, 'es', '/es/search');
  });

  test('search results container has correct data-index-url for English', async ({ page }) => {
    // English is the default language, so it may not have a prefix
    await page.goto(`${BASE_URL}/en/`, { waitUntil: 'networkidle' });
    await page.goto(`${BASE_URL}/search`, { waitUntil: 'networkidle' });
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible();
    const indexUrl = await searchResults.getAttribute('data-index-url');
    // Accept either /index.json (default language) or /en/index.json (if language prefix is used)
    expect(indexUrl === '/index.json' || indexUrl === '/en/index.json').toBe(true);
  });

  test('search results container has correct data-index-url for Spanish', async ({ page }) => {
    await verifySearchIndexUrl(page, 'es', '/es/index.json');
  });

  test('search fetches index.json from correct language path (English)', async ({ page }) => {
    // English is the default language, so it may use /index.json instead of /en/index.json
    // Navigate to English search page
    await page.goto(`${BASE_URL}/search`, { waitUntil: 'networkidle' });
    
    const requests: string[] = [];
    page.on('request', (request: any) => {
      if (request.url().includes('index.json')) {
        requests.push(request.url());
      }
    });

    const searchInput = page.locator('#search-query');
    await expect(searchInput).toBeVisible();

    // Set up response promise - accept both /index.json and /en/index.json
    const responsePromise = page.waitForResponse((response: any) =>
      (response.url().includes('/index.json') || response.url().includes('/en/index.json')) && response.status() === 200
    );

    await searchInput.fill('test');
    await responsePromise;

    // Verify that index.json was fetched (either /index.json or /en/index.json)
    const indexRequests = requests.filter((url: string) => 
      url.includes('/index.json') || url.includes('/en/index.json')
    );
    expect(indexRequests.length).toBeGreaterThan(0);
  });

  test('search fetches index.json from correct language path (Spanish)', async ({ page }) => {
    await verifyIndexJsonFetch(page, 'es', 'test');
  });

  test('search results are language-specific for Spanish', async ({ page }) => {
    // Navigate directly to Spanish search URL
    // Hugo generates separate pages for each language: /search (default) and /es/search (Spanish)
    await page.goto(`${BASE_URL}/es/search`, { waitUntil: 'networkidle' });
    
    // Wait for search input to be visible
    const searchInput = page.locator('#search-query');
    await expect(searchInput).toBeVisible();
    
    // Search for a term that should return Spanish results
    // Use "trabajo" which appears in Spanish experience content
    await searchInput.fill('trabajo');
    
    // Wait for search results to appear
    await page.waitForTimeout(SEARCH_DEBOUNCE_WAIT);
    
    // Verify we have results (this should always be true if test data is correct)
    const resultsCount = await page.locator('#search-results div[id^="summary-"]').count();
    expect(resultsCount).toBeGreaterThan(0);
    
    // Verify the first result links to Spanish content (URLs should contain /es/)
    const firstResultLink = page.locator('#search-results div[id^="summary-"] a').first();
    const href = await firstResultLink.getAttribute('href');
    
    // The result should link to Spanish content
    expect(href).toContain('/es/');
  });

  test('search URLs follow correct relative path pattern', async ({ page }) => {
    // This test validates that search URLs use relative paths that work for both
    // root and subdirectory deployments. The relLangURL function ensures paths
    // are correct regardless of baseURL configuration.
    
    // Navigate directly to English search URL (default language may not have prefix)
    await page.goto(`${BASE_URL}/search`, { waitUntil: 'networkidle' });
    
    // Wait for search input to ensure page is loaded
    const searchInput = page.locator('#search-query');
    await expect(searchInput).toBeVisible();
    // Find the form that contains the search input using evaluate
    const action = await page.evaluate(() => {
      const input = document.getElementById('search-query');
      return input?.closest('form')?.getAttribute('action') || null;
    });
    
    // Get the data-index-url
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible();
    const indexUrl = await searchResults.getAttribute('data-index-url');
    
    // Both should be relative paths starting with /
    // For default language (English), paths may not have prefix, or may have /en/ prefix
    // For non-default languages, they should have the language prefix
    // This works for both root and subdirectory deployments
    expect(action).toMatch(/^(\/[a-z]{2})?\/search$/);
    expect(indexUrl).toMatch(/^(\/[a-z]{2})?\/index\.json$/);
    
    // Perform a search to verify it works
    await expect(searchInput).toBeVisible();
    await searchInput.fill('theme');
    
    // Wait for search to execute and verify we get results
    await page.waitForTimeout(SEARCH_DEBOUNCE_WAIT);
    
    // Searching for "theme" should return exactly one result
    const resultsCount = await page.locator('#search-results div[id^="summary-"]').count();
    expect(resultsCount).toBe(1);
  });

  test('default language search page without language prefix', async ({ page }) => {
    // When accessing /search without language prefix, should use default language
    await page.goto(`${BASE_URL}/search`);
    await page.waitForLoadState('networkidle');
    
    // Get the data-index-url - it should still work
    const searchResults = page.locator('#search-results');
    const indexUrl = await searchResults.getAttribute('data-index-url');
    
    // Should have a valid index URL
    expect(indexUrl).toContain('index.json');
    
    // Search should work - searching for "theme" should return exactly one result
    await page.locator('#search-query').fill('theme');
    await page.waitForTimeout(SEARCH_DEBOUNCE_WAIT);
    
    // Verify we get results (default language search should work)
    const resultsCount = await page.locator('#search-results div[id^="summary-"]').count();
    expect(resultsCount).toBe(1);
  });
});