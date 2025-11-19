# Contributing to Test Automation

Thank you for your interest in contributing to the Bolt test automation suite! This guide will help you write high-quality, maintainable tests.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Test Writing Guidelines](#test-writing-guidelines)
- [Page Object Model](#page-object-model)
- [Best Practices](#best-practices)
- [Code Review Process](#code-review-process)

## 🚀 Getting Started

### Prerequisites

1. Read the [README-TESTING.md](./README-TESTING.md)
2. Set up your development environment
3. Familiarize yourself with Playwright documentation
4. Review existing tests to understand patterns

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/bolt-new.git
cd bolt-new

# Create a feature branch
git checkout -b test/feature-name

# Install dependencies
cd tests
pnpm install
pnpm run install:browsers
```

## ✍️ Test Writing Guidelines

### Test Structure

Follow the AAA pattern (Arrange, Act, Assert):

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home-page';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Arrange: Set up test prerequisites
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should perform specific action', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    
    // Act
    await homePage.clickButton();
    
    // Assert
    await expect(page).toHaveURL(/expected-url/);
  });
});
```

### Test Naming Conventions

- **Test Files**: `feature-name.spec.ts`
- **Test Descriptions**: Use clear, descriptive names starting with "should"
- **Test Groups**: Use `test.describe()` for logical grouping

```typescript
// Good
test('should display error message when form is submitted with invalid data', ...);

// Bad
test('test1', ...);
test('form validation', ...);
```

### File Organization

```
tests/
├── e2e/
│   ├── [layer]/              # smoke, critical, regression
│   │   └── [feature].spec.ts
│   └── ...
├── page-objects/
│   ├── pages/
│   │   └── [page-name]-page.ts
│   ├── components/
│   │   └── [component-name]-component.ts
│   └── base-page.ts
└── ...
```

## 📚 Page Object Model

### Creating a New Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

/**
 * PageName - Brief description of the page
 * 
 * Represents [specific page/section] of the application
 */
export class PageName extends BasePage {
  // Locators - declare all locators as private readonly
  private readonly elementLocator: Locator;
  private readonly anotherElement: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators using robust selectors
    this.elementLocator = page.getByRole('button', { name: 'Submit' });
    this.anotherElement = page.locator('[data-testid="element"]');
  }

  /**
   * Navigate to this page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/page-path');
  }

  /**
   * Perform specific action
   * @param param - Description of parameter
   */
  async performAction(param: string): Promise<void> {
    await this.fill(this.elementLocator, param);
    await this.click(this.anotherElement);
  }

  /**
   * Verify page state
   */
  async verifyLoaded(): Promise<void> {
    await this.assertVisible(this.elementLocator);
  }
}
```

### Selector Priority

 Use selectors in this order of preference:

1. **User-facing attributes** (best)
   ```typescript
   page.getByRole('button', { name: 'Submit' })
   page.getByText('Welcome')
   page.getByLabel('Email')
   ```

2. **Test IDs** (good)
   ```typescript
   page.locator('[data-testid="submit-button"]')
   ```

3. **CSS selectors** (acceptable)
   ```typescript
   page.locator('.button-class')
   ```

4. **XPath** (last resort - avoid if possible)
   ```typescript
   page.locator('xpath=//button[@type="submit"]')
   ```

## ✅ Best Practices

### 1. Write Independent Tests

```typescript
// Good - Each test is independent
test('should add item to cart', async ({ page }) => {
  await addItemToCart(page, 'Product A');
  await expect(page.locator('.cart-count')).toHaveText('1');
});

test('should remove item from cart', async ({ page }) => {
  await addItemToCart(page, 'Product A');
  await removeItemFromCart(page, 'Product A');
  await expect(page.locator('.cart-count')).toHaveText('0');
});

// Bad - Tests depend on each other
test('should add item to cart', async ({ page }) => {
  // ... adds item
});

test('should remove item from cart', async ({ page }) => {
  // Assumes item was already added by previous test
  await removeItemFromCart(page, 'Product A');
});
```

### 2. Use Smart Waits

```typescript
// Good - Use built-in waits
await page.getByRole('button').click();
await expect(page.locator('.message')).toBeVisible();

// Bad - Use hard-coded waits
await page.locator('.button').click();
await page.waitForTimeout(5000);
```

### 3. Handle Flakiness

```typescript
// Good - Use retry mechanisms
await expect(async () => {
  const text = await page.locator('.dynamic-content').textContent();
  expect(text).toContain('Expected');
}).toPass({ timeout: 10000 });

// Good - Use proper waits
await page.waitForLoadState('networkidle');

// Bad - Hope for the best
await page.waitForTimeout(1000);
```

### 4. Provide Clear Error Messages

```typescript
// Good
await expect(page.locator('.error'), 
  'Error message should be displayed after invalid login'
).toBeVisible();

// Bad
await expect(page.locator('.error')).toBeVisible();
```

### 5. Use Test Fixtures

```typescript
// Good - Use fixtures for test data
import { DataHelper } from '../../helpers/data-helpers';
import testUsers from '../../fixtures/users.json';

test('should login with valid credentials', async ({ page }) => {
  const user = testUsers.testUsers[0];
  await loginPage.login(user.email, user.password);
});

// Generate dynamic data when needed
const randomUser = DataHelper.generateUserData();
```

### 6. Clean Up After Tests

```typescript
test.afterEach(async ({ page }) => {
  // Clean up test data
  await cleanupTestData();
  
  // Clear cookies/storage if needed
  await page.context().clearCookies();
});
```

### 7. Use Test Steps for Clarity

```typescript
test('should complete checkout process', async ({ page }) => {
  await test.step('Add items to cart', async () => {
    await homePage.goto();
    await homePage.addItemToCart('Product 1');
  });

  await test.step('Proceed to checkout', async () => {
    await cartPage.clickCheckout();
  });

  await test.step('Complete payment', async () => {
    await checkoutPage.fillPaymentInfo(paymentData);
    await checkoutPage.submit();
  });

  await test.step('Verify order confirmation', async () => {
    await expect(confirmationPage.orderNumber).toBeVisible();
  });
});
```

### 8. Document Complex Logic

```typescript
/**
 * Verify user can complete multi-step form
 * 
 * This test verifies the complete user registration flow including:
 * 1. Email verification
 * 2. Profile completion
 * 3. Preference selection
 * 
 * @remarks
 * This test requires email service to be available
 */
test('should complete user registration', async ({ page }) => {
  // Test implementation
});
```

## 🔍 Code Review Process

### Before Submitting PR

1. **Run tests locally**
   ```bash
   pnpm test
   pnpm run lint
   pnpm run format
   ```

2. **Verify test passes consistently**
   ```bash
   pnpm test --repeat-each=3
   ```

3. **Check test coverage**
   - Does it test the happy path?
   - Does it test error scenarios?
   - Does it handle edge cases?

4. **Update documentation**
   - Update README if adding new features
   - Add JSDoc comments to new functions
   - Update test coverage matrix

### PR Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Added JSDoc comments
- [ ] Updated documentation
- [ ] No hard-coded waits
- [ ] Used Page Object Model
- [ ] Tests are independent
- [ ] Clear test descriptions
- [ ] Proper error messages

### Review Guidelines

When reviewing test PRs, check for:

1. **Test Quality**
   - Independent and isolated
   - Clear and descriptive
   - Follows best practices

2. **Code Quality**
   - DRY principle
   - Proper use of helpers
   - Consistent with existing patterns

3. **Maintainability**
   - Easy to understand
   - Well documented
   - Reusable components

## 📈 Performance Considerations

### Parallel Execution

```typescript
// Tests in same file run sequentially by default
test.describe.configure({ mode: 'parallel' });

test.describe('Feature Tests', () => {
  test('test 1', ...); // Runs in parallel
  test('test 2', ...); // with test 1
});
```

### Test Tagging

```typescript
// Tag tests for selective execution
test('should perform critical action @critical @smoke', async ({ page }) => {
  // Test implementation
});

// Run tagged tests
// pnpm test --grep @critical
```

## 🎓 Learning Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Automation Patterns](https://martinfowler.com/bliki/PageObject.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ Questions?

If you have questions:
1. Check existing documentation
2. Review similar tests
3. Ask in team chat
4. Create a GitHub discussion

Thank you for contributing to test quality! 🚀
