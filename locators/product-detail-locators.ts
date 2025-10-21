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

    this.productName = this.page.locator('//h2[@class="name"]');
    this.productPrice = this.page.locator('//h3[@class="price-container"]');
    this.productDescription = this.page.locator('//div[@id="more-information"]');
    this.addToCartButton = this.page.locator('//a[contains(text(), "Add to cart")]');
  }
}
