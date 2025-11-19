# Playwright Test Automation Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## 🎯 Overview

This test automation suite uses Playwright to provide comprehensive end-to-end testing for the Bolt New application. The framework follows the Page Object Model (POM) architecture with a hybrid test organization strategy.

### Key Features

✅ **Page Object Model Architecture** - Maintainable and reusable page components
✅ **TypeScript with Strict Mode** - Type-safe test code
✅ **Smart Wait Strategies** - Reliable test execution
✅ **Parallel Execution** - Fast feedback with 4 parallel workers
✅ **Multiple Reporting Options** - HTML reports and Allure reports
✅ **CI/CD Integration** - GitHub Actions workflows
✅ **Comprehensive Documentation** - Easy onboarding and maintenance

### Technology Stack

- **Playwright** - Modern web testing framework
- **TypeScript** - Type-safe JavaScript
- **Allure** - Rich test reporting
- **GitHub Actions** - CI/CD automation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/softengrahmed/bolt-new.git
cd bolt-new

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run tests
npm test

# View test report
npm run test:report
```

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Step-by-Step Installation

1. **Install Node.js dependencies:**

```bash
npm install
```

2. **Install Playwright browsers:**

```bash
npx playwright install chromium
```

3. **Verify installation:**

```bash
npx playwright --version
```

### Environment Configuration

Create a `.env` file in the root directory (optional):

```env
BASE_URL=http://localhost:5173
STAGING_URL=https://staging.bolt-new.app
API_BASE_URL=http://localhost:5173/api
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Run smoke tests only
npm run test:smoke

# Run critical tests
npm run test:critical

# Run regression tests
npm run test:regression
```

### Run Tests by Browser

```bash
# Run on Chromium
npm run test:chromium
```

### Run Tests by Environment

```bash
# Run on staging environment
npm run test:staging
```

### Interactive Mode

```bash
# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug
```

### View Reports

```bash
# View HTML report
npm run test:report

# Generate Allure report
npm run allure:generate

# Serve Allure report
npm run allure:serve
```

## 📁 Project Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── critical/                 # Critical path tests
│   │   ├── user-authentication.spec.ts
│   │   └── core-workflow.spec.ts
│   ├── regression/               # Regression tests
│   │   ├── navigation.spec.ts
│   │   └── form-validation.spec.ts
│   └── smoke/                    # Smoke tests
│       └── health-check.spec.ts
├── page-objects/                 # Page Object Models
│   ├── base-page.ts             # Base page class
│   ├── pages/                    # Page classes
│   │   ├── home-page.ts
│   │   ├── login-page.ts
│   │   └── dashboard-page.ts
│   └── components/               # Reusable components
│       ├── header-component.ts
│       ├── footer-component.ts
│       └── navigation-component.ts
├── helpers/                      # Helper utilities
│   ├── api-helpers.ts           # API utilities
│   ├── data-helpers.ts          # Data management
│   ├── assertion-helpers.ts     # Custom assertions
│   └── wait-helpers.ts          # Wait strategies
├── fixtures/                     # Test data
│   ├── users.json
│   ├── test-data.json
│   └── navigation-data.json
└── config/                       # Configuration
    └── environments/
        └── staging.config.ts
```

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home-page';

test.describe('Feature Name', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should verify feature behavior', async () => {
    // Arrange
    await homePage.verifyPageLoaded();

    // Act
    await homePage.clickStartButton();

    // Assert
    await homePage.assertVisible(homePage.heading);
  });
});
```

### Using Page Objects

```typescript
// Create page object instance
const homePage = new HomePage(page);

// Navigate to page
await homePage.goto();

// Interact with elements
await homePage.clickStartButton();
const headingText = await homePage.getHeadingText();

// Assertions
await homePage.assertVisible(homePage.heading);
```

### Using Test Fixtures

```typescript
import { DataHelpers } from '../helpers/data-helpers';

const dataHelpers = new DataHelpers();
const testUser = dataHelpers.getTestUser('standard');

await loginPage.login(testUser.username, testUser.password);
```

## 🎯 Best Practices

### 1. Use Page Object Model

- Encapsulate page interactions in page classes
- Keep locators and actions separate from test logic
- Reuse page objects across multiple tests

### 2. Smart Waits

```typescript
// ✅ Good - Use smart waits
await page.locator('button').waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');

// ❌ Avoid - Fixed waits
await page.waitForTimeout(5000);
```

### 3. Test Independence

- Each test should be independently executable
- Use `beforeEach` for setup
- Clean up state in `afterEach` if needed

### 4. Descriptive Test Names

```typescript
// ✅ Good
test('should display error message when login fails with invalid credentials', async () => {});

// ❌ Avoid
test('test1', async () => {});
```

### 5. Use Assertions Effectively

```typescript
// Use built-in Playwright assertions
await expect(page.locator('.error')).toBeVisible();
await expect(page).toHaveURL(/dashboard/);
await expect(element).toContainText('Welcome');
```

## 🔧 Troubleshooting

### Common Issues

#### Tests Timing Out

```typescript
// Increase timeout for slow operations
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

#### Element Not Found

- Verify the locator is correct
- Add appropriate waits
- Check if element is in iframe
- Verify page has loaded

#### Tests Failing in CI

- Check environment variables
- Verify browser installation
- Review CI logs and screenshots
- Run tests locally with `--headed` flag

### Debug Mode

```bash
# Run with debug
npm run test:debug

# Run specific test in debug mode
npx playwright test --debug path/to/test.spec.ts
```

### View Trace

```bash
# Show trace for failed test
npx playwright show-trace trace.zip
```

## 📚 Resources

### Documentation

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Contributing Guide](CONTRIBUTING-TESTS.md)
- [Debugging Guide](DEBUGGING-GUIDE.md)
- [Test Strategy](TEST-STRATEGY.md)

### Useful Commands

```bash
# Generate code
npm run test:codegen

# Lint tests
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🤝 Contributing

Please read [CONTRIBUTING-TESTS.md](CONTRIBUTING-TESTS.md) for details on our testing standards and the process for submitting test code.

## 📞 Support

For questions or issues:

1. Check the [Debugging Guide](DEBUGGING-GUIDE.md)
2. Review existing test examples
3. Contact the QA team
4. Open a GitHub issue

---

**Happy Testing! 🎉**
