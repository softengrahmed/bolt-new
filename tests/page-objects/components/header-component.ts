import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

/**
 * HeaderComponent - Reusable component for application header
 * 
 * Represents common header elements across pages
 */
export class HeaderComponent extends BasePage {
  // Locators
  private readonly header: Locator;
  private readonly logo: Locator;
  private readonly navigationMenu: Locator;
  private readonly userMenu: Locator;
  private readonly settingsButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.header = page.locator('header, nav').first();
    this.logo = this.header.locator('img, [data-testid="logo"]').first();
    this.navigationMenu = this.header.locator('[role="navigation"], nav');
    this.userMenu = page.locator('[data-testid="user-menu"]').or(page.getByRole('button', { name: /user|account|profile/i }));
    this.settingsButton = page.getByRole('button', { name: /settings|preferences/i });
  }

  /**
   * Verify header is visible
   */
  async verifyHeaderVisible(): Promise<void> {
    await this.assertVisible(this.header, 'Header should be visible');
  }

  /**
   * Click on logo
   */
  async clickLogo(): Promise<void> {
    await this.click(this.logo);
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    if (await this.isVisible(this.userMenu)) {
      await this.click(this.userMenu);
    }
  }

  /**
   * Click settings button
   */
  async openSettings(): Promise<void> {
    if (await this.isVisible(this.settingsButton)) {
      await this.click(this.settingsButton);
    }
  }

  /**
   * Navigate using header links
   * @param linkText - Text of the link to click
   */
  async navigateToLink(linkText: string): Promise<void> {
    const link = this.header.getByRole('link', { name: new RegExp(linkText, 'i') });
    await this.click(link);
  }

  /**
   * Verify logo is clickable
   */
  async verifyLogoClickable(): Promise<boolean> {
    return await this.isEnabled(this.logo);
  }
}
