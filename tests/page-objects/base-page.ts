export class BasePage {
    async navigate(page, url) {
        await page.goto(url);
    }

    async waitForElement(page, selector) {
        await page.waitForSelector(selector);
    }

    async takeScreenshot(page, name) {
        await page.screenshot({ path: `screenshots/${name}.png` });
    }
}