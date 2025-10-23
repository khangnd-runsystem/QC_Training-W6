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
    this.checkoutModal = this.page.locator('//div[@id="orderModal"]');
    this.nameInput = this.page.locator('//input[@id="name"]');
    this.countryInput = this.page.locator('//input[@id="country"]');
    this.cityInput = this.page.locator('//input[@id="city"]');
    this.creditCardInput = this.page.locator('//input[@id="card"]');
    this.monthInput = this.page.locator('//input[@id="month"]');
    this.yearInput = this.page.locator('//input[@id="year"]');
    this.purchaseButton = this.page.locator('//button[contains(text(), "Purchase")]');
    this.closeCheckoutButton = this.page.locator('//div[@id="orderModal"]//button[@class="close"]');

    // Confirmation modal locators
    this.confirmationModal = this.page.locator('//div[contains(@class, "sweet-alert")]');
    this.confirmationMessage = this.page.locator('//div[contains(@class, "sweet-alert")]//h2');
    this.orderIdText = this.page.locator('//div[contains(@class, "sweet-alert")]//p');
    this.amountText = this.page.locator('//div[contains(@class, "sweet-alert")]//p');
    this.confirmOkButton = this.page.locator('//div[@class = "sa-confirm-button-container"]//button');
  }
}
