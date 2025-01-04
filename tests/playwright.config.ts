import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:1313',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --bind 0.0.0.0',
    url: 'http://localhost:1313',
    reuseExistingServer: true,
  },
};

export default config;