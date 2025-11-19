import { Page, Locator } from '@playwright/test';

/**
 * HeaderComponent - Reusable component for page header/navigation
 * Represents common header elements across pages
 */
export class HeaderComponent {
  private readonly page: Page;
  
  // Locators
  readonly logo: Locator;
  readonly navigationLinks: Locator;
  readonly searchButton: Locator;
  readonly userMenu: Locator;
  readonly notificationBell: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.logo = page.locator('header img, header svg, [data-testid="logo"]').first();
    this.navigationLinks = page.locator('header nav a, header [role="navigation"] a');
    this.searchButton = page.locator('header button:has-text("Search"), header [aria-label="Search"]');
    this.userMenu = page.locator('header [data-testid="user-menu"], header .user-menu');
    this.notificationBell = page.locator('header [aria-label="Notifications"], header .notifications');
  }

  /**
   * Click on the logo to navigate home
   */
  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  /**
   * Click on a navigation link by text
   * @param linkText - Text of the navigation link
   */
  async clickNavigationLink(linkText: string): Promise<void> {
    await this.page.locator(`header nav a:has-text("${linkText}")`).click();
  }

  /**
   * Open search
   */
  async openSearch(): Promise<void> {
    await this.searchButton.click();
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  /**
   * Check if header is visible
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.logo.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all navigation link texts
   */
  async getNavigationLinks(): Promise<string[]> {
    return await this.navigationLinks.allTextContents();
  }
}
