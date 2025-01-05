import { PlaywrightTestConfig } from '@playwright/test';
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

const config: PlaywrightTestConfig = {
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:1313',
        screenshot: 'on',
        trace: 'retain-on-failure',
        video: 'on',
        
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