import { Page, Locator } from '@playwright/test';

/**
 * NavigationComponent - Reusable component for navigation menu
 * Represents common navigation elements (sidebar, menu)
 */
export class NavigationComponent {
  private readonly page: Page;
  
  // Locators
  readonly navigationContainer: Locator;
  readonly menuItems: Locator;
  readonly homeMenuItem: Locator;
  readonly settingsMenuItem: Locator;
  readonly menuToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.navigationContainer = page.locator('nav, [role="navigation"], aside.sidebar');
    this.menuItems = page.locator('nav a, nav button, [role="navigation"] a');
    this.homeMenuItem = page.locator('nav a:has-text("Home"), [role="navigation"] a:has-text("Home")');
    this.settingsMenuItem = page.locator('nav a:has-text("Settings"), [role="navigation"] a:has-text("Settings")');
    this.menuToggle = page.locator('button[aria-label*="menu" i], button.menu-toggle');
  }

  /**
   * Navigate to a menu item by text
   * @param itemText - Text of the menu item
   */
  async navigateTo(itemText: string): Promise<void> {
    await this.page.locator(`nav a:has-text("${itemText}"), [role="navigation"] a:has-text("${itemText}")`).click();
  }

  /**
   * Navigate to home
   */
  async goToHome(): Promise<void> {
    await this.homeMenuItem.click();
  }

  /**
   * Navigate to settings
   */
  async goToSettings(): Promise<void> {
    await this.settingsMenuItem.click();
  }

  /**
   * Toggle navigation menu (for mobile)
   */
  async toggleMenu(): Promise<void> {
    await this.menuToggle.click();
  }

  /**
   * Check if navigation is visible
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.navigationContainer.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all menu item texts
   */
  async getMenuItems(): Promise<string[]> {
    return await this.menuItems.allTextContents();
  }

  /**
   * Verify menu item is active
   * @param itemText - Text of the menu item
   */
  async isMenuItemActive(itemText: string): Promise<boolean> {
    const item = this.page.locator(`nav a:has-text("${itemText}")`);
    const classes = await item.getAttribute('class');
    return classes?.includes('active') || false;
  }
}
