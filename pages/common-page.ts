import { expect, Locator, Page, test } from "@playwright/test";

import { step } from "../utils/logging";
import { CommonLocators } from "../locators/common-locators";
import { Helper } from "../utils/helper";

type LoadState = "load" | "domcontentloaded" | "networkidle";
const DEFAULT_TIMEOUT = 20000; // Default timeout for navigation and interactions

export class CommonPage {
  readonly commonLocators: CommonLocators;
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.commonLocators = new CommonLocators(page);
  }

  // Group: Navigation
  /**
   * Common method to navigate to a given URL and wait for page readiness
   * @param url - The URL to navigate to
   * @param options - Optional configuration
   *   loadState: 'load' | 'domcontentloaded' | 'networkidle' (default: 'domcontentloaded')
   *   waitForSelector: a selector to wait for after navigation
   *   timeout: max wait time in ms
   */
  @step((url: string) => `Navigate to URL: ${url}`)
  async navigate(
    url: string,
    options?: {
      loadState?: LoadState;
      waitForSelector?: string;
      timeout?: number;
    }
  ): Promise<void> {
    const {
      loadState = "domcontentloaded",
      waitForSelector,
      timeout = DEFAULT_TIMEOUT,
    } = options || {};

    console.log(`[NAVIGATE] Navigating to: ${url} | loadState: ${loadState}`);

    try {
      const response = await this.page.goto(url, {
        waitUntil: loadState,
        timeout,
      });
      if (!response || !response.ok()) {
        console.warn(
          `[NAVIGATE] Warning: Navigation to ${url} returned status ${response?.status()}`
        );
      }

      await this.page.waitForLoadState(loadState, { timeout });

      if (waitForSelector) {
        console.log(`[NAVIGATE] Waiting for selector: ${waitForSelector}`);
        await this.page.waitForSelector(waitForSelector, { timeout });
      }

      console.log(`[NAVIGATE] Navigation to ${url} complete.`);
    } catch (err) {
      console.error(`[NAVIGATE] Failed to navigate to ${url}:`, err);
      throw err;
    }
  }

  /**
   * Waits for the page URL to match the specified pattern.
   *
   * @param pattern - The URL pattern to match, can be a string or RegExp
   * @param timeout - The maximum time to wait in milliseconds, defaults to DEFAULT_TIMEOUT
   * @returns A promise that resolves when the URL matches the pattern
   * @throws Error if the URL doesn't match the pattern within the timeout period
   */
  @step((url: string) => `Wait current url match with: ${url}`)
  async waitForURLMatch(
    pattern: string | RegExp,
    timeout = DEFAULT_TIMEOUT
  ): Promise<void> {
    const finalPattern =
      typeof pattern === "string" ? new RegExp(pattern) : pattern;
    await this.page.waitForURL(finalPattern, { timeout });
  }

  /**
   * Gets the current URL of the page.
   *
   * @returns A promise that resolves to the current URL as a string.
   */
  @step("Get page URL")
  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Reload the current page
   */
  @step("Reload current page")
  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  // Group: Interaction
  /**
   * Click on Locator
   * @param locator
   */
  @step((locator: Locator) => `Click on locator: ${locator}`)
  async click(locator: Locator, option?: object): Promise<void> {
    await this.waitForVisible(locator);
    await expect.soft(locator).toBeVisible();
    await expect.soft(locator).toBeEnabled();
    if (await locator.isEnabled()) {
      const att = await this.getAttribute(locator, "disabled");
      if (att !== "disabled") {
        await locator.click(option);
      }
    }
  }

  /**
   * Fill input value
   * @param locator
   * @param value
   */
  //@step('Fill input value')
  @step(
    (locator: Locator, value: string) => `Fill input value: Locator=${locator}, Value=${value}`
  )
  async fill(
    locator: Locator,
    value: string,
    force: boolean = true
  ): Promise<void> {
    await this.waitForVisible(locator);
    await expect.soft(locator).toBeVisible();
    if ((await locator.isEditable()) && (await locator.isEnabled())) {
      await locator.clear();
      await locator.click();
      await locator.fill(value, { force });
    }
  }

  /**
   * Check on checkbox or radio button
   *
   */
  @step((locator: Locator) => `Check checkbox/radio button: ${locator}`)
  async check(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.check();
  }

  /**
   * Uncheck on checkbox or radio button
   *
   */
  @step((locator: Locator) => `Uncheck checkbox/radio button: ${locator}`)
  async uncheck(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.uncheck();
  }

  /**
   * Click on Text
   * @param text
   */
  @step((text: string) => `Click on Text: ${text}`)
  async clickByText(text: string): Promise<void> {
    await this.page.getByText(text).click();
  }

  /**
   * Double Click on Locator
   * @param locator
   */
  @step((locator: Locator) => `Double Click on Locator: ${locator}`)
  async dblclick(locator: Locator, option?: object): Promise<void> {
    await this.waitForVisible(locator);
    await expect.soft(locator).toBeVisible();
    await expect.soft(locator).toBeEnabled();
    if (await locator.isEnabled()) {
      const att = await this.getAttribute(locator, "disabled");
      if (att !== "disabled") {
        await locator.dblclick(option);
      }
    }
  }
  @step((locator: Locator) => `Right Click on Locator: ${locator}`)
  async rightClick(locator: Locator, option?: object): Promise<void> {
    await this.waitForVisible(locator);
    await expect.soft(locator).toBeVisible();
    await expect.soft(locator).toBeEnabled();
    if (await locator.isEnabled()) {
      const att = await this.getAttribute(locator, "disabled");
      if (att !== "disabled") {
        await locator.click({button: 'right'})
      }
    }
  }

  /**
   * Hover over a Locator
   * @param locator
   */
  @step((locator: Locator) => `Hover over Locator: ${locator}`)
  async hover(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await expect.soft(locator).toBeVisible();
    await locator.hover();
  }

  /**
   * Focuses the element, and then uses keyevents
   * @param locator
   * @param key
   */
  @step((locator: Locator, key: string) => `Focus on locator: ${locator} and press key: ${key}`)
  async press(locator: Locator, key: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.press(key);
  }

  /**
   * Fill input value if it is defined in form
   * @param inputLocator
   * @param value
   */
  @step(
    (inputLocator: Locator, value: string) =>
      `Fill input if visible: Locator=${inputLocator}, Value=${value}`
  )
  async fillInputIfVisible(
    inputLocator: Locator,
    value: string
  ): Promise<void> {
    await this.waitForVisible(inputLocator);
    if (value && (await this.count(inputLocator)) > 0) {
      await this.scrollIntoView(inputLocator);
      await this.fill(inputLocator, value);
    }
  }

  /**
   * Clear input field
   * @param locator
   */
  @step((locator: Locator) => `Clear input field: Locator=${locator}`)
  async clearInput(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.fill("");
  }

  /**
   * Select an option from a custom dropdown (div-based) by visible text
   * @param dropdownLocator - locator to the dropdown input box
   * @param optionText - the text of the option to select
   * @param optionsLocator - optional locator for the list of all options
   */
  @step(
    (dropdownLocator: Locator, optionText: string) =>
      `Select custom dropdown option: Locator=${dropdownLocator}, OptionText=${optionText}`
  )
  async selectOptionByText(
    dropdownLocator: Locator,
    optionText: string,
    optionsLocator?: Locator // optional: allow override for list of options
  ): Promise<void> {
    // Wait for and click the dropdown to open options
    await this.waitForVisible(dropdownLocator);
    await this.click(dropdownLocator);

    // If the dropdown dynamically renders options, you may need a general locator for the options
    const optionToSelect = optionsLocator
      ? optionsLocator.filter({ hasText: optionText })
      : this.page.locator(`text="${optionText}"`);

    await this.waitForVisible(optionToSelect);
    await this.click(optionToSelect.first());
  }

  /**
   * Upload a file to a file input field
   * @param locator
   * @param filePath
   */
  @step(
    (locator: Locator, filePath: string) =>
      `Upload a file to a file input field: Locator=${locator}, FilePath=${filePath}`
  )
  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    // await this.waitForVisible(locator);
    // await expect.soft(locator).toBeVisible();
    await locator.setInputFiles(filePath);
  }

  // Group: Validation
  /**
   * Check Locator is visible or not
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Check Locator is visible or not: Locator=${locator}`)
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check Locator is enabled or not
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Check Locator is enabled or not: Locator=${locator}`)
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Check Locator is editable or not
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Check Locator is editable or not: Locator=${locator}`)
  async isEditable(locator: Locator): Promise<boolean> {
    return await locator.isEditable();
  }

  /**
   * Verify the current URL matches the expected URL
   * @param expectedURL
   */
  @step("Verify the current URL matches the expected URL")
  async verifyURL(expectedURL: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  /**
   * Wait for a specific text to appear in a locator
   * @param locator
   * @param text
   */
  @step(
    (locator: Locator, text: string) =>
      `Wait for text to appear in locator: Locator=${locator}, Text=${text}`
  )
  async waitForText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  /**
   * Wait Locator with visible state
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Wait Locator with visible state: Locator=${locator}`)
  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
  }

  /**
   * Wait Locator with attached state
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Wait Locator with attached state: Locator=${locator}`)
  async waitForAttached(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "attached" });
  }

  /**
   * Wait Locator with detached state
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Wait Locator with detached state: Locator=${locator}`)
  async waitForDetached(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "detached", timeout: DEFAULT_TIMEOUT });
  }

  /**
   * Wait Locator with hidden state
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Wait Locator with hidden state: Locator=${locator}`)
  async waitForHidden(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "hidden" });
  }

  /**
   * Wait for an element to disappear
   * @param locator
   */
  @step((locator: Locator) => `Wait for an element to disappear: Locator=${locator}`)
  async waitForElementToDisappear(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "hidden" });
  }

  /**
   * Wait for a Locator to be enabled
   * @param locator
   */
  @step((locator: Locator) => `Wait for Locator to be enabled: Locator=${locator}`)
  async waitForElementToBeEnabled(locator: Locator): Promise<void> {
    for (let i = 0; i < 10; i++) {
      if (await locator.isEnabled()) return;
      await this.page.waitForTimeout(500); // Wait for 500ms before retrying
    }
    throw new Error("Locator did not become enabled within the expected time");
  }

  /**
   * Retry clicking on a Locator
   * @param locator
   * @param retries - Number of retry attempts (default: 3)
   */
  @step(
    (locator: Locator, retries: number) =>
      `Retry clicking on Locator: Locator=${locator}, Retries=${retries}`
  )
  async retryClick(locator: Locator, retries: number = 3): Promise<void> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await this.click(locator);
        return;
      } catch (error) {
        console.warn(
          `Retry ${attempt + 1} failed for clicking on Locator. Retrying...`
        );
        if (attempt === retries - 1) throw error;
      }
    }
  }

  // Group: Utility
  /**
   * Take a screenshot of the current page
   * @param name - The name of the screenshot file
   */

  @step("Take a screenshot of the current page")
  async takeScreenshot(name: string): Promise<void> {
    if (this.page.isClosed()) {
      console.warn("Cannot take screenshot, the page is already closed.");
      return;
    }
    await Helper.takeScreenshot(this.page, name);

    const buffer = await this.page.screenshot();
    await test.info().attach(name, {
      body: buffer,
      contentType: "image/png",
    });
  }

  /**
   * Get current text of locator
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Get text of locator: Locator=${locator}`)
  async getText(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    const text = await locator.textContent();
    return text ?? "";
  }

  /**
   * Get text by label
   * @param label
   * @returns
   */
  @step((label: string) => `Get text by label: Label=${label}`)
  async getTextByLabel(label: string): Promise<string> {
    const text = await this.page.getByLabel(label).textContent();
    return text ?? "";
  }

  /**
   * Get input value
   * @param locator
   * @returns
   */
  @step((locator: string) => `Get input value: Locator=${locator}`)
  async getInputValue(locator: string): Promise<string> {
    return await this.page.locator(locator).inputValue();
  }

  /**
   * Check Locator attribute
   * @param locator
   * @param attribute
   * @returns
   */
  @step(
    (locator: Locator, attribute: string) =>
      `Check Locator attribute: Locator=${locator}, Attribute=${attribute}`
  )
  async getAttribute(locator: Locator, attribute: string): Promise<string> {
    return (await locator.getAttribute(attribute)) ?? "";
  }

  /**
   * Expect Locator to be hidden
   * @param locator
   */
  @step("Expect Locator to be hidden")
  async toBeHidden(locator: Locator): Promise<void> {
    await expect.soft(locator).toBeHidden();
  }

  /**
   * Scroll an element into view with logging
   * @param locator
   */
  @step((locator: Locator) => `Scroll an element into view: Locator=${locator}`)
  async scrollIntoView(locator: Locator): Promise<void> {
    await expect.soft(locator).toBeVisible();
    console.log("Scrolling element into view");
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get the count of elements matching the locator with logging
   * @param locator
   * @returns
   */
  @step(
    (locator: Locator) =>
      `Get the count of elements matching the locator: Locator=${locator}`
  )
  async count(locator: Locator): Promise<number> {
    const count = await locator.count();
    console.log(`Counted ${count} elements matching the locator`);
    return count;
  }

  /**
   * Get Text of Locator with logging
   * @param locator
   * @param trim - Whether to trim whitespace (default: true)
   * @returns
   */
  @step(
    (locator: Locator, trim: boolean) => `Get Text of Locator: Locator=${locator}, Trim=${trim}`
  )
  async textContent(locator: Locator, trim: boolean = true): Promise<string> {
    await expect.soft(locator).toBeVisible();
    const content = (await locator.textContent()) ?? "";
    const result = trim ? content.trim() : content;
    console.log(`Text content of Locator: ${result}`);
    return result;
  }

  /**
   * Get Inner Text of Locator, if errors, return ''
   * @param locator
   * @returns
   */
  @step((locator: Locator) => `Get Inner Text of Locator: Locator=${locator}`)
  async innerText(locator: Locator): Promise<string> {
    return (await locator.innerText())?.trim() ?? "";
  }

  /**
   * Check if a Locator contains a specific text
   * @param locator
   * @param text
   * @returns
   */
  @step(
    (locator: Locator, text: string) =>
      `Check if a Locator contains a specific text: Locator=${locator}, Text=${text}`
  )
  async checkContainsText(locator: Locator, text: string): Promise<boolean> {
    const content = (await locator.textContent()) ?? "";
    return content?.includes(text) ?? false;
  }

  /**
   * Simulate file download and get the downloaded file path
   * @param triggerAction - Function that triggers the download
   * @returns Path to the downloaded file
   */
  @step("Wait for file download")
  async waitForDownload(triggerAction: () => Promise<void>): Promise<string> {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      triggerAction(),
    ]);

    // Wait for download to complete
    const path = await download.path();

    if (!path) {
      throw new Error("Download failed or was cancelled");
    }

    return path;
  }

  /**
   * Perform a drag and drop operation
   * @param sourceLocator - The element to drag
   * @param targetLocator - The target to drop onto
   */
  @step(
    (sourceLocator: Locator, targetLocator: Locator) =>
      `Drag and drop: ${sourceLocator} to ${targetLocator}`
  )
  async dragAndDrop(
    sourceLocator: Locator,
    targetLocator: Locator
  ): Promise<void> {
    await this.waitForVisible(sourceLocator);
    await this.waitForVisible(targetLocator);

    // Get bounding boxes of both elements
    const sourceBoundingBox = await sourceLocator.boundingBox();
    const targetBoundingBox = await targetLocator.boundingBox();

    if (!sourceBoundingBox || !targetBoundingBox) {
      throw new Error("Unable to get bounding box for drag and drop operation");
    }

    // Calculate source center
    const sourceX = sourceBoundingBox.x + sourceBoundingBox.width / 2;
    const sourceY = sourceBoundingBox.y + sourceBoundingBox.height / 2;

    // Calculate target center
    const targetX = targetBoundingBox.x + targetBoundingBox.width / 2;
    const targetY = targetBoundingBox.y + targetBoundingBox.height / 2;

    // Perform drag and drop
    await this.page.mouse.move(sourceX, sourceY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY, { steps: 10 }); // Smooth movement
    await this.page.mouse.up();
  }
}
