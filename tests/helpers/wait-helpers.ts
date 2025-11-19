import { Page, Locator, expect } from '@playwright/test';

/**
 * Wait Helper utilities for smart wait strategies
 * Provides various waiting mechanisms for test synchronization
 */
export class WaitHelpers {
  /**
   * Wait for element to be visible
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for element to be attached to DOM
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForAttached(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for element to be detached from DOM
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForDetached(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'detached', timeout });
  }

  /**
   * Wait for page to reach specific load state
   * @param page - Playwright page
   * @param state - Load state to wait for
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForLoadState(
    page: Page,
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded',
    timeout: number = 30000
  ): Promise<void> {
    await page.waitForLoadState(state, { timeout });
  }

  /**
   * Wait for URL to match pattern
   * @param page - Playwright page
   * @param urlPattern - Expected URL pattern
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForUrl(
    page: Page,
    urlPattern: string | RegExp,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Wait for network to be idle
   * @param page - Playwright page
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for specific time (use sparingly, prefer other wait methods)
   * @param ms - Milliseconds to wait
   */
  static async wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait for element to contain specific text
   * @param locator - Playwright locator
   * @param text - Expected text
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForText(
    locator: Locator,
    text: string,
    timeout: number = 10000
  ): Promise<void> {
    await expect(locator).toContainText(text, { timeout });
  }

  /**
   * Wait for element count to match expected
   * @param locator - Playwright locator
   * @param count - Expected element count
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForCount(
    locator: Locator,
    count: number,
    timeout: number = 10000
  ): Promise<void> {
    await expect(locator).toHaveCount(count, { timeout });
  }

  /**
   * Wait for element to be enabled
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForEnabled(locator: Locator, timeout: number = 10000): Promise<void> {
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * Wait for element to be disabled
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForDisabled(locator: Locator, timeout: number = 10000): Promise<void> {
    await expect(locator).toBeDisabled({ timeout });
  }

  /**
   * Wait for API response
   * @param page - Playwright page
   * @param urlPattern - URL pattern to wait for
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForResponse(
    page: Page,
    urlPattern: string | RegExp,
    timeout: number = 30000
  ): Promise<void> {
    await page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Wait for API request
   * @param page - Playwright page
   * @param urlPattern - URL pattern to wait for
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForRequest(
    page: Page,
    urlPattern: string | RegExp,
    timeout: number = 30000
  ): Promise<void> {
    await page.waitForRequest(urlPattern, { timeout });
  }

  /**
   * Retry an action until it succeeds or timeout
   * @param action - Function to retry
   * @param maxAttempts - Maximum number of attempts
   * @param delayMs - Delay between attempts in milliseconds
   */
  static async retryUntilSuccess(
    action: () => Promise<void>,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await action();
        return; // Success
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error; // Last attempt failed
        }
        await this.wait(delayMs);
      }
    }
  }
}
