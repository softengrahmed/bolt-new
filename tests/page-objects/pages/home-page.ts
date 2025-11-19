import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

/**
 * HomePage - Page Object Model for the application home page
 * Represents the landing page of the bolt-new application
 */
export class HomePage extends BasePage {
  // Locators
  readonly heading: Locator;
  readonly startButton: Locator;
  readonly featureSection: Locator;
  readonly navigationMenu: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.heading = page.locator('h1').first();
    this.startButton = page.locator('button:has-text("Get Started"), a:has-text("Get Started")');
    this.featureSection = page.locator('[data-testid="features"], section.features');
    this.navigationMenu = page.locator('nav, [role="navigation"]');
  }

  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  /**
   * Verify home page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.assertVisible(this.heading, 'Home page heading should be visible');
  }

  /**
   * Click the start/get started button
   */
  async clickStartButton(): Promise<void> {
    await this.click(this.startButton);
  }

  /**
   * Get the main heading text
   */
  async getHeadingText(): Promise<string> {
    return await this.getText(this.heading);
  }

  /**
   * Check if navigation menu is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.isVisible(this.navigationMenu);
  }

  /**
   * Verify home page elements are present
   */
  async verifyHomePageElements(): Promise<void> {
    await this.assertVisible(this.heading, 'Heading should be visible');
    await this.assertVisible(this.navigationMenu, 'Navigation should be visible');
  }
}
