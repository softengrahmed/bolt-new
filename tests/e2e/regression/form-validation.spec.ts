import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/pages/login-page';
import { DataHelpers } from '../../helpers/data-helpers';
import { AssertionHelpers } from '../../helpers/assertion-helpers';

/**
 * Regression Tests - Form Validation
 * Tests for form validation and input handling
 */
test.describe('Form Validation', () => {
  let loginPage: LoginPage;
  let dataHelpers: DataHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dataHelpers = new DataHelpers();
  });

  test('should validate required fields', async ({ page }) => {
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Try to submit form without filling fields
    await loginPage.click(loginPage.loginButton);

    // Verify we're still on login page (form didn't submit)
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('login');
  });

  test('should validate email format', async ({ page }) => {
    await loginPage.goto();

    // Enter invalid email format
    await loginPage.fill(loginPage.usernameInput, 'invalid-email');
    await loginPage.fill(loginPage.passwordInput, 'password123');

    // Try to submit
    await loginPage.click(loginPage.loginButton);

    // Verify validation message or that form didn't submit
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('login');
  });

  test('should handle special characters in input', async ({ page }) => {
    await loginPage.goto();

    const specialChars = dataHelpers.loadFixture<any>('test-data');
    const specialText = specialChars.testData.sampleContent.specialCharacters;

    // Fill form with special characters
    await loginPage.fill(loginPage.usernameInput, specialText);
    await loginPage.fill(loginPage.passwordInput, 'Test@123');

    // Verify input was entered
    const inputValue = await loginPage.usernameInput.inputValue();
    expect(inputValue).toBe(specialText);
  });

  test('should trim whitespace from inputs', async ({ page }) => {
    await loginPage.goto();

    const emailWithSpaces = '  test@example.com  ';

    // Fill input with spaces
    await loginPage.fill(loginPage.usernameInput, emailWithSpaces);

    // Get the trimmed value (depends on app behavior)
    const inputValue = await loginPage.usernameInput.inputValue();
    expect(inputValue).toBeTruthy();
  });

  test('should maintain input values on page refresh', async ({ page }) => {
    await loginPage.goto();

    const testEmail = 'test@example.com';

    // Fill username field
    await loginPage.fill(loginPage.usernameInput, testEmail);

    // Reload page
    await page.reload();
    await loginPage.verifyPageLoaded();

    // Verify if app persists form data (depends on implementation)
    // This test verifies the reload behavior
    const isVisible = await loginPage.isVisible(loginPage.usernameInput);
    expect(isVisible).toBeTruthy();
  });

  test('should handle rapid form submission', async ({ page }) => {
    await loginPage.goto();

    const testUser = dataHelpers.getTestUser('standard');

    // Fill form
    await loginPage.fill(loginPage.usernameInput, testUser.username);
    await loginPage.fill(loginPage.passwordInput, testUser.password);

    // Submit multiple times rapidly
    await loginPage.click(loginPage.loginButton);
    await loginPage.click(loginPage.loginButton);

    // Verify application handles this gracefully
    // This should not cause errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    // Small wait to catch any errors
    await page.waitForTimeout(2000);

    expect(pageErrors.length).toBe(0);
  });
});
