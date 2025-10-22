import { expect, Page } from "@playwright/test";
import { CommonPage } from "./common-page";
import { CartLocators } from "../locators/cart-locators";

export class CartPage extends CommonPage {
  readonly locators: CartLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CartLocators(page);
  }

  // Business-level methods
  async getCartItems(): Promise<string[]> {
    const rows = await this.locators.cartRow.all();
    const items: string[] = [];
    for (const row of rows) {
      const nameCell = row.locator('td:nth-child(2)');
      const name = await nameCell.textContent();
      if (name) items.push(name.trim());
    }
    return items;
  }

  async verifyProductInCart(productName: string): Promise<void> {
    await this.page.waitForTimeout(5000);
    const productLocator = this.locators.getProductNameInCart(productName);
    await expect.soft(productLocator).toBeVisible();
  }

  async verifyProductPrice(productName: string, expectedPrice: number): Promise<void> {
    await this.page.waitForTimeout(5000);
    const priceLocator = this.locators.getProductPriceInCart(productName);
    const priceText = await this.getText(priceLocator);
    const actualPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    expect.soft(actualPrice).toBe(expectedPrice);
  }

  async removeProduct(productName: string): Promise<void> {
    const deleteButton = this.locators.getDeleteButton(productName);
    await this.click(deleteButton);
    await this.page.waitForTimeout(1000); // Wait for cart to update
  }

  async getTotalPrice(): Promise<number> {
    const totalText = await this.getText(this.locators.totalPrice);
    return parseFloat(totalText.replace(/[^0-9.]/g, ''));
  }

  async verifyTotalPrice(expectedTotal: number): Promise<void> {
    await this.page.waitForTimeout(5000);
    const actualTotal = await this.getTotalPrice();
    expect.soft(actualTotal).toBe(expectedTotal);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.click(this.locators.placeOrderButton);
  }

  async verifyCartEmpty(): Promise<void> {
    const rowCount = await this.count(this.locators.cartRow);
    expect.soft(rowCount).toBe(0);
  }

  /**
   * Clear all items from cart by removing the first item repeatedly
   * This avoids issues with duplicate product names
   */
  async clearCart(): Promise<void> {
    await this.page.waitForTimeout(5000); // Wait for cart to update

    let itemCount = await this.count(this.locators.cartRow);
    
    while (itemCount > 0) {
      const firstDeleteButton = this.locators.getFirstDeleteButton();
      await this.click(firstDeleteButton);
      await this.page.waitForTimeout(5000); // Wait for cart to update
      itemCount = await this.count(this.locators.cartRow);
    }
  }
}
