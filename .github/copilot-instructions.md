# Copilot Instructions for W6 Playwright Test Framework

## ⚠️ Critical Rules - DO NOT VIOLATE

1. **NO Markdown File Generation**: Never create `.md` files unless explicitly requested in the user's prompt
2. **NO Base Class Modifications**: Never modify `common-locators.ts` or `common-page.ts` - these are core framework files
3. **Extend, Don't Modify**: Always extend base classes for new features, never change the base implementation

## Architecture Overview

This is a **Playwright TypeScript** test framework for e-commerce testing (DemoBlaze). Uses **Page Object Model** with separate **Locator classes** and **Fixture-based authentication**.

### Key Architectural Patterns

1. **Dual Inheritance Structure**:
   - Pages extend `CommonPage` → inherit utility methods (`click`, `fill`, `waitForVisible`, etc.)
   - Locators extend `CommonLocators` → inherit shared navbar/UI elements
   - Pages compose their locator class: `readonly locators: [Feature]Locators`

2. **Fixture-Based Test Setup** (`tests/base-test.ts`):
   - Export custom `test` with page object fixtures (loginPage, homePage, etc.)
   - `authenticatedPage` fixture provides pre-logged-in state with all page objects
   - Use `import { test, expect } from './base-test'` NOT from `@playwright/test`

3. **Test Data Separation**:
   - `data/` → test data objects (VALID_USER, PRODUCTS, CHECKOUT_DATA)
   - `interfaces/` → TypeScript interfaces
   - `constants/` → URLs, expected messages

## Critical Workflows

### Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.ts

# Debug mode
npx playwright test --debug

# Show report
npx playwright show-report
```

### Creating New Tests

**ALWAYS follow this pattern:**

```typescript
import { test, expect } from './base-test';  // Use custom test fixture!
import { BASE_URL } from '../constants/urls';
import { VALID_USER } from '../data/users';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // For unauthenticated tests
  test('TC### - action - condition - result', async ({ page, loginPage, homePage }) => {
    // Test implementation
  });

  // For authenticated tests  
  test('TC### - action - condition - result', async ({ page, authenticatedPage }) => {
    const { homePage, productDetailPage, cartPage } = authenticatedPage;
    // Already logged in, start testing
  });
});
```

### Creating Page Objects

**Page class pattern:**
```typescript
import { Page } from "@playwright/test";
import { CommonPage } from "./common-page";
import { [Feature]Locators } from "../locators/[feature]-locators";

export class [Feature]Page extends CommonPage {
  readonly locators: [Feature]Locators;

  constructor(page: Page) {
    super(page);
    this.locators = new [Feature]Locators(page);
  }

  // ONLY business-level methods (high-level flows)
  async loginWithValidAccount(credentials: LoginCredentials): Promise<void> {
    await this.openLoginModal();
    await this.fill(this.locators.usernameInput, credentials.username);
    await this.click(this.locators.loginButton);
  }
}
```

**Locator class pattern:**
```typescript
import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class [Feature]Locators extends CommonLocators {
  // Declare locators with definite assignment (!)
  usernameInput!: Locator;
  loginButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();  // Call after super()
  }

  protected initializeLocators(): void {
    super.initializeLocators();  // Initialize parent locators first
    
    this.usernameInput = this.page.locator('#loginusername');
    this.loginButton = this.page.locator('button:has-text("Log in")').nth(1);
  }

  // Dynamic locator methods when needed
  getProductCard(name: string): Locator {
    return this.page.locator(`text="${name}"`);
  }
}
```

## Project-Specific Conventions

### Naming Standards
- Test files: `[feature].spec.ts` (e.g., `login.spec.ts`)
- Test names: `TC### - [action] - [condition] - [result]`
- Page classes: `[Feature]Page` (PascalCase)
- Locator classes: `[Feature]Locators` (PascalCase)
- Methods: `camelCase`, business-level (e.g., `loginWithValidAccount()` not `clickLoginButton()`)

### Assertion Pattern
**ALWAYS use `expect.soft()` for all verifications** to collect all failures in one run:

```typescript
// ✅ Correct - soft assertions
await expect.soft(this.commonLocators.welcomeMessage).toContainText(`Welcome ${username}`);
await expect.soft(this.commonLocators.navbarLogout).toBeVisible();

// ❌ Wrong - hard assertions (use only when test must stop)
await expect(this.commonLocators.welcomeMessage).toContainText(`Welcome ${username}`);
```

