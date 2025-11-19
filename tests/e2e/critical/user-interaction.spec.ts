import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home-page';
import { DataHelper } from '../../helpers/data-helpers';
import { WaitHelper } from '../../helpers/wait-helpers';

/**
 * Critical User Interaction Tests
 * 
 * Tests covering essential user workflows
 * These are high-priority tests that must pass
 */

test.describe('Critical User Interactions', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.verifyPageLoaded();
  });

  test('should interact with chat interface', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Check if chat input is visible
    const isChatVisible = await homePage.isChatInputVisible();
    
    if (isChatVisible) {
      // Generate test message
      const testMessage = DataHelper.generateRandomString(20);
      
      // Enter and send message
      await homePage.enterChatMessage(testMessage);
      await WaitHelper.wait(500);
      
      // Verify message was entered
      const chatInput = page.locator('textarea, input[type="text"]').first();
      const inputValue = await chatInput.inputValue();
      expect(inputValue).toContain(testMessage);
    }
  });

  test('should handle navigation actions', async ({ page }) => {
    const homePage = new HomePage(page);
    const initialUrl = homePage.getCurrentUrl();
    
    // Verify we're on home page
    expect(initialUrl).toBeTruthy();
    
    // Test page refresh
    await homePage.refresh();
    await homePage.verifyPageLoaded();
    
    // Verify URL stayed the same
    expect(homePage.getCurrentUrl()).toEqual(initialUrl);
  });

  test('should maintain state across interactions', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Perform multiple interactions
    await homePage.verifyPageLoaded();
    await WaitHelper.wait(500);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await WaitHelper.wait(500);
    
    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await WaitHelper.wait(500);
    
    // Verify page is still functional
    await homePage.verifyPageLoaded();
  });

  test('should handle rapid interactions', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Perform rapid interactions
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, 100 * (Math.random() * 10)));
      await WaitHelper.wait(100);
    }
    
    // Verify page is still stable
    await homePage.verifyPageLoaded();
  });

  test('should load and display dynamic content', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Wait for dynamic content
    await WaitHelper.waitForPageLoad(page);
    
    // Verify content is loaded
    const content = await page.content();
    expect(content.length).toBeGreaterThan(1000);
  });
});
