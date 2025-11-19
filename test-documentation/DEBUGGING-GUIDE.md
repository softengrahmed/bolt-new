# Test Debugging Guide

## 🔍 Table of Contents

- [Overview](#overview)
- [Common Issues](#common-issues)
- [Debugging Tools](#debugging-tools)
- [Troubleshooting Steps](#troubleshooting-steps)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## 🎯 Overview

This guide helps you debug failing tests efficiently and resolve common issues in the Playwright test suite.

## 🚫 Common Issues

### 1. Element Not Found

**Symptoms:**
```
Error: Timeout 30000ms exceeded.
  locator.click: Target closed
```

**Causes:**
- Element doesn't exist on page
- Wrong locator selector
- Element not yet loaded
- Element in iframe

**Solutions:**

```typescript
// ✅ Add proper wait
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('button').click();

// ✅ Verify locator
const element = page.locator('button');
const count = await element.count();
console.log(`Found ${count} elements`);

// ✅ Check if in iframe
const frame = page.frameLocator('iframe');
await frame.locator('button').click();
```

### 2. Test Timeout

**Symptoms:**
```
Test timeout of 30000ms exceeded.
```

**Solutions:**

```typescript
// Increase test timeout
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  await slowOperation();
});

// Increase specific action timeout
await page.goto(url, { timeout: 60000 });
await element.click({ timeout: 10000 });
```

### 3. Flaky Tests

**Symptoms:**
- Tests pass locally but fail in CI
- Tests fail intermittently

**Causes:**
- Race conditions
- Network timing issues
- Insufficient waits

**Solutions:**

```typescript
// ✅ Wait for network idle
await page.goto(url, { waitUntil: 'networkidle' });

// ✅ Wait for specific condition
await page.waitForFunction(() => {
  return document.querySelector('.loaded') !== null;
});

// ✅ Use retry logic
await WaitHelpers.retryUntilSuccess(
  async () => await element.click(),
  3, // max attempts
  1000 // delay between attempts
);
```

### 4. Authentication Issues

**Symptoms:**
- Login not working
- Session not persisting

**Solutions:**

```typescript
// ✅ Wait for navigation after login
await loginPage.login(username, password);
await page.waitForURL('**/dashboard');

// ✅ Verify authentication state
const cookies = await page.context().cookies();
console.log('Cookies:', cookies);
```

### 5. Assertion Failures

**Symptoms:**
```
Expected: "Welcome"
Received: "Loading..."
```

**Solutions:**

```typescript
// ✅ Wait for expected state
await expect(element).toContainText('Welcome', { timeout: 10000 });

// ✅ Add soft assertions for debugging
const text = await element.textContent();
console.log('Actual text:', text);
await expect(element).toContainText('Welcome');
```

## 🫠 Debugging Tools

### 1. Playwright Inspector

```bash
# Launch inspector
npx playwright test --debug

# Debug specific test
npx playwright test tests/e2e/smoke/health-check.spec.ts --debug
```

**Features:**
- Step through test execution
- Inspect page state
- Try locators interactively
- View console logs

### 2. Headed Mode

```bash
# Run with visible browser
npm run test:headed

# Or directly
npx playwright test --headed
```

**Use when:**
- Debugging visual issues
- Understanding user flow
- Verifying animations

### 3. Slow Motion

```bash
# Slow down execution
npx playwright test --headed --slow-mo=1000
```

### 4. Trace Viewer

```bash
# Run with tracing
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

**Trace includes:**
- Screenshots at each step
- Network activity
- Console logs
- Action timeline

### 5. Screenshots and Videos

```typescript
// Take screenshot manually
await page.screenshot({ path: 'debug.png', fullPage: true });

// Record video (configured in playwright.config.ts)
video: 'on' // Always record
video: 'retain-on-failure' // Only keep on failure
```

### 6. Console Logging

```typescript
// Page console logs
page.on('console', msg => console.log('PAGE LOG:', msg.text()));

// Debug current state
console.log('Current URL:', page.url());
console.log('Page title:', await page.title());

// Element debugging
const element = page.locator('button');
console.log('Element count:', await element.count());
console.log('Element text:', await element.textContent());
console.log('Element visible:', await element.isVisible());
```

## 🔍 Troubleshooting Steps

### Step 1: Reproduce Locally

```bash
# Run failing test
npx playwright test path/to/failing-test.spec.ts

# Run in headed mode
npx playwright test path/to/failing-test.spec.ts --headed

# Run with debug
npx playwright test path/to/failing-test.spec.ts --debug
```

### Step 2: Check Test Output

1. Review error message
2. Check stack trace
3. Look at screenshots (in test-results/)
4. Review video if available

### Step 3: Isolate the Issue

```typescript
// Use test.only to run single test
test.only('failing test', async ({ page }) => {
  // Test code
});

// Add console logs
console.log('Before action');
await element.click();
console.log('After action');

// Take screenshots
await page.screenshot({ path: 'before.png' });
await element.click();
await page.screenshot({ path: 'after.png' });
```

### Step 4: Verify Locators

```typescript
// Check if element exists
const count = await page.locator('button').count();
console.log(`Found ${count} buttons`);

// Get all matching elements
const elements = await page.locator('button').all();
for (const el of elements) {
  console.log(await el.textContent());
}

// Use Playwright Inspector to test locators
// npx playwright test --debug
```

### Step 5: Check Timing

```typescript
// Add explicit waits
await page.waitForLoadState('networkidle');
await element.waitFor({ state: 'visible' });

// Wait for specific condition
await page.waitForFunction(() => {
  return document.readyState === 'complete';
});
```

### Step 6: Review Recent Changes

- Check git history
- Review recent commits
- Compare with working version

```bash
# View recent changes
git log --oneline tests/

# See specific file changes
git diff HEAD~1 tests/path/to/file.spec.ts
```

## 🎯 Best Practices

### 1. Write Debugging-Friendly Tests

```typescript
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Step 1: Navigate
  console.log('Step 1: Navigating to login page');
  await loginPage.goto();
  
  // Step 2: Enter credentials
  console.log('Step 2: Entering credentials');
  await loginPage.fill(loginPage.usernameInput, username);
  await loginPage.fill(loginPage.passwordInput, password);
  
  // Step 3: Submit
  console.log('Step 3: Submitting form');
  await loginPage.click(loginPage.loginButton);
  
  // Step 4: Verify
  console.log('Step 4: Verifying success');
  await expect(page).toHaveURL(/dashboard/);
});
```

### 2. Use Meaningful Error Messages

```typescript
// ✅ Good
await expect(element).toBeVisible({ 
  timeout: 10000 
});

// ✅ Better
await expect(element).toBeVisible({ 
  timeout: 10000,
  message: 'Login button should be visible after page load'
});
```

### 3. Add Test Annotations

```typescript
test('complex test', async ({ page }) => {
  test.info().annotations.push({
    type: 'issue',
    description: 'Related to issue #123'
  });
  
  // Test code
});
```

### 4. Use Soft Assertions for Debugging

```typescript
// Continue test even if assertion fails
await expect.soft(element1).toBeVisible();
await expect.soft(element2).toBeVisible();
await expect.soft(element3).toBeVisible();
// All assertions will be evaluated
```

## ❓ FAQ

### Q: Why do tests pass locally but fail in CI?

**A:** Common reasons:
- Different environment configurations
- Timing differences (CI is often slower)
- Missing environment variables
- Browser versions differ

**Solutions:**
- Run tests in Docker locally to match CI
- Increase timeouts in CI
- Add explicit waits
- Check CI logs and artifacts

### Q: How do I debug CI failures?

**A:** Steps:
1. Download test artifacts from CI
2. Review screenshots and videos
3. Check trace files
4. Review CI logs
5. Try to reproduce with same config locally

### Q: What if a test is flaky?

**A:** Strategies:
1. Add proper waits
2. Use `waitForLoadState('networkidle')`
3. Implement retry logic
4. Check for race conditions
5. Add test stability markers

```typescript
test('flaky test', async ({ page }) => {
  test.slow(); // Mark as slow (3x timeout)
  // Test code
});
```

### Q: How do I debug authentication issues?

**A:** Steps:
1. Verify credentials in fixtures
2. Check if login endpoint is correct
3. Verify cookies are set
4. Check network requests
5. Add explicit waits after login

```typescript
// Debug authentication
const cookies = await page.context().cookies();
console.log('Auth cookies:', cookies);

const storage = await page.context().storageState();
console.log('Storage state:', storage);
```

### Q: How to handle dynamic content?

**A:** Use proper waiting strategies:

```typescript
// Wait for element
await page.waitForSelector('.dynamic-content');

// Wait for specific text
await page.waitForFunction(() => {
  const element = document.querySelector('.status');
  return element?.textContent === 'Ready';
});

// Polling strategy
await expect(async () => {
  const text = await element.textContent();
  expect(text).toBe('Expected');
}).toPass({ timeout: 10000 });
```

## 📞 Getting Help

1. **Check Documentation**
   - README-TESTING.md
   - CONTRIBUTING-TESTS.md
   - Playwright docs

2. **Review Examples**
   - Look at similar tests
   - Check page objects

3. **Ask Team**
   - QA team chat
   - Code review feedback

4. **Community Resources**
   - Playwright Discord
   - Stack Overflow
   - GitHub Issues

---

**Happy Debugging! 🐛✔️**
