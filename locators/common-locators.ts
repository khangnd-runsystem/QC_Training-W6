import { Locator, Page } from "@playwright/test";

export class CommonLocators {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
    this.initializeLocators();
  }

  public setPage(newPage: Page): void {
    if (newPage !== this.page) {
      this.page = newPage;
      this.initializeLocators();
    }
  }

  public getPage(): Page {
    return this.page;
  }

  // Common locator properties - shared across all pages
  navbarHome!: Locator;
  navbarCart!: Locator;
  navbarLogin!: Locator;
  navbarLogout!: Locator;
  welcomeMessage!: Locator;

  protected initializeLocators(): void {
    // Initialize common selectors used across multiple pages
    this.navbarHome = this.page.locator('a.nav-link:has-text("Home")');
    this.navbarCart = this.page.locator('a#cartur');
    this.navbarLogin = this.page.locator('a#login2');
    this.navbarLogout = this.page.locator('a#logout2');
    this.welcomeMessage = this.page.locator('a#nameofuser');
  }
}
