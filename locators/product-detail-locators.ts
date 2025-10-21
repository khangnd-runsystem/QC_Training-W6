import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class ProductDetailLocators extends CommonLocators {
  // Product detail locator properties
  productName!: Locator;
  productPrice!: Locator;
  productDescription!: Locator;
  addToCartButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();

    this.productName = this.page.locator('h2.name');
    this.productPrice = this.page.locator('h3.price-container');
    this.productDescription = this.page.locator('#more-information');
    this.addToCartButton = this.page.locator('a:has-text("Add to cart")');
  }
}
