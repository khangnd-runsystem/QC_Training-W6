import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class HomeLocators extends CommonLocators {
  // Category locator properties
  categoryPhones!: Locator;
  categoryLaptops!: Locator;
  categoryMonitors!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();

    this.categoryPhones = this.page.locator('a:has-text("Phones")');
    this.categoryLaptops = this.page.locator('a:has-text("Laptops")');
    this.categoryMonitors = this.page.locator('a:has-text("Monitors")');
  }

  // Dynamic locator methods
  getProductCard(productName: string): Locator {
    return this.page.locator(`.card-title a:has-text("${productName}")`);
  }
}
