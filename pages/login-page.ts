import { expect, Page } from "@playwright/test";
import { CommonPage } from "./common-page";
import { LoginLocators } from "../locators/login-locators";
import { LoginCredentials } from "../interfaces/login-credentials";

export class LoginPage extends CommonPage {
  readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  // Business-level methods
  async openLoginModal(): Promise<void> {
    await this.click(this.commonLocators.navbarLogin);
    await this.waitForVisible(this.locators.loginModal);
  }

  async loginWithValidAccount(credentials: LoginCredentials): Promise<void> {
    await this.openLoginModal();
    await this.fill(this.locators.usernameInput, credentials.username);
    await this.fill(this.locators.passwordInput, credentials.password);
    await this.click(this.locators.loginButton);
    await this.waitForHidden(this.locators.loginModal);
  }

  async verifyLoginSuccess(username: string): Promise<void> {
    await expect.soft(this.commonLocators.welcomeMessage).toContainText(`Welcome ${username}`);
  }

  async verifyLogoutButtonVisible(): Promise<void> {
    await expect.soft(this.commonLocators.navbarLogout).toBeVisible();
  }

  async verifyLoginButtonHidden(): Promise<void> {
    await expect.soft(this.commonLocators.navbarLogin).toBeHidden();
  }
}
