import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright Test Configuration
 * Main configuration file for test execution across all environments
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory structure
  testDir: path.join(process.cwd(), 'tests'),
  
  // Test matching pattern
  testMatch: '**/*.spec.ts',
  
  // Artifacts and output directories
  outputDir: path.join(process.cwd(), 'test-results'),
  
  // Timeout configurations
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },
  
  // Global setup and teardown
  // globalSetup: require.resolve('./tests/config/global-setup.ts'),
  // globalTeardown: require.resolve('./tests/config/global-teardown.ts'),
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // Fail in CI if test.only is used
  retries: process.env.CI ? 0 : 2, // No retries in CI, 2 retries locally
  workers: process.env.CI ? 4 : 4, // 4 parallel workers
  
  // Reporting configuration
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false
    }]
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    // Browser context options
    trace: 'on-first-retry', // Collect trace on first retry
    screenshot: 'only-on-failure', // Capture screenshots on failure
    video: 'retain-on-failure', // Record video on failure
    
    // Viewport settings
    viewport: { width: 1920, height: 1080 },
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Accept downloads
    acceptDownloads: true,
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
  
  // Browser projects configuration
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ]
        }
      },
    },
  ],
  
  // Web server configuration (optional - for local development)
  // Uncomment if you want Playwright to start your dev server
  /*
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  */
});
