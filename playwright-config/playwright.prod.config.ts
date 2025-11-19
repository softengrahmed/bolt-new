import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

/**
 * Playwright Configuration for Production Environment
 * 
 * Extends base configuration with production-specific settings:
 * - Production URL
 * - Conservative timeout settings
 * - No retries to avoid impacting production
 * - Smoke test focus
 */

export default defineConfig({
  ...baseConfig,
  
  // Only run smoke tests in production
  testMatch: '**/smoke/**/*.spec.ts',
  
  use: {
    ...baseConfig.use,
    baseURL: process.env.PRODUCTION_URL || 'https://app.example.com',
    
    // Conservative timeouts for production
    actionTimeout: 25 * 1000,
    navigationTimeout: 60 * 1000,
  },
  
  // No retries in production to avoid load
  retries: 0,
  
  // Sequential execution in production
  workers: 1,
  fullyParallel: false,
  
  // No web server needed - testing deployed production
  webServer: undefined,
  
  // Production-specific reporter configuration
  reporter: [
    ['html', { outputFolder: 'tests/reports/production-html-report', open: 'never' }],
    ['json', { outputFile: 'tests/reports/production-results.json' }],
    ['junit', { outputFile: 'tests/reports/production-junit-results.xml' }],
    ['list'],
  ],
});
