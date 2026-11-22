import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

import path from 'path';
import fs from 'fs';

const port = Number(process.env.PLAYWRIGHT_PORT) || 1313;
const baseURL = `http://localhost:${port}`;

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
    // Only e2e specs: tests/scripts/*.test.js are plain node guards (npm run test:scripts).
    testDir: './tests/e2e',
    // Platform-agnostic snapshot naming (removes -linux, -darwin, -win32 suffixes)
    snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
    use: {
        baseURL,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
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
    // GitHub-hosted runners have 4 vCPUs; the default would use only half of them.
    workers: process.env.CI ? 4 : undefined,
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
        command: `cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --bind 0.0.0.0 --port ${port} --baseURL ${baseURL}/`,
        url: baseURL,
        reuseExistingServer: true,
    },
    preserveOutput: 'always',
});