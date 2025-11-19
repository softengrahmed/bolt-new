import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright Test Configuration
 * 
 * This configuration supports:
 * - Multi-browser testing (Chromium, Firefox, WebKit)
 * - Parallel execution with 4 workers
 * - Smart retry strategies
 * - Comprehensive reporting
 * - Screenshot and video capture on failures
 * - Trace viewer integration
 */

export default defineConfig({
  // Test directory
  testDir: path.join(__dirname, '../tests'),
  
  // Test match patterns
  testMatch: '**/*.spec.ts',
  
  // Maximum time one test can run
  timeout: 60 * 1000,
  
  // Global timeout for the whole test run
  globalTimeout: 60 * 60 * 1000, // 1 hour
  
  // Expect timeout for assertions
  expect: {
    timeout: 10 * 1000,
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry strategy: 2 retries locally, 0 in CI (configure per environment)
  retries: process.env.CI ? 0 : 2,
  
  // Parallel execution: 4 workers for optimal performance
  workers: process.env.CI ? 4 : 4,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'tests/reports/playwright-html-report', open: 'never' }],
    ['json', { outputFile: 'tests/reports/test-results.json' }],
    ['junit', { outputFile: 'tests/reports/junit-results.xml' }],
    ['list'],
    ['blob', { outputDir: 'tests/reports/blob-report' }],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Collect trace on failure
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on first retry failure
    video: 'retain-on-failure',
    
    // Action timeout
    actionTimeout: 15 * 1000,
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile browsers (optional - uncomment if needed)
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  
  // Output directory for test artifacts
  outputDir: 'tests/test-results',
  
  // Web server configuration (for local development)
  webServer: process.env.CI ? undefined : {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
