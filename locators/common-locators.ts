import { Locator, Page } from "@playwright/test";

export class CommonLocators {
  protected page: Page;
  planManagementTab!: Locator;
  contractCompanyTab!: Locator;
  settingsTab!: Locator;

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

  protected initializeLocators(): void {
    this.planManagementTab = this.page.locator(
      '//div[@class="hr-sidebar__menu"]//div[text()="プラン管理"]'
    );
    this.contractCompanyTab = this.page.locator(
      '//div[@class="hr-sidebar__menu"]//div[text()="契約企業管理"]'
    );
    this.settingsTab = this.page.locator(
      '//div[@class="hr-sidebar__menu"]//div[text()="各種設定"]'
    );
  }
}
