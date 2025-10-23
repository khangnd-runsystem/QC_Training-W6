import { expect, Page } from "@playwright/test";
import { CommonPage } from "./common-page";
import { HomeLocators } from "../locators/home-locators";

export class HomePage extends CommonPage {
  readonly locators: HomeLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HomeLocators(page);
  }

  // Business-level methods
  async selectCategory(categoryName: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    let categoryLocator;
    switch(categoryName) {
      case 'Phones':
        categoryLocator = this.locators.categoryPhones;
        break;
      case 'Laptops':
        categoryLocator = this.locators.categoryLaptops;
        break;
      case 'Monitors':
        categoryLocator = this.locators.categoryMonitors;
        break;
    }
    await this.click(categoryLocator);
    // Wait longer for product list to update via AJAX
    await this.page.waitForLoadState("domcontentloaded");
  }

  async selectProduct(productName: string): Promise<void> {
    const productLocator = this.locators.getProductCard(productName);
    // Use a longer timeout for product cards to appear after category selection
    await productLocator.waitFor({ state: 'visible', timeout: 30000 });
    await this.click(productLocator);
  }

  async navigateToCart(): Promise<void> {
    await this.click(this.locators.navbarCart);
  }

  async navigateToHome(): Promise<void> {
    await this.click(this.locators.navbarHome);
  }

  async clickLogout(): Promise<void> {
    await this.click(this.locators.navbarLogout);
  }

  async verifyWelcomeMessage(username: string): Promise<void> {
    await expect.soft(this.locators.welcomeMessage).toContainText(`Welcome ${username}`);
  }
}
