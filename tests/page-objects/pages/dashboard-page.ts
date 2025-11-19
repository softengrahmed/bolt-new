import { BasePage } from '../base-page';

export class DashboardPage extends BasePage {
    async isLoaded(page) {
        return await page.isVisible('#dashboard');
    }
}