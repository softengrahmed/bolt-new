import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/pages/login-page';
import { DashboardPage } from '../../page-objects/pages/dashboard-page';
import { DataHelpers } from '../../helpers/data-helpers';
import { WaitHelpers } from '../../helpers/wait-helpers';

/**
 * Critical Tests - User Authentication
 * Tests for core authentication functionality
 * These tests cover critical user journeys that must work
 */
test.describe('User Authentication', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let dataHelpers: DataHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    dataHelpers = new DataHelpers();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Load test user data
    const testUser = dataHelpers.getTestUser('standard');

    // Navigate to login page
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Perform login
    await loginPage.login(testUser.username, testUser.password);

    // Wait for navigation to dashboard
    await WaitHelpers.waitForLoadState(page, 'domcontentloaded');

    // Verify successful login by checking URL or dashboard elements
    // Note: Adjust based on actual application behavior
    const currentUrl = await page.url();
    expect(currentUrl).toContain('dashboard');
  });

  test('should show error message with invalid credentials', async () => {
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Attempt login with invalid credentials
    await loginPage.login('invalid@user.com', 'wrongpassword');

    // Wait for error message
    await WaitHelpers.wait(2000);

    // Verify error message is displayed
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
  });

  test('should not login with empty credentials', async () => {
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Click login button without entering credentials
    await loginPage.click(loginPage.loginButton);

    // Verify form validation prevents submission
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('login');
  });

  test('should display login form elements correctly', async () => {
    await loginPage.goto();

    // Verify all form elements are visible
    await loginPage.assertVisible(loginPage.usernameInput, 'Username input should be visible');
    await loginPage.assertVisible(loginPage.passwordInput, 'Password input should be visible');
    await loginPage.assertVisible(loginPage.loginButton, 'Login button should be visible');
  });
});
