/**
 * Staging Environment Configuration
 * 
 * Contains environment-specific settings for staging
 */

export const stagingConfig = {
  baseURL: process.env.STAGING_URL || 'https://staging.example.com',
  apiURL: process.env.STAGING_API_URL || 'https://api-staging.example.com',
  timeout: 45000,
  retries: 1,
  workers: 2,
  
  credentials: {
    testUser: {
      username: process.env.STAGING_TEST_USERNAME || 'testuser',
      password: process.env.STAGING_TEST_PASSWORD || 'TestPassword123!',
    },
    adminUser: {
      username: process.env.STAGING_ADMIN_USERNAME || 'admin',
      password: process.env.STAGING_ADMIN_PASSWORD || 'AdminPassword123!',
    },
  },
  
  features: {
    enableMocking: true,
    enableTracing: true,
    enableVideoRecording: true,
  },
};
