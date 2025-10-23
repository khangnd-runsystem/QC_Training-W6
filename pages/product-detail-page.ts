import { expect, Page } from "@playwright/test";
import { CommonPage } from "./common-page";
import { ProductDetailLocators } from "../locators/product-detail-locators";
import { MESSAGES } from "../constants/messages";

export class ProductDetailPage extends CommonPage {
  readonly locators: ProductDetailLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new ProductDetailLocators(page);
  }

  // Business-level methods
  async addToCart(): Promise<void> {
    // Setup dialog listener and wait for it
    const dialogPromise = this.page.waitForEvent('dialog');
    
    await this.click(this.locators.addToCartButton);
    
    // Wait for and accept the dialog
    const dialog = await dialogPromise;
    console.log(`Alert message: ${dialog.message()}`);
    await dialog.accept();
    
    // Wait a moment after alert is handled
    await this.page.waitForTimeout(500);
  }

  async verifyProductName(expectedName: string): Promise<void> {
    await expect.soft(this.locators.productName).toHaveText(expectedName);
  }

  async verifyProductPrice(expectedPrice: number): Promise<void> {
    const priceText = await this.getText(this.locators.productPrice);
    const actualPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    expect.soft(actualPrice).toBe(expectedPrice);
  }

  async navigateBack(): Promise<void> {
    await this.page.goBack();
  }
}
