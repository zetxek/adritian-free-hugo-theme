import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const outputFolder = path.join(process.cwd(), 'playwright-report');
const testResults = path.join(process.cwd(), 'test-results');

const config: PlaywrightTestConfig = {
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:1313',
        screenshot: 'on',
        trace: 'retain-on-failure',
        video: 'on-first-retry',
    },
    reporter: [
        ['html', { outputFolder }],
        ['list']
    ],
    outputDir: testResults,
    webServer: {
        command: 'cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --bind 0.0.0.0',
        url: 'http://localhost:1313',
        reuseExistingServer: true,
    },
    preserveOutput: 'always',
};

export default config;