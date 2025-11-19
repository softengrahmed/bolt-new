# Test Debugging Guide

Comprehensive guide for debugging Playwright tests and resolving common issues.

## 📋 Table of Contents

- [Quick Debugging](#quick-debugging)
- [Common Issues](#common-issues)
- [Debugging Tools](#debugging-tools)
- [Performance Issues](#performance-issues)
- [CI/CD Issues](#cicd-issues)

## 🔍 Quick Debugging

### Step 1: Run in Debug Mode

```bash
# Debug specific test
pnpm run test:debug tests/e2e/smoke/health-check.spec.ts

# Debug with headed browser
pnpm run test:headed tests/e2e/smoke/health-check.spec.ts
```

### Step 2: Use UI Mode

```bash
pnpm run test:ui
```

UI Mode provides:
- Step-through debugging
- Time travel through test execution
- DOM snapshots at each step
- Network activity logs
- Console output

### Step 3: Enable Trace

```bash
# Run with trace enabled
pnpm test --trace=on

# View trace after failure
pnpm run test:trace
```

## 🐛 Common Issues

### 1. Timeout Errors

**Symptom**: Tests fail with "Timeout exceeded" errors

**Solutions**:

```typescript
// Solution 1: Increase test timeout
test('slow test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // Test implementation
});

// Solution 2: Use proper waits
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 30000 });

// Solution 3: Break down into smaller steps
await test.step('Load page', async () => {
  await page.goto('/path');
});
```

**Verify**:
```bash
# Run with increased timeout
pnpm test --timeout=120000
```

### 2. Element Not Found

**Symptom**: "Element not found" or "selector resolved to hidden"

**Solutions**:

```typescript
// Solution 1: Wait for element
await page.waitForSelector('.element', { state: 'visible' });

// Solution 2: Use more robust selectors
// Bad
const button = page.locator('.btn');

// Good
const button = page.getByRole('button', { name: 'Submit' });

// Solution 3: Check if element exists
const element = page.locator('.element');
if (await element.isVisible()) {
  await element.click();
}
```

**Debug**:
```typescript
// Print all matching elements
const elements = await page.locator('.element').all();
console.log('Found elements:', elements.length);

// Take screenshot at failure point
await page.screenshot({ path: 'debug-screenshot.png' });
```

### 3. Flaky Tests

**Symptom**: Tests pass/fail inconsistently

**Common Causes**:
- Race conditions
- Hard-coded waits
- Dependency on test execution order
- Timing-dependent logic

**Solutions**:

```typescript
// Solution 1: Use retry mechanism
await expect(async () => {
  const value = await element.textContent();
  expect(value).toContain('Expected');
}).toPass({ timeout: 10000 });

// Solution 2: Wait for specific conditions
await page.waitForFunction(() => {
  return document.querySelector('.data')?.textContent !== 'Loading...';
});

// Solution 3: Ensure test independence
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
});
```

**Detect Flaky Tests**:
```bash
# Run test multiple times
pnpm test --repeat-each=10 tests/path/to/test.spec.ts
```

### 4. Authentication Issues

**Symptom**: Tests fail at login or with auth errors

**Solutions**:

```typescript
// Solution 1: Use storage state
test.use({
  storageState: 'tests/auth/user.json',
});

// Solution 2: Setup authentication in beforeEach
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
});

// Solution 3: Use API to authenticate
test.beforeEach(async ({ page, request }) => {
  const response = await request.post('/api/login', {
    data: { email: 'test@example.com', password: 'password' },
  });
  const cookies = await response.headerValue('set-cookie');
  await page.context().addCookies([/* parse cookies */]);
});
```

### 5. Network Errors

**Symptom**: "Failed to fetch", "ERR_CONNECTION_REFUSED"

**Solutions**:

```typescript
// Solution 1: Verify base URL
console.log('Testing against:', process.env.BASE_URL);

// Solution 2: Wait for network idle
await page.goto('/path', { waitUntil: 'networkidle' });

// Solution 3: Handle specific network conditions
page.route('**/api/**', async (route) => {
  const response = await route.fetch();
  // Modify or mock response
  await route.fulfill({ response });
});

// Solution 4: Add retry logic
let retries = 3;
while (retries > 0) {
  try {
    await page.goto('/path');
    break;
  } catch (error) {
    retries--;
    if (retries === 0) throw error;
    await page.waitForTimeout(1000);
  }
}
```

### 6. Assertion Failures

**Symptom**: Expected vs actual values don't match

**Solutions**:

```typescript
// Solution 1: Add soft assertions for debugging
await expect.soft(element).toBeVisible();
await expect.soft(element).toHaveText('Expected');
// Test continues even if assertions fail

// Solution 2: Use better error messages
await expect(element, 'Login button should be visible').toBeVisible();

// Solution 3: Debug actual values
const actualText = await element.textContent();
console.log('Actual text:', actualText);
expect(actualText).toBe('Expected text');

// Solution 4: Use regex for flexible matching
await expect(element).toHaveText(/expected/i);
```

## 🛠️ Debugging Tools

### 1. Playwright Inspector

```bash
pnpm run test:debug
```

Features:
- Step through test
- Inspect element selectors
- Edit and re-run steps
- Pick locators
- View console logs

### 2. Trace Viewer

```bash
# Generate trace
pnpm test --trace=on

# View trace
pnpm run test:trace
```

Features:
- Timeline of all actions
- DOM snapshots before/after each action
- Network activity
- Console logs
- Screenshots

### 3. Browser DevTools

```bash
# Run with DevTools open
pnpm test -- --headed --debug
```

Use when you need:
- Inspect element styles
- Debug JavaScript
- Monitor network requests
- View console output

### 4. VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Playwright Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/tests/node_modules/.bin/playwright",
      "args": ["test", "--headed", "--debug"],
      "cwd": "${workspaceFolder}/tests",
      "console": "integratedTerminal"
    }
  ]
}
```

### 5. Logging

```typescript
// Add debug logging
test('my test', async ({ page }) => {
  console.log('Step 1: Navigate');
  await page.goto('/path');
  
  console.log('Step 2: Click button');
  await page.click('button');
  
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
});

// Use page.on for detailed logging
page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', (error) => console.log('PAGE ERROR:', error));
page.on('request', (request) => console.log('REQUEST:', request.url()));
page.on('response', (response) => console.log('RESPONSE:', response.url()));
```

## 🚀 Performance Issues

### Slow Test Execution

**Diagnosis**:
```bash
# Run with timing report
pnpm test --reporter=html

# Check individual test timings in HTML report
pnpm run test:report
```

**Solutions**:

```typescript
// Solution 1: Optimize waits
// Bad
await page.waitForTimeout(5000);

// Good
await page.waitForLoadState('networkidle');

// Solution 2: Parallelize tests
test.describe.configure({ mode: 'parallel' });

// Solution 3: Mock slow API calls
await page.route('**/slow-api/**', (route) => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ data: 'mocked' }),
  });
});
```

### Memory Issues

**Symptoms**: "Out of memory" errors, slow execution

**Solutions**:

```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm test

