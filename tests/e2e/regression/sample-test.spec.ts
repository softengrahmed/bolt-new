import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/pages/dashboard-page';

const dashboardPage = new DashboardPage();

test('Regression Test - Dashboard Load', async ({ page }) => {
    await dashboardPage.navigate(page);
    expect(await dashboardPage.isLoaded()).toBe(true);
});