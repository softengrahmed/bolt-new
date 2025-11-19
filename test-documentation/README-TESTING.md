# Bolt Test Automation Suite

Comprehensive Playwright test automation for the Bolt application.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Organization](#test-organization)
- [Configuration](#configuration)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This test automation suite uses Playwright with TypeScript to provide comprehensive test coverage for the Bolt application. The suite follows the Page Object Model (POM) architecture and includes:

- ✅ E2E tests across multiple browsers (Chromium, Firefox, WebKit)
- ✅ Smoke tests for quick health checks
- ✅ Critical path tests for essential workflows
- ✅ Regression tests for comprehensive coverage
- ✅ CI/CD integration with GitHub Actions
- ✅ Comprehensive reporting and artifacts

### Test Statistics

- **Total Test Files**: 3+ suites
- **Estimated Execution Time**: 15-20 minutes (parallel mode)
- **Browser Coverage**: 3 browsers
- **Test Organization**: Hybrid (layer/feature)

## 🚀 Quick Start

```bash
# Navigate to tests directory
cd tests

# Install dependencies
pnpm install

# Install Playwright browsers
pnpm run install:browsers

# Run all tests
pnpm test

# Run tests in UI mode (recommended for development)
pnpm run test:ui

# View last test report
pnpm run test:report
```

## 📦 Installation

### Prerequisites

- Node.js 18.18.0 or higher
- pnpm 9.x or higher

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/softengrahmed/bolt-new.git
   cd bolt-new
   ```

2. **Install application dependencies**
   ```bash
   pnpm install
   ```

3. **Install test dependencies**
   ```bash
   cd tests
   pnpm install
   ```

4. **Install Playwright browsers**
   ```bash
   pnpm run install:browsers
   ```

5. **Verify installation**
   ```bash
   pnpm test -- --list
   ```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
pnpm test

# Run tests in headed mode (see browser)
pnpm run test:headed

# Run tests in UI mode (interactive)
pnpm run test:ui

# Run tests in debug mode
pnpm run test:debug
```

### Test Suites

```bash
# Smoke tests (quick health check)
pnpm run test:smoke

# Critical tests (essential workflows)
pnpm run test:critical

# Regression tests (comprehensive)
pnpm run test:regression
```

### Browser-Specific Tests

```bash
# Run in Chromium only
pnpm run test:chromium

# Run in Firefox only
pnpm run test:firefox

# Run in WebKit only
pnpm run test:webkit
```

### Environment-Specific Tests

```bash
# Run against staging
pnpm run test:staging

# Run against production (smoke tests only)
pnpm run test:prod
```

### Advanced Options

```bash
# Run specific test file
pnpm test tests/e2e/smoke/health-check.spec.ts

# Run tests matching pattern
pnpm test --grep "health"

# Run tests with specific tag
pnpm test --grep "@smoke"

# Run with specific number of workers
pnpm test --workers=2

# Generate test code
pnpm run test:codegen
```

## 📁 Test Organization

```
tests/
├── e2e/                      # End-to-end tests
│   ├── smoke/                # Quick health checks
│   ├── critical/             # Critical user journeys
│   └── regression/           # Full regression suite
├── page-objects/             # Page Object Model
│   ├── base-page.ts          # Base page class
│   ├── pages/                # Page objects
│   └── components/           # Reusable components
├── helpers/                  # Utility functions
│   ├── api-helpers.ts        # API utilities
│   ├── data-helpers.ts       # Data generation
│   ├── assertion-helpers.ts  # Custom assertions
│   └── wait-helpers.ts       # Wait strategies
├── fixtures/                 # Test data
│   ├── users.json            # User test data
│   └── test-data.json        # General test data
├── config/                   # Environment configs
│   └── environments/         # Per-environment settings
└── reports/                  # Test reports (gitignored)
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `tests/` directory:

```env
# Base URLs
BASE_URL=http://localhost:5173
STAGING_URL=https://staging.example.com
PRODUCTION_URL=https://app.example.com

# API URLs
API_URL=http://localhost:5173/api
STAGING_API_URL=https://api-staging.example.com
PRODUCTION_API_URL=https://api.example.com

# Test Credentials (staging only)
STAGING_TEST_USERNAME=testuser
STAGING_TEST_PASSWORD=TestPassword123!
```

### Playwright Configuration

Main configuration files:
- `playwright-config/playwright.config.ts` - Base configuration
- `playwright-config/playwright.staging.config.ts` - Staging environment
- `playwright-config/playwright.prod.config.ts` - Production environment

### Timeout Configuration

```typescript
// Global timeout
timeout: 60000 (60 seconds)

// Navigation timeout
navigationTimeout: 30000 (30 seconds)

// Action timeout
actionTimeout: 15000 (15 seconds)

// Expect timeout
expect.timeout: 10000 (10 seconds)
```

## 📊 Reporting

### HTML Report

After test execution, view the HTML report:

```bash
pnpm run test:report
```

The report includes:
- Test results summary
- Failed test details
- Screenshots on failure
- Videos on first retry failure
- Execution timeline

### Trace Viewer

For detailed debugging:

```bash
pnpm run test:trace
```

The trace viewer shows:
- Step-by-step test execution
- Network activity
- Console logs
- DOM snapshots
- Action timeline

### CI/CD Reports

In CI/CD, reports are automatically uploaded as artifacts:
- HTML reports (30-day retention)
- Screenshots (7-day retention)
- Traces (7-day retention)
- Performance metrics (90-day retention)

## 🐛 Troubleshooting

### Common Issues

#### Tests Failing Locally But Passing in CI

```bash
# Ensure browsers are up to date
pnpm run install:browsers

# Clear Playwright cache
rm -rf ~/.cache/ms-playwright
pnpm run install:browsers
```

#### Timeout Errors

```bash
# Increase timeout in test
test.setTimeout(120000); // 2 minutes

# Or run with custom timeout
pnpm test --timeout=120000
```

#### Network Errors

```bash
# Check if application is running
# Verify BASE_URL is correct
# Check firewall/proxy settings
```

#### Flaky Tests

```bash
# Run with retries
pnpm test --retries=3

# Use trace viewer to debug
pnpm test --trace=on
```

### Debug Mode

```bash
# Run with Playwright Inspector
pnpm run test:debug

# Run specific test in debug mode
pnpm test tests/e2e/smoke/health-check.spec.ts --debug
```

### Performance Issues

```bash
# Reduce workers
pnpm test --workers=1

# Disable parallelization
pnpm test --fully-parallel=false

# Run specific browser only
pnpm run test:chromium
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Contributing Guide](./CONTRIBUTING-TESTS.md)
- [Debugging Guide](./DEBUGGING-GUIDE.md)
- [Test Strategy](./TEST-STRATEGY.md)

## 🤝 Support

For questions or issues:
1. Check the [Debugging Guide](./DEBUGGING-GUIDE.md)
2. Review existing GitHub issues
3. Create a new issue with reproduction steps
4. Contact the QA team

## 📝 License

MIT License - See LICENSE file for details
