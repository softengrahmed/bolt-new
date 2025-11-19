import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all Page Objects
 * 
 * Provides common functionality:
 * - Navigation methods
 * - Smart wait strategies
 * - Screenshot utilities
 * - Error handling
 * - Custom assertions
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = page.context().browser()?.browserType().name() || '';
  }

  /**
   * Navigate to a specific URL
   * @param path - Path to navigate to (relative to base URL)
   * @param options - Navigation options
   */
  async navigateTo(path: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    await this.page.goto(path, { waitUntil: options?.waitUntil || 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for an element to be visible
   * @param locator - Playwright locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 15000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - Playwright locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementHidden(locator: Locator, timeout: number = 15000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click with smart waiting
   * @param locator - Playwright locator
   */
  async click(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill input with smart waiting
   * @param locator - Playwright locator
   * @param text - Text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.fill(text);
  }

  /**
   * Type text slowly (for special cases)
   * @param locator - Playwright locator
   * @param text - Text to type
   * @param delay - Delay between keystrokes in ms
   */
  async type(locator: Locator, text: string, delay: number = 100): Promise<void> {
    await this.waitForElement(locator);
    await locator.pressSequentially(text, { delay });
  }

  /**
   * Select option from dropdown
   * @param locator - Playwright locator
   * @param value - Value to select
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption(value);
  }

  /**
   * Get text content of an element
   * @param locator - Playwright locator
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
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
   * Check if element is enabled
   * @param locator - Playwright locator
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Scroll to element
   * @param locator - Playwright locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Refresh page
   */
  async refresh(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Execute JavaScript in the page context
   * @param script - JavaScript code to execute
   */
  async executeScript<T>(script: string | (() => T)): Promise<T> {
    return await this.page.evaluate(script);
  }

  /**
   * Assert element is visible
   * @param locator - Playwright locator
   * @param message - Optional custom error message
   */
  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /**
   * Assert element has text
   * @param locator - Playwright locator
   * @param expectedText - Expected text
   * @param message - Optional custom error message
   */
  async assertHasText(locator: Locator, expectedText: string | RegExp, message?: string): Promise<void> {
    await expect(locator, message).toHaveText(expectedText);
  }

  /**
   * Assert element is enabled
   * @param locator - Playwright locator
   * @param message - Optional custom error message
   */
  async assertEnabled(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeEnabled();
  }

  /**
   * Assert current URL
   * @param expectedUrl - Expected URL or regex pattern
   * @param message - Optional custom error message
   */
  async assertUrl(expectedUrl: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(expectedUrl);
  }

  /**
   * Assert page title
   * @param expectedTitle - Expected title or regex pattern
   * @param message - Optional custom error message
   */
  async assertTitle(expectedTitle: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveTitle(expectedTitle);
  }
}
