import { Page, Locator } from '@playwright/test';

/**
 * Smart Wait Strategies
 * 
 * Provides advanced waiting mechanisms:
 * - Custom wait conditions
 * - Polling strategies
 * - Network idle detection
 */

export class WaitHelper {
  /**
   * Wait for element to be present in DOM
   * @param locator - Playwright locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForElement(locator: Locator, timeout: number = 15000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for element to be visible
   * @param locator - Playwright locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForVisible(locator: Locator, timeout: number = 15000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param locator - Playwright locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForHidden(locator: Locator, timeout: number = 15000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for element to be removed from DOM
   * @param locator - Playwright locator
   * @param timeout - Timeout in milliseconds
   */
  static async waitForDetached(locator: Locator, timeout: number = 15000): Promise<void> {
    await locator.waitFor({ state: 'detached', timeout });
  }

  /**
   * Wait for page load to complete
   * @param page - Playwright page
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Wait for network to be idle
   * @param page - Playwright page
   * @param timeout - Timeout in milliseconds
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM content to be loaded
   * @param page - Playwright page
   */
  static async waitForDOMContentLoaded(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for specific URL
   * @param page - Playwright page
   * @param urlPattern - URL pattern to wait for
   * @param timeout - Timeout in milliseconds
   */
  static async waitForUrl(page: Page, urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Wait for condition to be true
   * @param condition - Function that returns boolean
   * @param timeout - Timeout in milliseconds
   * @param pollInterval - Polling interval in milliseconds
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 15000,
    pollInterval: number = 500,
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.wait(pollInterval);
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Wait for text to appear in element
   * @param locator - Playwright locator
   * @param expectedText - Expected text
   * @param timeout - Timeout in milliseconds
   */
  static async waitForText(locator: Locator, expectedText: string | RegExp, timeout: number = 15000): Promise<void> {
    await locator.locator(`text=${expectedText}`).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for attribute value
   * @param locator - Playwright locator
   * @param attribute - Attribute name
   * @param expectedValue - Expected attribute value
   * @param timeout - Timeout in milliseconds
   */
  static async waitForAttributeValue(
    locator: Locator,
    attribute: string,
    expectedValue: string,
    timeout: number = 15000,
  ): Promise<void> {
    await this.waitForCondition(async () => {
      const value = await locator.getAttribute(attribute);
      return value === expectedValue;
    }, timeout);
  }

  /**
   * Wait for element count
   * @param locator - Playwright locator
   * @param expectedCount - Expected number of elements
   * @param timeout - Timeout in milliseconds
   */
  static async waitForCount(locator: Locator, expectedCount: number, timeout: number = 15000): Promise<void> {
    await this.waitForCondition(async () => {
      const count = await locator.count();
      return count === expectedCount;
    }, timeout);
  }

  /**
   * Wait for navigation to complete
   * @param page - Playwright page
   * @param action - Action that triggers navigation
   */
  static async waitForNavigation(page: Page, action: () => Promise<void>): Promise<void> {
    await Promise.all([page.waitForLoadState('networkidle'), action()]);
  }

  /**
   * Simple wait/sleep
   * @param ms - Milliseconds to wait
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait with exponential backoff
   * @param attempt - Current attempt number
   * @param baseDelay - Base delay in milliseconds
   */
  static async waitWithBackoff(attempt: number, baseDelay: number = 1000): Promise<void> {
    const delay = baseDelay * Math.pow(2, attempt);
    await this.wait(delay);
  }
}
