export async function waitForElementToBeVisible(page, selector) {
    await page.waitForSelector(selector, { state: 'visible' });
}