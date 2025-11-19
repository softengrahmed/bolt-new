# Contributing to Test Automation

## 👋 Welcome!

Thank you for contributing to our test automation suite! This guide will help you write high-quality, maintainable tests.

## 📜 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Test Writing Guidelines](#test-writing-guidelines)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Review Checklist](#review-checklist)

## 🤝 Code of Conduct

- Be respectful and constructive
- Write clear, maintainable code
- Follow established patterns
- Document complex logic
- Help others learn

## 🚀 Getting Started

### 1. Set Up Development Environment

```bash
# Clone and setup
git clone https://github.com/softengrahmed/bolt-new.git
cd bolt-new
npm install
npx playwright install chromium

# Run tests to verify setup
npm test
```

### 2. Create Feature Branch

```bash
git checkout -b test/feature-name
```

### 3. Make Your Changes

- Write tests following our patterns
- Add/update page objects as needed
- Update documentation if required

### 4. Run Quality Checks

```bash
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## ✍️ Test Writing Guidelines

### Test Structure

Follow the AAA (Arrange-Act-Assert) pattern:

```typescript
test('should perform expected behavior', async ({ page }) => {
  // Arrange - Set up test conditions
  const homePage = new HomePage(page);
  await homePage.goto();

  // Act - Perform the action
  await homePage.clickStartButton();

  // Assert - Verify the outcome
  await homePage.assertVisible(homePage.heading);
});
```

### Test Naming Convention

**Format:** `should [expected behavior] when [condition]`

```typescript
// ✅ Good examples
test('should display error message when login fails');
test('should navigate to dashboard when credentials are valid');
test('should disable submit button when form is invalid');

// ❌ Avoid
test('test login');
test('check button');
```

### Test Organization

```typescript
test.describe('Feature Name', () => {
  // Shared variables
  let homePage: HomePage;
  let dataHelpers: DataHelpers;

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    dataHelpers = new DataHelpers();
    await homePage.goto();
  });

  // Cleanup after each test (if needed)
  test.afterEach(async () => {
    // Clean up resources
  });

  test('test case 1', async () => {
    // Test implementation
  });

  test('test case 2', async () => {
    // Test implementation
  });
});
```

### Page Object Guidelines

#### Creating a New Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

/**
 * FeaturePage - Page Object Model for [feature name]
 * Description of the page and its purpose
 */
export class FeaturePage extends BasePage {
  // Locators - readonly properties
  readonly mainHeading: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators using semantic selectors
    this.mainHeading = page.locator('h1');
    this.submitButton = page.locator('button[type="submit"]');
  }

  /**
   * Navigate to the feature page
   */
  async goto(): Promise<void> {
    await this.navigate('/feature');
    await this.waitForPageLoad();
  }

  /**
   * Verify page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.assertVisible(this.mainHeading);
  }

  /**
   * Perform main action
   * @param data - Input data for the action
   */
  async performAction(data: string): Promise<void> {
    await this.fill(this.submitButton, data);
    await this.click(this.submitButton);
  }
}
```

#### Locator Best Practices

```typescript
// ✅ Prefer semantic selectors
page.locator('button[type="submit"]')
page.locator('[aria-label="Search"]')
page.getByRole('button', { name: 'Submit' })
page.getByText('Welcome')

// ⚠️ Use with caution - brittle selectors
page.locator('.btn-primary') // Class names may change
page.locator('#submit-123') // IDs may be dynamic

// ❌ Avoid - very brittle
page.locator('div > div > span:nth-child(3)') // DOM structure dependent
```

### Helper Functions

Create helpers for repeated logic:

```typescript
// helpers/custom-helpers.ts
export class CustomHelpers {
  /**
   * Description of what the helper does
   * @param param - Parameter description
   * @returns Return value description
   */
  static async helperFunction(param: string): Promise<void> {
    // Implementation
  }
}
```

## 📝 Code Standards

### TypeScript Guidelines

```typescript
// ✅ Use explicit types
async function getUser(id: string): Promise<User> {
  // Implementation
}

// ✅ Use interfaces for complex objects
interface UserCredentials {
  username: string;
  password: string;
}

// ❌ Avoid 'any' type
const data: any = getData(); // Bad
const data: User = getData(); // Good
```

### Async/Await Pattern

```typescript
// ✅ Always use async/await
await page.click('button');
await expect(element).toBeVisible();

// ❌ Don't forget await
page.click('button'); // Missing await!
```

### Error Handling

```typescript
// ✅ Handle expected errors
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  throw error; // Re-throw if test should fail
}

// ✅ Provide meaningful error messages
await expect(element).toBeVisible({ timeout: 5000 });
```

### Comments and Documentation

```typescript
/**
 * JSDoc comment for public methods
 * @param username - User's email or username
 * @param password - User's password
 * @returns Promise that resolves when login is complete
 */
async login(username: string, password: string): Promise<void> {
  // Implementation
}

// Single-line comments for complex logic
// Check if user has required permissions before proceeding
if (hasPermissions) {
  await performAction();
}
```

## 🔄 Pull Request Process

### 1. Before Creating PR

```bash
# Ensure all tests pass
npm test

# Run linting
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### 2. PR Title Format

```
test: [type] Brief description

Examples:
test: add authentication flow tests
test: update login page object
test: fix flaky navigation test
```

### 3. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New test case
- [ ] Test update
- [ ] Bug fix
- [ ] Page object update
- [ ] Helper utility
- [ ] Documentation

## Test Coverage
- Feature/area covered
- Test scenarios added

## Checklist
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated

## Screenshots/Videos (if applicable)
```

### 4. Review Process

- Assign reviewers from QA team
- Address review comments
- Update based on feedback
- Ensure CI checks pass

## ✅ Review Checklist

### For Test Authors

- [ ] Tests follow AAA pattern
- [ ] Test names are descriptive
- [ ] Page objects are used correctly
- [ ] No hardcoded waits (`waitForTimeout`)
- [ ] Proper error messages in assertions
- [ ] Tests are independent
- [ ] Code is formatted and linted
- [ ] No commented-out code
- [ ] Documentation is updated

### For Reviewers

- [ ] Tests are clear and understandable
- [ ] Test coverage is adequate
- [ ] No duplicate test logic
- [ ] Selectors are maintainable
- [ ] Error handling is appropriate
- [ ] Performance considerations
- [ ] Security considerations (no secrets)

## 💡 Tips and Tricks

### 1. Use Test Tags

```typescript
test('@smoke @critical should login successfully', async () => {
  // Test implementation
});

// Run specific tags
// npx playwright test --grep @smoke
```

### 2. Skip Tests Temporarily

```typescript
test.skip('should be fixed later', async () => {
  // Test temporarily disabled
});

test.fixme('known issue #123', async () => {
  // Known failing test
});
```

### 3. Debug Single Test

```typescript
test.only('debugging this test', async () => {
  // Only this test will run
});
```

### 4. Use Test Fixtures Effectively

```typescript
const dataHelpers = new DataHelpers();
const testUser = dataHelpers.getTestUser('admin');
const testData = dataHelpers.loadFixture('test-data');
```

## 📚 Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [README-TESTING.md](README-TESTING.md)
- [DEBUGGING-GUIDE.md](DEBUGGING-GUIDE.md)

## ❓ Questions?

If you have questions:

1. Check existing documentation
2. Review similar test examples
3. Ask in team chat
4. Reach out to QA lead

---

**Thank you for contributing! 🚀**
