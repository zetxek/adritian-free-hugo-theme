# E2E Tests

This directory contains end-to-end tests for the Adritian Hugo theme using Playwright.

## Test Structure

### Existing Tests
- `basic.spec.ts` - Basic theme functionality (homepage, theme switching, navigation)
- `blog.spec.ts` - Blog page content and navigation
- `theme-switch.spec.ts` - Theme switching functionality
- `language-switch.spec.ts` - Language switching functionality
- `experience.spec.ts` - Experience section tests
- `search.spec.ts` - Search functionality
- `html-validation.spec.ts` - HTML validation
- `tags.spec.ts` - Tag pages
- `contact.spec.ts` - Contact form
- `list-style.spec.ts` - List style variations
- `sections.spec.ts` - Section rendering
- `no-menus.spec.ts` - Tests for configurations without menus

### New Features Tests
- **`new-features.spec.ts`** - Comprehensive tests for the new blog features added in the latest release:
  - **Related Posts**: Tests for related posts display, clickability, and tag rendering
  - **Social Sharing Buttons**: Tests for all sharing platforms, correct links, and ARIA labels
  - **Table of Contents**: Tests for TOC display, navigation, and sticky positioning
  - **Enhanced Reading Metadata**: Tests for reading time, word count, publish date, and last modified date
  - **Comments Integration**: Structure tests for comment system integration
  - **Dark Mode Support**: Tests for all new features in dark mode
  - **Responsive Design**: Tests for mobile and tablet viewports
  - **Multilingual Support**: Tests for translated labels
  - **Accessibility**: Tests for heading hierarchy, keyboard navigation, and semantic HTML
  - **Performance**: Tests for page load time and layout stability

## Running Tests

### Run all tests
```bash
npm test
```

### Run E2E tests only
```bash
npm run test:e2e
```

### Run new features tests only
```bash
npm run test:e2e:new-features
```

### Run tests without menus
```bash
npm run test:e2e:no-menus
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

## Test Coverage for New Features

The `new-features.spec.ts` test suite includes **27 comprehensive tests** covering:

### Related Posts (3 tests)
- ✅ Display and structure validation
- ✅ Navigation functionality
- ✅ Tag rendering

### Social Sharing Buttons (4 tests)
- ✅ Section display
- ✅ All platform buttons (Twitter, LinkedIn, Facebook, Email)
- ✅ Correct share URLs
- ✅ ARIA labels for accessibility

### Table of Contents (4 tests)
- ✅ TOC display when enabled
- ✅ Navigation links generation
- ✅ Section navigation functionality
- ✅ Sticky positioning

### Enhanced Reading Metadata (5 tests)
- ✅ Reading time display
- ✅ Word count display
- ✅ Publish date display
- ✅ Last modified date display
- ✅ Metadata structure

### Dark Mode Support (1 test)
- ✅ All features visible and functional in dark mode

### Responsive Design (2 tests)
- ✅ Mobile viewport rendering
- ✅ Responsive grid adaptation

### Multilingual Support (1 test)
- ✅ Translated labels in different languages

### Accessibility (4 tests)
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation for share buttons
- ✅ Keyboard navigation for TOC
- ✅ Semantic HTML structure

### Performance (2 tests)
- ✅ Page load time
- ✅ Layout stability (no layout shift)

### Comments Integration (1 test)
- ✅ Structure validation for comment systems

## Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

3. Build the example site:
```bash
npm run build
```

## Configuration

Tests use the Playwright configuration in `playwright.config.ts` which:
- Runs tests against `http://localhost:1313`
- Automatically starts the Hugo server
- Captures screenshots and videos on test failures
- Generates HTML reports

## Writing New Tests

When adding new features to the theme:
1. Create or update test files in `tests/e2e/`
2. Follow existing patterns for test structure
3. Include tests for:
   - Visual rendering
   - Functionality
   - Accessibility
   - Dark mode compatibility
   - Responsive design
   - Multilingual support (if applicable)

## CI/CD Integration

Tests are designed to run in CI environments with the `TEST_NO_MENUS` environment variable to handle different configurations.

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report playwright-report
```

## Debugging Failed Tests

1. Run in UI mode to see tests execute in real-time
2. Use `--debug` flag to step through tests
3. Check screenshots and videos in `test-results/`
4. Review traces with: `npx playwright show-trace <trace-file>`
