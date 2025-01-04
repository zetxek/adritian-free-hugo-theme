import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:1313',
        screenshot: 'on',
        trace: 'retain-on-failure',
    },
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],
    outputDir: 'test-results',
    webServer: {
        command: 'cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --bind 0.0.0.0',
        url: 'http://localhost:1313',
        reuseExistingServer: true,
    },
};

export default config;