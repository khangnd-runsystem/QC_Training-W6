import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class CheckoutLocators extends CommonLocators {
  // Checkout form locator properties
  checkoutModal!: Locator;
  nameInput!: Locator;
  countryInput!: Locator;
  cityInput!: Locator;
  creditCardInput!: Locator;
  monthInput!: Locator;
  yearInput!: Locator;
  purchaseButton!: Locator;
  closeCheckoutButton!: Locator;

  // Confirmation modal locator properties
  confirmationModal!: Locator;
  confirmationMessage!: Locator;
  orderIdText!: Locator;
  amountText!: Locator;
  confirmOkButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();

    // Checkout form locators
    this.checkoutModal = this.page.locator('#orderModal');
    this.nameInput = this.page.locator('#name');
    this.countryInput = this.page.locator('#country');
    this.cityInput = this.page.locator('#city');
    this.creditCardInput = this.page.locator('#card');
    this.monthInput = this.page.locator('#month');
    this.yearInput = this.page.locator('#year');
    this.purchaseButton = this.page.locator('button:has-text("Purchase")');
    this.closeCheckoutButton = this.page.locator('#orderModal .close');

    // Confirmation modal locators
    this.confirmationModal = this.page.locator('.sweet-alert');
    this.confirmationMessage = this.page.locator('.sweet-alert h2');
    this.orderIdText = this.page.locator('.sweet-alert p');
    this.amountText = this.page.locator('.sweet-alert p');
    this.confirmOkButton = this.page.locator('.sweet-alert button');
  }
}
