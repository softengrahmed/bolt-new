import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

/**
 * DashboardPage - Page Object Model for the dashboard page
 * Represents the main dashboard after login
 */
export class DashboardPage extends BasePage {
  // Locators
  readonly pageHeading: Locator;
  readonly userProfile: Locator;
  readonly logoutButton: Locator;
  readonly settingsButton: Locator;
  readonly mainContent: Locator;
  readonly sidebarMenu: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.pageHeading = page.locator('h1, h2').first();
    this.userProfile = page.locator('[data-testid="user-profile"], .user-profile, button:has-text("Profile")');
    this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")');
    this.settingsButton = page.locator('button:has-text("Settings"), a:has-text("Settings")');
    this.mainContent = page.locator('main, [role="main"], .main-content');
    this.sidebarMenu = page.locator('aside, [role="complementary"], .sidebar');
  }

  /**
   * Navigate to dashboard page
   */
  async goto(): Promise<void> {
    await this.navigate('/dashboard');
    await this.waitForPageLoad();
  }

  /**
   * Verify dashboard page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.assertVisible(this.mainContent, 'Main content should be visible');
    await this.assertVisible(this.pageHeading, 'Page heading should be visible');
  }

  /**
   * Get dashboard heading text
   */
  async getHeadingText(): Promise<string> {
    return await this.getText(this.pageHeading);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.click(this.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Navigate to settings
   */
  async goToSettings(): Promise<void> {
    await this.click(this.settingsButton);
    await this.waitForNavigation();
  }

  /**
   * Check if user is logged in (profile is visible)
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.userProfile);
  }

  /**
   * Verify dashboard elements are present
   */
  async verifyDashboardElements(): Promise<void> {
    await this.assertVisible(this.mainContent, 'Main content should be visible');
    await this.assertVisible(this.pageHeading, 'Page heading should be visible');
  }
}
