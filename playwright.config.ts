import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

import path from 'path';
import fs from 'fs';

// Ensure output directories exist
const outputFolder = path.join(process.cwd(), 'playwright-report');
const testResults = path.join(process.cwd(), 'test-results');

// Create directories if they don't exist
[outputFolder, testResults].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

export default defineConfig ({
    testDir: './tests',
    // Platform-agnostic snapshot naming (removes -linux, -darwin, -win32 suffixes)
    snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
    use: {
        baseURL: 'http://localhost:1313',
        screenshot: 'on',
        trace: 'retain-on-failure',
        video: 'on',
    },
    expect: {
        // Configure screenshot comparison threshold for cross-platform compatibility
        toHaveScreenshot: {
            // Pixel difference threshold (0-1, where 1 = 100% difference)
            // Tuned low to catch regressions while tolerating minor font/rendering differences
            threshold: 0.05,
            // Maximum ratio of pixels that can differ (2% of image)
            maxDiffPixelRatio: 0.02,
        },
    },
    // Run all tests in parallel.
    fullyParallel: true,
    // Fail the build on CI if you accidentally left test.only in the source code.
    forbidOnly: !!process.env.CI,

    reporter: 
        process.env.CI ? 
        [
            ['github'],
            ['html', { outputFolder }],
            ['list']
        ] : 
        [
            ['html', { outputFolder }],
            ['list']
        ]
    ,
    outputDir: testResults,
    webServer: {
        command: 'cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --bind 0.0.0.0',
        url: 'http://localhost:1313',
        reuseExistingServer: true,
    },
    preserveOutput: 'always',
});