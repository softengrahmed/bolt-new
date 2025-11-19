import { expect, Page, Locator } from '@playwright/test';

/**
 * Custom Assertion Helpers
 * 
 * Provides enhanced assertion utilities:
 * - Complex validation scenarios
 * - Retry logic for flaky assertions
 * - Custom error messages
 */

export class AssertionHelper {
  /**
   * Assert element contains text (case-insensitive)
   * @param locator - Playwright locator
   * @param expectedText - Expected text
   */
  static async assertContainsText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText, { ignoreCase: true });
  }

  /**
   * Assert element has exact text
   * @param locator - Playwright locator
   * @param expectedText - Expected exact text
   */
  static async assertExactText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText, { ignoreCase: false });
  }

  /**
   * Assert element attribute value
   * @param locator - Playwright locator
   * @param attribute - Attribute name
   * @param expectedValue - Expected attribute value
   */
  static async assertAttributeValue(
    locator: Locator,
    attribute: string,
    expectedValue: string,
  ): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, expectedValue);
  }

  /**
   * Assert element is checked (checkbox/radio)
   * @param locator - Playwright locator
   */
  static async assertChecked(locator: Locator): Promise<void> {
    await expect(locator).toBeChecked();
  }

  /**
   * Assert element count
   * @param locator - Playwright locator
   * @param expectedCount - Expected number of elements
   */
  static async assertCount(locator: Locator, expectedCount: number): Promise<void> {
    await expect(locator).toHaveCount(expectedCount);
  }

  /**
   * Assert URL matches pattern
   * @param page - Playwright page
   * @param urlPattern - Expected URL pattern (string or regex)
   */
  static async assertUrlMatches(page: Page, urlPattern: string | RegExp): Promise<void> {
    await expect(page).toHaveURL(urlPattern);
  }

  /**
   * Assert page title
   * @param page - Playwright page
   * @param expectedTitle - Expected title
   */
  static async assertPageTitle(page: Page, expectedTitle: string | RegExp): Promise<void> {
    await expect(page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert element has CSS class
   * @param locator - Playwright locator
   * @param className - Expected CSS class
   */
  static async assertHasClass(locator: Locator, className: string): Promise<void> {
    await expect(locator).toHaveClass(new RegExp(className));
  }

  /**
   * Assert element is visible
   * @param locator - Playwright locator
   */
  static async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert element is hidden
   * @param locator - Playwright locator
   */
  static async assertHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  /**
   * Assert element is enabled
   * @param locator - Playwright locator
   */
  static async assertEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert element is disabled
   * @param locator - Playwright locator
   */
  static async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  /**
   * Assert element has focus
   * @param locator - Playwright locator
   */
  static async assertFocused(locator: Locator): Promise<void> {
    await expect(locator).toBeFocused();
  }

  /**
   * Assert value matches expected (with retry)
   * @param getValue - Function to get value
   * @param expectedValue - Expected value
   * @param maxRetries - Maximum retry attempts
   */
  static async assertValueWithRetry<T>(
    getValue: () => Promise<T>,
    expectedValue: T,
    maxRetries: number = 3,
  ): Promise<void> {
    let lastValue: T;
    for (let i = 0; i < maxRetries; i++) {
      lastValue = await getValue();
      if (lastValue === expectedValue) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    expect(lastValue!).toBe(expectedValue);
  }

  /**
   * Assert array contains value
   * @param array - Array to check
   * @param expectedValue - Expected value
   */
  static assertArrayContains<T>(array: T[], expectedValue: T): void {
    expect(array).toContain(expectedValue);
  }

  /**
   * Assert array length
   * @param array - Array to check
   * @param expectedLength - Expected length
   */
  static assertArrayLength<T>(array: T[], expectedLength: number): void {
    expect(array).toHaveLength(expectedLength);
  }

  /**
   * Assert object has property
   * @param obj - Object to check
   * @param propertyName - Property name
   */
  static assertObjectHasProperty(obj: Record<string, unknown>, propertyName: string): void {
    expect(obj).toHaveProperty(propertyName);
  }

  /**
   * Assert objects are equal
   * @param actual - Actual object
   * @param expected - Expected object
   */
  static assertObjectsEqual(actual: unknown, expected: unknown): void {
    expect(actual).toEqual(expected);
  }
}
