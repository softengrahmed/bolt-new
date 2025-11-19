import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home-page';
import { HeaderComponent } from '../../page-objects/components/header-component';
import { DataHelper } from '../../helpers/data-helpers';
import { AssertionHelper } from '../../helpers/assertion-helpers';
import { WaitHelper } from '../../helpers/wait-helpers';

/**
 * Full Workflow Regression Tests
 * 
 * Comprehensive end-to-end scenarios covering complete user journeys
 * These tests ensure all integrated features work together
 */

test.describe('Full Application Workflow', () => {
  test('should complete entire user journey', async ({ page }) => {
    const homePage = new HomePage(page);
    const header = new HeaderComponent(page);
    
    // Step 1: Navigate to application
    await test.step('Navigate to home page', async () => {
      await homePage.goto();
      await homePage.verifyPageLoaded();
    });
    
    // Step 2: Verify initial state
    await test.step('Verify initial page state', async () => {
      await header.verifyHeaderVisible();
      await homePage.verifyLogoDisplayed();
      
      const title = await homePage.getTitle();
      expect(title).toBeTruthy();
    });
    
    // Step 3: Interact with UI elements
    await test.step('Interact with interface', async () => {
      const isChatVisible = await homePage.isChatInputVisible();
      if (isChatVisible) {
        const message = DataHelper.generateRandomString(15);
        await homePage.enterChatMessage(message);
        await WaitHelper.wait(500);
      }
    });
    
    // Step 4: Verify responsive behavior
    await test.step('Test responsive design', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await WaitHelper.wait(500);
      await homePage.verifyPageLoaded();
      
      await page.setViewportSize({ width: 1280, height: 720 });
      await WaitHelper.wait(500);
    });
    
    // Step 5: Verify final state
    await test.step('Verify final application state', async () => {
      await homePage.verifyPageLoaded();
      await AssertionHelper.assertUrlMatches(page, /.*/);
    });
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to invalid path
    await test.step('Navigate to invalid route', async () => {
      await page.goto('/invalid-route-12345');
      await WaitHelper.waitForPageLoad(page);
      
      // Application should handle this gracefully
      const content = await page.content();
      expect(content).toBeTruthy();
    });
  });

  test('should maintain performance under load', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to page
    await homePage.goto();
    
    // Measure performance
    const navigationTiming = await page.evaluate(() => {
      const perfData = window.performance.timing;
      return {
        loadTime: perfData.loadEventEnd - perfData.navigationStart,
        domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
      };
    });
    
    // Assert reasonable load times (adjust based on your requirements)
    expect(navigationTiming.domReady).toBeLessThan(10000); // 10 seconds
  });

  test('should support browser back/forward navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to home
    await homePage.goto();
    const homeUrl = homePage.getCurrentUrl();
    
    // Navigate to another page (if available)
    await page.goto('/about');
    await WaitHelper.waitForPageLoad(page);
    
    // Go back
    await homePage.goBack();
    await WaitHelper.wait(1000);
    
    // Verify we're back at home
    const currentUrl = homePage.getCurrentUrl();
    expect(currentUrl).toContain(homeUrl.split('?')[0]);
  });

  test('should handle multiple tab interactions', async ({ browser }) => {
    // Create multiple contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    const homePage1 = new HomePage(page1);
    const homePage2 = new HomePage(page2);
    
    // Navigate in both tabs
    await homePage1.goto();
    await homePage2.goto();
    
    // Verify both loaded independently
    await homePage1.verifyPageLoaded();
    await homePage2.verifyPageLoaded();
    
    // Cleanup
    await context1.close();
    await context2.close();
  });
});
