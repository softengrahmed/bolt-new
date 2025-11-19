import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home-page';
import { HeaderComponent } from '../../page-objects/components/header-component';

/**
 * Health Check Smoke Tests
 * 
 * Quick validation that the application is up and running
 * These tests should complete in < 2 minutes
 */

test.describe('Application Health Check', () => {
  test('should load home page successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to home page
    await homePage.goto();
    
    // Verify page loaded
    await homePage.verifyPageLoaded();
    
    // Verify URL
    expect(page.url()).toContain('/');
  });

  test('should display header components', async ({ page }) => {
    const homePage = new HomePage(page);
    const header = new HeaderComponent(page);
    
    // Navigate to home page
    await homePage.goto();
    
    // Verify header is visible
    await header.verifyHeaderVisible();
    
    // Verify logo is displayed
    await homePage.verifyLogoDisplayed();
  });

  test('should have correct page title', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to home page
    await homePage.goto();
    
    // Get and verify title
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should display main UI elements', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to home page
    await homePage.goto();
    
    // Verify main heading is visible
    const headingText = await homePage.getHeadingText();
    expect(headingText).toBeTruthy();
  });

  test('should be responsive to viewport changes', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await homePage.goto();
    await homePage.verifyPageLoaded();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await homePage.waitForPageLoad();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await homePage.waitForPageLoad();
  });
});
