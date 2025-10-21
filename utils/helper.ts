import fs from "fs";
import path from "path";
import { Page } from "@playwright/test";

/**
 * Sanitize a string to be safe as a filename
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[:<>\"\/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

/**
 * Ensure a directory exists (recursive)
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Take a screenshot and save under ./test-results by default.
 * Returns the absolute path to the saved file.
 *
 * @param page Playwright Page
 * @param name base name for file (will be sanitized and .png appended)
 * @param folder optional folder (absolute or relative to project root)
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  folder: string = path.join(process.cwd(), "test-results")
): Promise<string> {
  if (page.isClosed()) {
    throw new Error("Cannot take screenshot: page is closed");
  }

  ensureDir(folder);
  const safeName = sanitizeFileName(name || "screenshot");
  const fileName = `${safeName}_${Date.now()}.png`;
  const filePath = path.isAbsolute(folder) ? path.join(folder, fileName) : path.join(process.cwd(), folder, fileName);

  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}                                                                                                                                                                                                                                                                        

// Export Helper object for compatibility
export const Helper = {
  takeScreenshot,
  sanitizeFileName,
  ensureDir,
};