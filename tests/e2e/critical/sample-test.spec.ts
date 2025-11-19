import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/pages/login-page';

const loginPage = new LoginPage();

test('Critical User Journey - Login', async ({ page }) => {
    await loginPage.navigate(page);
    await loginPage.login('user@example.com', 'password');
    expect(await loginPage.isLoggedIn()).toBe(true);
});