### Common Method Usage
When implementing page methods, **reuse from CommonPage** instead of writing direct Playwright calls:

```typescript
// ✅ Correct - use inherited utilities
await this.click(this.locators.loginButton);
await this.fill(this.locators.usernameInput, username);
await this.waitForVisible(this.locators.loginModal);

// ❌ Wrong - bypass CommonPage methods
await this.locators.loginButton.click();
await this.locators.usernameInput.fill(username);
```

### Alert Handling Pattern
Alerts (from "Add to cart") must be accepted before the action completes:

```typescript
async addToCart(): Promise<void> {
  this.page.once('dialog', async dialog => {
    console.log(`Alert message: ${dialog.message()}`);
    await dialog.accept();
  });
  
  await this.click(this.locators.addToCartButton);
  await this.page.waitForTimeout(500);  // Wait for alert handling
}
```

## Critical Missing Files

**IMPORTANT**: The `utils/logging.ts` file is referenced but missing. If creating new page methods with `@step` decorator:

```typescript
// utils/logging.ts (needs to be created)
export function step(description?: string | ((this: any, ...args: any[]) => string)) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const stepDescription = typeof description === 'function' 
        ? description.apply(this, args) 
        : description || propertyKey;
      console.log(`[STEP] ${stepDescription}`);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
```

If `@step` decorator errors occur, the file must be created or decorators removed from `common-page.ts`.

## Integration Points

### Browser Configuration
- Default: Chromium, Firefox, WebKit (all configured)
- Runs in parallel: `fullyParallel: true`
- Test directory: `./tests`
- Reporter: HTML report (`npx playwright show-report`)

### Test Data Flow
1. Define interface in `interfaces/[name].ts`
2. Create data objects in `data/[source].ts` using the interface
3. Import in tests: `import { VALID_USER } from '../data/users'`
4. Pass to page methods: `await loginPage.loginWithValidAccount(VALID_USER)`

### External Dependencies
- **Target app**: https://www.demoblaze.com/ (hardcoded in `constants/urls.ts`)
- **Test user**: `autouser_20251005_1234` (defined in `data/users.ts`)
- **No API mocking**: Tests interact with live application
- **No backend setup required**: All test data exists on live site

## Common Pitfalls & Solutions

1. **Importing wrong test fixture**:
   - ❌ `import { test } from '@playwright/test'`
   - ✅ `import { test } from './base-test'`

2. **Forgetting to call super() in locator constructors**:
   ```typescript
   constructor(page: Page) {
     super(page);  // Must call first!
     this.initializeLocators();
   }
   ```

3. **Not waiting for modal state changes**:
   ```typescript
   await this.click(this.locators.loginButton);
   await this.waitForHidden(this.locators.loginModal);  // Wait for close!
   ```

4. **Hardcoding values instead of using data files**:
   - ❌ `fill(usernameInput, 'autouser_20251005_1234')`
   - ✅ `fill(usernameInput, VALID_USER.username)`

5. **Using low-level methods in page objects**:
   - ❌ `async clickLoginButton() { await this.click(...) }`
   - ✅ `async loginWithValidAccount(credentials) { /* full flow */ }`

## Quick Reference

### Must-use inherited methods from CommonPage:
- `click(locator)` - with visibility/enabled checks
- `fill(locator, value)` - with clear and validation
- `waitForVisible(locator)` - state: visible
- `waitForHidden(locator)` - state: hidden
- `getText(locator)` - with null handling
- `navigate(url, options)` - with load state
- `hover(locator)`, `check(locator)`, `uncheck(locator)`

### Accessing common navbar elements:
```typescript
// DemoBlaze navbar elements are now in feature-specific locators (not in CommonLocators)
// For LoginPage/LoginLocators:
this.locators.navbarHome
this.locators.navbarCart
this.locators.navbarLogin
this.locators.navbarLogout
this.locators.welcomeMessage

// For HomePage/HomeLocators:
this.locators.navbarHome
this.locators.navbarCart
this.locators.navbarLogin
this.locators.navbarLogout
this.locators.welcomeMessage

// CommonLocators now contains Japanese app specific locators:
this.commonLocators.planManagementTab
this.commonLocators.contractCompanyTab
this.commonLocators.settingsTab
```

### Test structure template:
```typescript
test.describe('[Feature]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC### - [desc]', async ({ page, authenticatedPage }) => {
    const { homePage, cartPage } = authenticatedPage;
    
    // 1. Setup/Navigate
    // 2. Perform actions
    // 3. Verify results (expect.soft)
  });
});
```
