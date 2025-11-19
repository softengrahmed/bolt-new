import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all Page Object Models
 * Provides common functionality and utilities for page interactions
 * 
 * All page objects should extend this class to inherit common methods
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:5173';
  }

  /**
   * Navigate to a specific path
   * @param path - Relative path to navigate to
   */
  async navigate(path: string = ''): Promise<void> {
    const url = `${this.baseURL}${path}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for an element to be visible
   * @param locator - Playwright locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - Playwright locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementHidden(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click on an element with smart wait
   * @param locator - Playwright locator
   */
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input field with text
   * @param locator - Playwright locator
   * @param text - Text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content from an element
   * @param locator - Playwright locator
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) || '';
  }

  /**
   * Check if element is visible
   * @param locator - Playwright locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Take a screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Assert element is visible
   * @param locator - Playwright locator
   * @param message - Custom error message
   */
  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /**
   * Assert element contains text
   * @param locator - Playwright locator
   * @param text - Expected text
   * @param message - Custom error message
   */
  async assertContainsText(
    locator: Locator,
    text: string,
    message?: string
  ): Promise<void> {
    await expect(locator, message).toContainText(text);
  }

  /**
   * Assert page URL
   * @param expectedUrl - Expected URL or regex pattern
   */
  async assertUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  /**
   * Assert page title
   * @param expectedTitle - Expected title or regex pattern
   */
  async assertTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }
}
