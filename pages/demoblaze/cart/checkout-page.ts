import { expect, Page } from "@playwright/test";
import { CommonPage } from "../../common-page";
import { CheckoutLocators } from "../../../locators/checkout-locators";
import { CheckoutInfo } from "../../../interfaces/checkout-info";
import { MESSAGES } from "../../../constants/messages";

export class CheckoutPage extends CommonPage {
  readonly locators: CheckoutLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CheckoutLocators(page);
  }

  // Business-level methods
  async fillCheckoutForm(info: CheckoutInfo): Promise<void> {
    await this.waitForVisible(this.locators.checkoutModal);
    await this.fill(this.locators.nameInput, info.name);
    await this.fill(this.locators.countryInput, info.country);
    await this.fill(this.locators.cityInput, info.city);
    await this.fill(this.locators.creditCardInput, info.creditCard);
    await this.fill(this.locators.monthInput, info.month);
    await this.fill(this.locators.yearInput, info.year);
  }

  async clickPurchase(): Promise<void> {
    await this.click(this.locators.purchaseButton);
    await this.waitForVisible(this.locators.confirmationModal);
  }

  async verifyConfirmationMessage(expectedMessage: string): Promise<void> {
    await expect.soft(this.locators.confirmationMessage).toContainText(expectedMessage);
  }

  async verifyOrderIdExists(): Promise<void> {
    const orderText = await this.getText(this.locators.orderIdText);
    const match = orderText.match(/Id:\s*(\d+)/);
    const orderId = match ? match[1] : '';
    expect.soft(orderId).toBeTruthy();
  }

  async verifyOrderAmountExists(): Promise<void> {
    const amountText = await this.getText(this.locators.amountText);
    const match = amountText.match(/Amount:\s*(\d+)/);
    const amount = match ? parseFloat(match[1]) : 0;
    expect.soft(amount).toBeGreaterThan(0);
  }

  async verifyOrderConfirmation(): Promise<void> {
    await this.verifyOrderIdExists();
    await this.verifyOrderAmountExists();
  }

  private async getOrderId(): Promise<string> {
    const orderText = await this.getText(this.locators.orderIdText);
    // Extract order ID from text (e.g., "Id: 12345")
    const match = orderText.match(/Id:\s*(\d+)/);
    return match ? match[1] : '';
  }

  private async getOrderAmount(): Promise<number> {
    const amountText = await this.getText(this.locators.amountText);
    // Extract amount from text (e.g., "Amount: 1460 USD")
    const match = amountText.match(/Amount:\s*(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async closeConfirmation(): Promise<void> {
    await this.click(this.locators.confirmOkButton);
  }

  async completeCheckout(info: CheckoutInfo): Promise<void> {
    await this.fillCheckoutForm(info);
    await this.clickPurchase();
    await this.verifyConfirmationMessage(MESSAGES.CHECKOUT_SUCCESS);
    await this.closeConfirmation();
  }
}
