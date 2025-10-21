import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class LoginLocators extends CommonLocators {
  // Login-specific locator properties
  loginModal!: Locator;
  usernameInput!: Locator;
  passwordInput!: Locator;
  loginButton!: Locator;
  closeModalButton!: Locator;
  
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
    
    // Login modal locators
    this.loginModal = this.page.locator('//div[@id="logInModal"]');
    this.usernameInput = this.page.locator('//input[@id="loginusername"]');
    this.passwordInput = this.page.locator('//input[@id="loginpassword"]');
    this.loginButton = this.page.locator('(//button[contains(text(), "Log in")])[2]');
    this.closeModalButton = this.page.locator('//div[@id="logInModal"]//button[@class="close"]');
  }
}
