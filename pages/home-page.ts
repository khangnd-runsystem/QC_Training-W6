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
    await this.page.waitForTimeout(1000); // Wait for product list to update
  }

  async selectProduct(productName: string): Promise<void> {
    const productLocator = this.locators.getProductCard(productName);
    await this.waitForVisible(productLocator);
    await this.click(productLocator);
  }

  async navigateToCart(): Promise<void> {
    await this.click(this.commonLocators.navbarCart);
  }

  async navigateToHome(): Promise<void> {
    await this.click(this.commonLocators.navbarHome);
  }

  async clickLogout(): Promise<void> {
    await this.click(this.commonLocators.navbarLogout);
  }

  async verifyWelcomeMessage(username: string): Promise<void> {
    await expect.soft(this.commonLocators.welcomeMessage).toContainText(`Welcome ${username}`);
  }
}
