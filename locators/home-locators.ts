import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class HomeLocators extends CommonLocators {
  // Category locator properties
  categoryPhones!: Locator;
  categoryLaptops!: Locator;
  categoryMonitors!: Locator;
  
  // Navbar locators (moved from CommonLocators for DemoBlaze app)
  navbarHome!: Locator;
  navbarCart!: Locator;
  navbarLogin!: Locator;
  navbarLogout!: Locator;
  welcomeMessage!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();

    // DemoBlaze navbar locators
    this.navbarHome = this.page.locator('//a[@class="nav-link" and contains(text(), "Home")]');
    this.navbarCart = this.page.locator('//a[@id="cartur"]');
    this.navbarLogin = this.page.locator('//a[@id="login2"]');
    this.navbarLogout = this.page.locator('//a[@id="logout2"]');
    this.welcomeMessage = this.page.locator('//a[@id="nameofuser"]');

    // Category locators
    this.categoryPhones = this.page.locator('//a[contains(text(), "Phones")]');
    this.categoryLaptops = this.page.locator('//a[contains(text(), "Laptops")]');
    this.categoryMonitors = this.page.locator('//a[contains(text(), "Monitors")]');
  }
}
