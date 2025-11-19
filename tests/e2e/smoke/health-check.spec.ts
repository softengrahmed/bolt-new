import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home-page';
import { DataHelpers } from '../../helpers/data-helpers';

/**
 * Smoke Tests - Health Check
 * Quick verification that the application is running and accessible
 * These tests should run fast and catch critical failures
 */
test.describe('Application Health Check', () => {
  let homePage: HomePage;
  let dataHelpers: DataHelpers;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    dataHelpers = new DataHelpers();
  });

  test('should load home page successfully', async () => {
    // Navigate to home page
    await homePage.goto();

    // Verify page loads
    await homePage.verifyPageLoaded();

    // Verify page title is set
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should display main heading', async () => {
    await homePage.goto();

    // Verify heading is visible
    await homePage.assertVisible(homePage.heading, 'Main heading should be visible');

    // Verify heading has text content
    const headingText = await homePage.getHeadingText();
    expect(headingText).toBeTruthy();
    expect(headingText.length).toBeGreaterThan(0);
  });

  test('should have navigation menu visible', async () => {
    await homePage.goto();

    // Check if navigation is visible
    const isNavVisible = await homePage.isNavigationVisible();
    expect(isNavVisible).toBeTruthy();
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await homePage.goto();
    await homePage.verifyPageLoaded();

    const loadTime = Date.now() - startTime;

    // Assert page loads within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should return 200 status code', async ({ page }) => {
    const response = await page.goto(homePage.baseURL);

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);
  });

  test('should have valid HTML structure', async ({ page }) => {
    await homePage.goto();

    // Check for essential HTML elements
    const htmlElement = page.locator('html');
    const bodyElement = page.locator('body');

    await expect(htmlElement).toBeAttached();
    await expect(bodyElement).toBeAttached();
  });
});
