/**
 * Staging Environment Configuration
 * Contains environment-specific settings for staging
 */
export const stagingConfig = {
  baseURL: process.env.STAGING_URL || 'https://staging.bolt-new.app',
  apiURL: process.env.STAGING_API_URL || 'https://api-staging.bolt-new.app',
  
  // Timeout configurations
  timeouts: {
    navigation: 45000,
    action: 15000,
    assertion: 10000,
  },
  
  // Authentication
  auth: {
    enabled: true,
    tokenExpiry: 3600, // 1 hour
  },
  
  // Feature flags
  features: {
    newUI: true,
    betaFeatures: true,
    debugMode: true,
  },
  
  // Browser settings
  browser: {
    headless: true,
    slowMo: 0,
    devtools: false,
  },
  
  // Retry configuration
  retry: {
    enabled: true,
    maxAttempts: 1,
  },
  
  // Reporting
  reporting: {
    screenshots: 'only-on-failure',
    videos: 'retain-on-failure',
    traces: 'on-first-retry',
  },
};

export default stagingConfig;
