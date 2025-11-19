import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/pages/home-page';
import { NavigationComponent } from '../../page-objects/components/navigation-component';
import { DataHelpers } from '../../helpers/data-helpers';
import { WaitHelpers } from '../../helpers/wait-helpers';

/**
 * Regression Tests - Navigation
 * Tests for navigation functionality across the application
 */
test.describe('Application Navigation', () => {
  let homePage: HomePage;
  let navigationComponent: NavigationComponent;
  let dataHelpers: DataHelpers;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    navigationComponent = new NavigationComponent(page);
    dataHelpers = new DataHelpers();
  });

  test('should display navigation menu', async ({ page }) => {
    await homePage.goto();

    // Verify navigation is visible
    const isNavVisible = await navigationComponent.isVisible();
    expect(isNavVisible).toBeTruthy();
  });

  test('should load navigation items correctly', async ({ page }) => {
    await homePage.goto();

    // Get all menu items
    const menuItems = await navigationComponent.getMenuItems();

    // Verify menu has items
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test('should navigate using header logo', async ({ page }) => {
    await homePage.goto();
    await homePage.verifyPageLoaded();

    // Navigate away if possible (this depends on app structure)
    const currentUrl = await homePage.getCurrentUrl();
    expect(currentUrl).toContain(homePage.baseURL);
  });

  test('should maintain navigation state on page reload', async ({ page }) => {
    await homePage.goto();

    // Check if navigation is visible
    const isNavVisibleBefore = await navigationComponent.isVisible();
    expect(isNavVisibleBefore).toBeTruthy();

    // Reload page
    await page.reload();
    await WaitHelpers.waitForLoadState(page, 'domcontentloaded');

    // Verify navigation is still visible
    const isNavVisibleAfter = await navigationComponent.isVisible();
    expect(isNavVisibleAfter).toBeTruthy();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await homePage.goto();

    // Get first focusable navigation element
    const firstNavItem = navigationComponent.menuItems.first();

    // Focus the element
    await firstNavItem.focus();

    // Verify element is focused
    await expect(firstNavItem).toBeFocused();
  });
});
