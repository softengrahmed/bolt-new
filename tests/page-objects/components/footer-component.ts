import { Page, Locator } from '@playwright/test';

/**
 * FooterComponent - Reusable component for page footer
 * Represents common footer elements across pages
 */
export class FooterComponent {
  private readonly page: Page;
  
  // Locators
  readonly footerContainer: Locator;
  readonly copyrightText: Locator;
  readonly footerLinks: Locator;
  readonly socialMediaLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.footerContainer = page.locator('footer, [role="contentinfo"]');
    this.copyrightText = page.locator('footer p:has-text("©"), footer [class*="copyright"]');
    this.footerLinks = page.locator('footer a');
    this.socialMediaLinks = page.locator('footer [aria-label*="social" i], footer .social-links a');
  }

  /**
   * Click on a footer link by text
   * @param linkText - Text of the footer link
   */
  async clickFooterLink(linkText: string): Promise<void> {
    await this.page.locator(`footer a:has-text("${linkText}")`).click();
  }

  /**
   * Get copyright text
   */
  async getCopyrightText(): Promise<string> {
    return (await this.copyrightText.textContent()) || '';
  }

  /**
   * Check if footer is visible
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.footerContainer.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all footer link texts
   */
  async getFooterLinks(): Promise<string[]> {
    return await this.footerLinks.allTextContents();
  }

  /**
   * Verify footer is displayed
   */
  async verifyFooterDisplayed(): Promise<boolean> {
    return await this.isVisible();
  }
}
