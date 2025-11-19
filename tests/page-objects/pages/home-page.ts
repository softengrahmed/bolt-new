import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

/**
 * HomePage - Page Object for the application home/landing page
 * 
 * Represents the main entry point of the Bolt application
 */
export class HomePage extends BasePage {
  // Locators
  private readonly logo: Locator;
  private readonly mainHeading: Locator;
  private readonly chatInput: Locator;
  private readonly sendButton: Locator;
  private readonly newChatButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.logo = page.locator('[data-testid="app-logo"]').or(page.locator('header img, nav img').first());
    this.mainHeading = page.locator('h1').first();
    this.chatInput = page.locator('textarea, input[type="text"]').first();
    this.sendButton = page.locator('button[type="submit"]').or(page.getByRole('button', { name: /send|submit/i }));
    this.newChatButton = page.getByRole('button', { name: /new chat|start/i });
  }

  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Verify page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.assertVisible(this.mainHeading, 'Main heading should be visible on home page');
  }

  /**
   * Get main heading text
   */
  async getHeadingText(): Promise<string> {
    return await this.getText(this.mainHeading);
  }

  /**
   * Check if chat input is visible
   */
  async isChatInputVisible(): Promise<boolean> {
    return await this.isVisible(this.chatInput);
  }

  /**
   * Enter text in chat input
   * @param text - Text to enter
   */
  async enterChatMessage(text: string): Promise<void> {
    await this.fill(this.chatInput, text);
  }

  /**
   * Click send button
   */
  async clickSend(): Promise<void> {
    await this.click(this.sendButton);
  }

  /**
   * Send a complete chat message
   * @param message - Message to send
   */
  async sendMessage(message: string): Promise<void> {
    await this.enterChatMessage(message);
    await this.clickSend();
    await this.page.waitForTimeout(1000); // Wait for message to be sent
  }

  /**
   * Click new chat button
   */
  async startNewChat(): Promise<void> {
    if (await this.isVisible(this.newChatButton)) {
      await this.click(this.newChatButton);
    }
  }

  /**
   * Verify logo is displayed
   */
  async verifyLogoDisplayed(): Promise<void> {
    await this.assertVisible(this.logo, 'Application logo should be visible');
  }
}
