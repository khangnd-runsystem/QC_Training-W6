import { expect, Page } from "@playwright/test";
import { CommonPage } from "../../common-page";
import { LoginLocators } from "../../../locators/login-locators";
import { LoginCredentials } from "../../../interfaces/login-credentials";

export class LoginPage extends CommonPage {
  readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  // Business-level methods
  async openLoginModal(): Promise<void> {
    await this.click(this.locators.navbarLogin);
    await this.waitForVisible(this.locators.loginModal);
  }

  async loginWithValidAccount(credentials: LoginCredentials): Promise<void> {
    await this.openLoginModal();
    await this.fill(this.locators.usernameInput, credentials.username);
    await this.fill(this.locators.passwordInput, credentials.password);
    await this.click(this.locators.loginButton);
    await this.waitForHidden(this.locators.loginModal);
    // Wait for welcome message to appear after successful login
    await this.waitForVisible(this.locators.welcomeMessage);
  }

  async verifyLoginSuccess(username: string): Promise<void> {
    await this.waitForVisible(this.locators.welcomeMessage);
    await expect.soft(this.locators.welcomeMessage).toContainText(`Welcome ${username}`);
  }

  async verifyLogoutButtonVisible(): Promise<void> {
    await expect.soft(this.locators.navbarLogout).toBeVisible();
  }

  async verifyLoginButtonHidden(): Promise<void> {
    await expect.soft(this.locators.navbarLogin).toBeHidden();
  }
}
