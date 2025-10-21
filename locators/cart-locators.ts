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

    this.cartTable = this.page.locator('#tbodyid');
    this.cartRow = this.page.locator('#tbodyid tr');
    this.totalPrice = this.page.locator('#totalp');
    this.placeOrderButton = this.page.locator('button:has-text("Place Order")');
  }

  // Dynamic locator methods
  getProductNameInCart(productName: string): Locator {
    return this.page.locator(`#tbodyid tr:has-text("${productName}") td:nth-child(2)`);
  }

  getProductPriceInCart(productName: string): Locator {
    return this.page.locator(`#tbodyid tr:has-text("${productName}") td:nth-child(3)`);
  }

  getDeleteButton(productName: string): Locator {
    return this.page.locator(`#tbodyid tr:has-text("${productName}") a:has-text("Delete")`);
  }
}
