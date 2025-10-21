import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class LoginLocators extends CommonLocators {
  // Login-specific locator properties
  loginModal!: Locator;
  usernameInput!: Locator;
  passwordInput!: Locator;
  loginButton!: Locator;
  closeModalButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();

    this.loginModal = this.page.locator('#logInModal');
    this.usernameInput = this.page.locator('#loginusername');
    this.passwordInput = this.page.locator('#loginpassword');
    this.loginButton = this.page.locator('button:has-text("Log in")').nth(1);
    this.closeModalButton = this.page.locator('#logInModal .close');
  }
}
