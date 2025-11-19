import { test, expect } from '@playwright/test';

test('Smoke Test - Health Check', async ({ page }) => {
    await page.goto('https://example.com');
    expect(await page.title()).toBe('Example Domain');
});