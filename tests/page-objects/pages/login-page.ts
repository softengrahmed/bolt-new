import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

/**
 * LoginPage - Page Object Model for the login page
 * Handles authentication and login functionality
 */
export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameInput = page.locator('input[name="username"], input[type="email"], input[placeholder*="email" i]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
    this.errorMessage = page.locator('[role="alert"], .error-message, .alert-error');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password"), a:has-text("Reset Password")');
    this.signUpLink = page.locator('a:has-text("Sign up"), a:has-text("Register")');
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   * @param username - Username or email
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Verify login page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.assertVisible(this.usernameInput, 'Username input should be visible');
    await this.assertVisible(this.passwordInput, 'Password input should be visible');
    await this.assertVisible(this.loginButton, 'Login button should be visible');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click sign up link
   */
  async clickSignUp(): Promise<void> {
    await this.click(this.signUpLink);
  }
}
