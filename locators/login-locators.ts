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
    this.navbarHome = this.page.locator('a.nav-link:has-text("Home")');
    this.navbarCart = this.page.locator('a#cartur');
    this.navbarLogin = this.page.locator('a#login2');
    this.navbarLogout = this.page.locator('a#logout2');
    this.welcomeMessage = this.page.locator('a#nameofuser');
    
    // Login modal locators
    this.loginModal = this.page.locator('#logInModal');
    this.usernameInput = this.page.locator('#loginusername');
    this.passwordInput = this.page.locator('#loginpassword');
    this.loginButton = this.page.locator('button:has-text("Log in")').nth(1);
    this.closeModalButton = this.page.locator('#logInModal .close');
  }
}
