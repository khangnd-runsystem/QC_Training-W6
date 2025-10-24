import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class CartLocators extends CommonLocators {
  // Cart locator properties
  cartTable!: Locator;
  cartRow!: Locator;
  totalPrice!: Locator;
  placeOrderButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();

    this.cartTable = this.page.locator('//tbody[@id="tbodyid"]');
    this.cartRow = this.page.locator('//tbody[@id="tbodyid"]//tr');
    this.totalPrice = this.page.locator('//h3[@id="totalp"]');
    this.placeOrderButton = this.page.locator('//button[contains(text(), "Place Order")]');
  }
}
