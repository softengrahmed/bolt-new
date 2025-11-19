import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

/**
 * Playwright Configuration for Staging Environment
 * Extends base configuration with staging-specific settings
 */
export default defineConfig({
  ...baseConfig,
  
  // Staging-specific settings
  use: {
    ...baseConfig.use,
    baseURL: process.env.STAGING_URL || 'https://staging.bolt-new.app',
    
    // Extended timeouts for staging environment
    navigationTimeout: 45 * 1000,
    actionTimeout: 15 * 1000,
  },
  
  // Staging-specific test matching
  // testMatch: ['**/e2e/**/*.spec.ts', '**/smoke/**/*.spec.ts'],
  
  // Retries for staging
  retries: 1,
  
  // Parallel workers for staging
  workers: 4,
});
