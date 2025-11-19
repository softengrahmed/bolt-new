/**
 * Production Environment Configuration
 * 
 * Contains environment-specific settings for production
 * NOTE: Only smoke tests should run against production
 */

export const productionConfig = {
  baseURL: process.env.PRODUCTION_URL || 'https://app.example.com',
  apiURL: process.env.PRODUCTION_API_URL || 'https://api.example.com',
  timeout: 60000,
  retries: 0, // No retries in production
  workers: 1, // Sequential execution
  
  credentials: {
    testUser: {
      username: process.env.PROD_TEST_USERNAME || '',
      password: process.env.PROD_TEST_PASSWORD || '',
    },
  },
  
  features: {
    enableMocking: false,
    enableTracing: false,
    enableVideoRecording: false,
  },
};
