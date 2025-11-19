import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

/**
 * Playwright Configuration for Staging Environment
 * 
 * Extends base configuration with staging-specific settings:
 * - Staging URL
 * - Extended timeouts for slower environment
 * - Retry strategy optimized for staging
 */

export default defineConfig({
  ...baseConfig,
  
  use: {
    ...baseConfig.use,
    baseURL: process.env.STAGING_URL || 'https://staging.example.com',
    
    // Extended timeouts for staging environment
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
  },
  
  // Staging-specific retry strategy
  retries: 1,
  
  // Moderate parallelization for staging
  workers: 2,
  
  // No web server needed - testing deployed staging
  webServer: undefined,
  
  // Staging-specific reporter configuration
  reporter: [
    ['html', { outputFolder: 'tests/reports/staging-html-report', open: 'never' }],
    ['json', { outputFile: 'tests/reports/staging-results.json' }],
    ['junit', { outputFile: 'tests/reports/staging-junit-results.xml' }],
    ['list'],
  ],
});
