import { BasePage } from '../base-page';

export class LoginPage extends BasePage {
    async login(page, username, password) {
        await this.navigate(page, '/login');
        await page.fill('#username', username);
        await page.fill('#password', password);
        await page.click('#login-button');
    }

    async isLoggedIn(page) {
        return await page.isVisible('#logout-button');
    }
}