# Reduce parallel workers
pnpm test --workers=2
```

```typescript
// Close pages when done
test.afterEach(async ({ page }) => {
  await page.close();
});

// Limit concurrent browser contexts
test.describe.configure({ mode: 'serial' });
```

## 🔧 CI/CD Issues

### Tests Pass Locally But Fail in CI

**Common Causes**:
1. Different environment variables
2. Missing dependencies
3. Different browser versions
4. Race conditions (timing)
5. Missing test data

**Solutions**:

```yaml
# Ensure same browser version
- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps chromium

# Set environment variables
- name: Run tests
  env:
    BASE_URL: ${{ secrets.BASE_URL }}
    CI: true
  run: pnpm test

# Increase timeouts in CI
- name: Run tests
  run: pnpm test --timeout=120000
```

### Screenshot/Video Not Captured

**Verify Configuration**:

```typescript
// playwright.config.ts
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

**Manual Capture**:

```typescript
test('my test', async ({ page }) => {
  try {
    // Test steps
  } catch (error) {
    await page.screenshot({ path: 'failure.png' });
    throw error;
  }
});
```

## 📖 Additional Resources

- [Playwright Debugging](https://playwright.dev/docs/debug)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 🆘 Need More Help?

1. Check [GitHub Issues](https://github.com/microsoft/playwright/issues)
2. Review [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)
3. Join [Playwright Discord](https://aka.ms/playwright/discord)
4. Contact QA team
