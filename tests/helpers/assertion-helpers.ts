import { expect, Locator, Page } from '@playwright/test';

/**
 * Assertion Helper utilities for custom assertions
 * Provides enhanced assertion methods for common test scenarios
 */
export class AssertionHelpers {
  /**
   * Assert element has specific CSS class
   * @param locator - Playwright locator
   * @param className - Expected CSS class name
   */
  static async assertHasClass(locator: Locator, className: string): Promise<void> {
    const classes = await locator.getAttribute('class');
    expect(classes, `Element should have class '${className}'`).toContain(className);
  }

  /**
   * Assert element does not have specific CSS class
   * @param locator - Playwright locator
   * @param className - Class name that should not be present
   */
  static async assertDoesNotHaveClass(locator: Locator, className: string): Promise<void> {
    const classes = await locator.getAttribute('class');
    expect(classes, `Element should not have class '${className}'`).not.toContain(className);
  }

  /**
   * Assert element has specific attribute value
   * @param locator - Playwright locator
   * @param attributeName - Attribute name
   * @param expectedValue - Expected attribute value
   */
  static async assertAttributeValue(
    locator: Locator,
    attributeName: string,
    expectedValue: string
  ): Promise<void> {
    const actualValue = await locator.getAttribute(attributeName);
    expect(
      actualValue,
      `Attribute '${attributeName}' should have value '${expectedValue}'`
    ).toBe(expectedValue);
  }

  /**
   * Assert element is enabled
   * @param locator - Playwright locator
   */
  static async assertEnabled(locator: Locator): Promise<void> {
    await expect(locator, 'Element should be enabled').toBeEnabled();
  }

  /**
   * Assert element is disabled
   * @param locator - Playwright locator
   */
  static async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator, 'Element should be disabled').toBeDisabled();
  }

  /**
   * Assert element count matches expected
   * @param locator - Playwright locator
   * @param expectedCount - Expected number of elements
   */
  static async assertElementCount(locator: Locator, expectedCount: number): Promise<void> {
    await expect(locator, `Should have ${expectedCount} elements`).toHaveCount(expectedCount);
  }

  /**
   * Assert element is checked (for checkboxes/radio buttons)
   * @param locator - Playwright locator
   */
  static async assertChecked(locator: Locator): Promise<void> {
    await expect(locator, 'Element should be checked').toBeChecked();
  }

  /**
   * Assert element is not checked
   * @param locator - Playwright locator
   */
  static async assertNotChecked(locator: Locator): Promise<void> {
    await expect(locator, 'Element should not be checked').not.toBeChecked();
  }

  /**
   * Assert page URL matches pattern
   * @param page - Playwright page
   * @param urlPattern - Expected URL or regex pattern
   */
  static async assertUrlMatches(page: Page, urlPattern: string | RegExp): Promise<void> {
    await expect(page, `URL should match ${urlPattern}`).toHaveURL(urlPattern);
  }

  /**
   * Assert page title matches
   * @param page - Playwright page
   * @param titlePattern - Expected title or regex pattern
   */
  static async assertTitleMatches(page: Page, titlePattern: string | RegExp): Promise<void> {
    await expect(page, `Title should match ${titlePattern}`).toHaveTitle(titlePattern);
  }

  /**
   * Assert text matches exactly
   * @param locator - Playwright locator
   * @param expectedText - Expected exact text
   */
  static async assertTextEquals(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator, `Text should equal '${expectedText}'`).toHaveText(expectedText);
  }

  /**
   * Assert text contains substring
   * @param locator - Playwright locator
   * @param substring - Expected substring
   */
  static async assertTextContains(locator: Locator, substring: string): Promise<void> {
    await expect(locator, `Text should contain '${substring}'`).toContainText(substring);
  }

  /**
   * Assert element value matches (for input fields)
   * @param locator - Playwright locator
   * @param expectedValue - Expected input value
   */
  static async assertValue(locator: Locator, expectedValue: string): Promise<void> {
    await expect(locator, `Value should be '${expectedValue}'`).toHaveValue(expectedValue);
  }

  /**
   * Assert element is focused
   * @param locator - Playwright locator
   */
  static async assertFocused(locator: Locator): Promise<void> {
    await expect(locator, 'Element should be focused').toBeFocused();
  }

  /**
   * Assert array contains expected values
   * @param actual - Actual array
   * @param expected - Expected values
   */
  static assertArrayContains<T>(actual: T[], expected: T[]): void {
    expected.forEach((item) => {
      expect(actual, `Array should contain ${JSON.stringify(item)}`).toContain(item);
    });
  }

  /**
   * Assert object has expected properties
   * @param actual - Actual object
   * @param expectedProperties - Expected property names
   */
  static assertObjectHasProperties(
    actual: Record<string, unknown>,
    expectedProperties: string[]
  ): void {
    expectedProperties.forEach((prop) => {
      expect(
        actual,
        `Object should have property '${prop}'`
      ).toHaveProperty(prop);
    });
  }
}
