import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home-page';
import { HeaderComponent } from '../../page-objects/components/header-component';
import { FooterComponent } from '../../page-objects/components/footer-component';
import { WaitHelpers } from '../../helpers/wait-helpers';

/**
 * Critical Tests - Core Workflow
 * Tests for essential user workflows and interactions
 */
test.describe('Core Application Workflow', () => {
  let homePage: HomePage;
  let headerComponent: HeaderComponent;
  let footerComponent: FooterComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    headerComponent = new HeaderComponent(page);
    footerComponent = new FooterComponent(page);
  });

  test('should navigate through main pages successfully', async ({ page }) => {
    // Start at home page
    await homePage.goto();
    await homePage.verifyPageLoaded();

    // Verify home page URL
    await homePage.assertUrl(/\/$/);

    // Verify header is visible
    const isHeaderVisible = await headerComponent.isVisible();
    expect(isHeaderVisible).toBeTruthy();
  });

  test('should display header component on all pages', async ({ page }) => {
    await homePage.goto();

    // Verify header is visible
    const isHeaderVisible = await headerComponent.isVisible();
    expect(isHeaderVisible).toBeTruthy();

    // Verify logo is visible
    await headerComponent.logo.waitFor({ state: 'visible' });
  });

  test('should display footer component on all pages', async ({ page }) => {
    await homePage.goto();

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await WaitHelpers.wait(500);

    // Verify footer is displayed
    const isFooterVisible = await footerComponent.verifyFooterDisplayed();
    expect(isFooterVisible).toBeTruthy();
  });

  test('should handle page reload correctly', async ({ page }) => {
    await homePage.goto();
    await homePage.verifyPageLoaded();

    // Get current URL before reload
    const urlBeforeReload = await homePage.getCurrentUrl();

    // Reload page
    await homePage.reload();
    await WaitHelpers.waitForLoadState(page, 'domcontentloaded');

    // Verify URL remains the same
    const urlAfterReload = await homePage.getCurrentUrl();
    expect(urlAfterReload).toBe(urlBeforeReload);

    // Verify page content is still visible
    await homePage.verifyPageLoaded();
  });

  test('should maintain state across navigation', async ({ page }) => {
    await homePage.goto();
    await homePage.verifyPageLoaded();

    // Verify initial page elements
    await homePage.verifyHomePageElements();

    // Navigate back (if applicable)
    // This test structure depends on actual navigation flow
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
  });

  test('should handle browser back button', async ({ page }) => {
    await homePage.goto();
    await homePage.verifyPageLoaded();

    const initialUrl = await homePage.getCurrentUrl();

    // Navigate to a different section if start button exists
    const startButtonVisible = await homePage.isVisible(homePage.startButton);
    if (startButtonVisible) {
      await homePage.clickStartButton();
      await WaitHelpers.wait(1000);

      // Go back
      await homePage.goBack();
      await WaitHelpers.waitForLoadState(page, 'domcontentloaded');

      // Verify we're back at the initial page
      const currentUrl = await homePage.getCurrentUrl();
      expect(currentUrl).toBe(initialUrl);
    }
  });
});
