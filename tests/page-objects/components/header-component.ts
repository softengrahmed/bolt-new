export class HeaderComponent {
    async getTitle(page) {
        return await page.title();
    }
}