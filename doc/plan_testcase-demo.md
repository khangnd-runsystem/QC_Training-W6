# Comprehensive Test Plan for Playwright Test Scripts

## Table of Contents
1. [Overview](#1-overview)
2. [Test Cases Analysis](#2-test-cases-analysis)
3. [Implementation Strategy](#3-implementation-strategy)
4. [Page Objects Definition](#4-page-objects-definition)
5. [Test Script Mapping](#5-test-script-mapping)
6. [Test Data Management](#6-test-data-management)
7. [Verification Approach](#7-verification-approach)
8. [Special Considerations](#8-special-considerations)
9. [Quality Assurance](#9-quality-assurance)

---

## 1. Overview

### Purpose
This test plan provides a comprehensive roadmap for implementing automated Playwright test scripts for the Demoblaze e-commerce application (https://www.demoblaze.com/). The plan translates five manual test cases into structured, maintainable, and scalable automated tests following industry best practices and project conventions.

### Features Being Tested
Based on the sample test cases, the following features will be covered:
- **User Authentication**: Login functionality with valid credentials
- **Shopping Cart Management**: Adding multiple products, removing items, cart calculations
- **Checkout Process**: Complete order placement with customer information
- **Navigation Flows**: End-to-end shopping experience from login to logout
- **Product Catalog**: Category browsing and product selection across Phones, Laptops, and Monitors

### Connection to Overall Test Architecture
This test plan aligns with the project's existing Playwright configuration:
- Tests will reside in the `/tests` directory as configured in `playwright.config.ts`
- Follows the page object model pattern for maintainability
- Utilizes TypeScript for type safety and better IDE support
- Implements soft assertions for comprehensive reporting
- Separates concerns: locators, page objects, test data, and test scripts

### Key Dependencies and Assumptions
**Dependencies:**
- Playwright Test framework (@playwright/test v1.56.1+)
- Node.js with TypeScript support
- Access to https://www.demoblaze.com/ (external dependency)
- Valid test user accounts pre-created on the platform

**Assumptions:**
- Project is already initialized with Playwright configuration
- Test environment is stable and accessible
- No API mocking required - tests will interact with real application
- Browser drivers are properly installed
- Test data (user accounts) exist and are valid
- Application behavior matches the documented test cases

---

## 2. Test Cases Analysis

### Total Number of Test Cases
**5 test cases** covering critical user journeys:

| Test ID | Feature Area | Test Type | Complexity |
|---------|-------------|-----------|------------|
| TC-1 | Login | Functional | Low |
| TC-2 | Cart | Functional | Medium |
| TC-3 | Checkout | End-to-End | Medium |
| TC-4 | Cart | Functional | Low |
| TC-5 | Navigation | End-to-End | High |

### Common Patterns Across Test Cases

1. **Login Flow**
   - Used as precondition in TC-2, TC-3, TC-4, TC-5
   - Pattern: Navigate → Click Login → Enter credentials → Submit → Verify

2. **Product Selection**
   - Used in TC-2, TC-5
   - Pattern: Select category → Click product → Add to cart → Handle alert → Navigate back

3. **Cart Verification**
   - Used in TC-2, TC-3, TC-4, TC-5
   - Pattern: Navigate to Cart → Verify items → Check prices → Validate total

4. **Checkout Flow**
   - Used in TC-3, TC-5
   - Pattern: Place Order → Fill form → Purchase → Confirm → Verify redirect

5. **Alert Handling**
   - Used in TC-2, TC-5
   - Pattern: Trigger action → Accept browser alert dialog

### Unique Challenges

1. **Test Case 1 (Login)**
   - **Challenge**: Modal dialog interaction with dynamic state changes
   - **Consideration**: Need to verify navbar updates (Welcome message, button visibility changes)

2. **Test Case 2 (Add Multiple Items)**
   - **Challenge**: Cross-category product selection with multiple navigation steps
   - **Consideration**: State management across page transitions, alert handling between actions

3. **Test Case 3 (Checkout)**
   - **Challenge**: Multi-step form submission with popup confirmation
   - **Consideration**: Extracting and validating dynamic order ID and amount, cart cleanup verification

4. **Test Case 4 (Remove Item)**
   - **Challenge**: Dynamic cart updates and recalculation
   - **Consideration**: Ensuring UI updates reflect backend state changes immediately

5. **Test Case 5 (Full Flow)**
   - **Challenge**: Longest test with most dependencies and state changes
   - **Consideration**: Test data cleanup, logout verification, maintaining state through entire flow

### Required Test Data and Preconditions

| Test Case | Preconditions | Required Data |
|-----------|--------------|---------------|
| TC-1 | Access to application | Valid username/password |
| TC-2 | User logged in | Product names: "Samsung galaxy s6", "MacBook Pro" |
| TC-3 | User logged in, cart has items | Customer info: Name, Country, City, Credit Card, Month, Year |
| TC-4 | User logged in, 2 items in cart | Product names: "Sony xperia z5", "MacBook Air" |
| TC-5 | Valid user account exists | Products: "Sony vaio i5", "Apple monitor 24"; Customer info |

### Identification of Page Objects Needed

Based on test case analysis, the following page objects are required:

1. **HomePage** - Landing page with product categories and navbar
2. **LoginModal** - Modal dialog for user authentication
3. **ProductDetailPage** - Individual product display with Add to Cart functionality
4. **CartPage** - Shopping cart management interface
5. **CheckoutModal** - Order placement form modal
6. **ConfirmationModal** - Purchase confirmation dialog
7. **CommonPage** (Base) - Shared utilities and common interactions

**Locator Files Required:**
- `common-locator.ts` (Base class)
- `home-locator.ts`
- `login-locator.ts`
- `product-detail-locator.ts`
- `cart-locator.ts`
- `checkout-locator.ts`
- `confirmation-locator.ts`

---

## 3. Implementation Strategy

### File Organization Within Test Directory

```
tests/
├── demoblaze/
│   ├── login.spec.ts              # TC-1: Login tests
│   ├── cart.spec.ts               # TC-2, TC-4: Cart operations
│   ├── checkout.spec.ts           # TC-3: Checkout process
│   └── full-flow.spec.ts          # TC-5: End-to-end flow
├── pages/
│   ├── common-page.ts             # Base page with shared utilities
│   ├── home-page.ts
│   ├── login-modal.ts
│   ├── product-detail-page.ts
│   ├── cart-page.ts
│   ├── checkout-modal.ts
│   └── confirmation-modal.ts
├── locators/
│   ├── common-locator.ts          # Base locator class
│   ├── home-locator.ts
│   ├── login-locator.ts
│   ├── product-detail-locator.ts
│   ├── cart-locator.ts
│   ├── checkout-locator.ts
│   └── confirmation-locator.ts
├── fixtures/
│   └── demoblaze-fixtures.ts      # Custom fixtures for authenticated state
├── utils/
│   ├── test-data-generator.ts     # Dynamic test data creation
│   ├── alert-handler.ts           # Browser alert management
│   └── wait-helpers.ts            # Custom wait utilities
└── types/
    ├── user.interface.ts          # User account data interface
    ├── product.interface.ts       # Product data interface
    └── checkout.interface.ts      # Checkout form data interface
```

### Naming Conventions

**Test Files:**
- Format: `<feature-area>.spec.ts`
- Examples: `login.spec.ts`, `cart.spec.ts`, `checkout.spec.ts`
- Use kebab-case for multi-word features

**Test Functions:**
- Format: Descriptive sentence starting with verb
- Examples: 
  - `test('should login successfully with valid credentials')`
  - `test('should add multiple items from different categories to cart')`
  - `test('should update cart total when removing an item')`

**Page Object Classes:**
- Format: PascalCase with "Page" or "Modal" suffix
- Examples: `HomePage`, `LoginModal`, `CartPage`

**Locator Classes:**
- Format: PascalCase with "Locator" suffix
- Examples: `HomeLocator`, `LoginLocator`, `CartLocator`

**Methods:**
- Format: camelCase, action-oriented
- Examples: `loginWithCredentials()`, `addProductToCart()`, `verifyCartTotal()`

### Page Object Organization

**Inheritance Structure:**
```
CommonPage (base class with shared utilities)
├── HomePage
├── ProductDetailPage
└── CartPage

LoginModal (extends CommonPage)
CheckoutModal (extends CommonPage)
ConfirmationModal (extends CommonPage)
```

**Key Principles:**
- Each page object corresponds to a distinct UI state or modal
- Page objects contain business logic methods, not low-level actions
- Locators are imported from separate locator classes
- Navigation methods return new page object instances
- Assertions are kept in test files, not page objects

### Locator Organization

**Base Locator Class Structure:**
```typescript
// common-locator.ts
export class CommonLocator {
  protected page: Page;
  
  // Common selectors
  public navbar = {
    home: '[PLACEHOLDER]',
    cart: '[PLACEHOLDER]',
    login: '[PLACEHOLDER]',
    logout: '[PLACEHOLDER]',
    welcomeMessage: '[PLACEHOLDER]'
  };
  
  protected initializeLocators(): void {
    // Base initialization logic
  }
}
```

**Page-Specific Locator Extension:**
```typescript
// home-locator.ts
export class HomeLocator extends CommonLocator {
  public categories = {
    phones: '[PLACEHOLDER]',
    laptops: '[PLACEHOLDER]',
    monitors: '[PLACEHOLDER]'
  };
  
  public products = {
    byName: (productName: string) => `[PLACEHOLDER]`
  };
  
  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }
}
```

### Common Utilities Needed

1. **AlertHandler** (`utils/alert-handler.ts`)
   - `acceptAlert()` - Accept browser alert dialogs
   - `dismissAlert()` - Dismiss browser alert dialogs
   - `getAlertText()` - Capture alert message text

2. **WaitHelpers** (`utils/wait-helpers.ts`)
   - `waitForModalToAppear()` - Wait for modal visibility
   - `waitForModalToDisappear()` - Wait for modal to close
   - `waitForPageLoad()` - Wait for navigation completion
   - `waitForElementStable()` - Wait for element animation to complete

3. **TestDataGenerator** (`utils/test-data-generator.ts`)
   - `generateUsername()` - Create unique usernames with timestamp
   - `generateCustomerInfo()` - Generate checkout form data
   - `generateCreditCard()` - Create test credit card numbers

4. **CommonPage Methods** (inherited by all page objects)
   - `clickElement(locator)` - Wrapper for click with waiting
   - `fillInput(locator, value)` - Fill text input with validation
   - `isElementVisible(locator)` - Check element visibility
   - `waitForNavigation()` - Handle navigation events
   - `getElementText(locator)` - Extract text content

### Test Data Management Approach

**Static Test Data:**
- Store in JSON files: `tests/data/users.json`, `tests/data/products.json`
- Version controlled for consistency
- Environment-specific overrides via `.env` files

**Dynamic Test Data:**
- Generated at runtime using `TestDataGenerator` utility
- Timestamp-based for uniqueness
- Avoid hardcoding in test files

**Data Isolation:**
- Each test should be independent
- Use fixtures for setup/teardown
- Clean up cart state after tests

### Interface Definitions for Test Data

```typescript
// types/user.interface.ts
export interface User {
  username: string;
  password: string;
}

// types/product.interface.ts
export interface Product {
  name: string;
  category: 'Phones' | 'Laptops' | 'Monitors';
  expectedPrice?: number;
}

// types/checkout.interface.ts
export interface CheckoutInfo {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

// types/cart-item.interface.ts
export interface CartItem {
  name: string;
  price: number;
}
```

### Handling Preconditions Efficiently

**Approach 1: Custom Fixtures**
```typescript
// fixtures/demoblaze-fixtures.ts
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Login logic
    await page.goto('https://www.demoblaze.com/');
    // ... login steps ...
    await use(page);
    // Cleanup: logout
  }
});
```

**Approach 2: Setup Functions**
- Create reusable setup functions in page objects
- Call from `test.beforeEach()` hooks
- Chain setup methods for complex preconditions

**Approach 3: Test Data Fixtures**
- Pre-seed test accounts
- Use authentication tokens/cookies (if available)
- Skip UI login when possible (future optimization)

---

## 4. Page Objects Definition

### 4.1 CommonPage (Base Class)

**Purpose:** Provide shared utilities and common interactions for all page objects

**Locator File:** `common-locator.ts`

**Methods:**
- `clickElement(locator: string)` - Click element with wait for actionability
- `fillInput(locator: string, value: string)` - Fill text input field
- `isElementVisible(locator: string): Promise<boolean>` - Check visibility
- `getElementText(locator: string): Promise<string>` - Extract text content
- `waitForModalToOpen()` - Wait for modal dialog to appear
- `waitForModalToClose()` - Wait for modal dialog to disappear
- `waitForNavigation()` - Wait for page navigation to complete
- `acceptAlert()` - Accept browser alert dialog

**Locators (common-locator.ts):**
```typescript
{
  navbar: {
    home: '[PLACEHOLDER]',
    cart: '[PLACEHOLDER]',
    login: '[PLACEHOLDER]',
    logout: '[PLACEHOLDER]',
    welcomeMessage: '[PLACEHOLDER]'
  },
  loadingIndicator: '[PLACEHOLDER]'
}
```

---

### 4.2 HomePage

**Purpose:** Handle interactions with the main landing page, product categories, and navigation

**Locator File:** `home-locator.ts` (extends `common-locator.ts`)

**Methods:**
- `navigateToHome()` - Navigate to homepage
- `selectCategory(categoryName: string)` - Click on product category (Phones, Laptops, Monitors)
- `selectProduct(productName: string): Promise<ProductDetailPage>` - Click on product, returns ProductDetailPage
- `clickLoginButton()` - Open login modal
- `clickCartButton(): Promise<CartPage>` - Navigate to cart page
- `clickLogoutButton()` - Logout from application
- `isUserLoggedIn(): Promise<boolean>` - Check if user is logged in
- `getWelcomeMessage(): Promise<string>` - Get welcome text from navbar
- `isLoginButtonVisible(): Promise<boolean>` - Check login button visibility
- `isLogoutButtonVisible(): Promise<boolean>` - Check logout button visibility

**Locators (home-locator.ts):**
```typescript
{
  // Inherits navbar from CommonLocator
  categories: {
    phones: '[PLACEHOLDER]',
    laptops: '[PLACEHOLDER]',
    monitors: '[PLACEHOLDER]'
  },
  productCard: {
    byName: (name: string) => `[PLACEHOLDER]`
  }
}
```

**Navigation Patterns:**
- After `selectProduct()` → `ProductDetailPage`
- After `clickCartButton()` → `CartPage`
- After `clickLoginButton()` → `LoginModal` appears
- After `clickLogoutButton()` → Stays on `HomePage` (state changes)

---

### 4.3 LoginModal

**Purpose:** Handle user authentication through the login modal dialog

**Locator File:** `login-locator.ts` (extends `common-locator.ts`)

**Methods:**
- `fillUsername(username: string)` - Enter username in input field
- `fillPassword(password: string)` - Enter password in input field
- `clickLoginButton()` - Submit login form
- `loginWithCredentials(user: User)` - Complete login flow (fill + submit)
- `isModalVisible(): Promise<boolean>` - Check if login modal is displayed
- `waitForModalToClose()` - Wait for modal to disappear after successful login

**Locators (login-locator.ts):**
```typescript
{
  modal: '[PLACEHOLDER]',
  usernameInput: '[PLACEHOLDER]',
  passwordInput: '[PLACEHOLDER]',
  loginButton: '[PLACEHOLDER]',
  closeButton: '[PLACEHOLDER]'
}
```

**Navigation Patterns:**
- After successful `loginWithCredentials()` → Modal closes, stays on `HomePage` with updated state
- After `clickLoginButton()` → Modal closes if credentials valid

---

### 4.4 ProductDetailPage

**Purpose:** Manage interactions on individual product detail pages

**Locator File:** `product-detail-locator.ts` (extends `common-locator.ts`)

**Methods:**
- `clickAddToCart()` - Add current product to cart
- `addToCartAndAcceptAlert()` - Add product to cart and handle alert
- `getProductName(): Promise<string>` - Get displayed product name
- `getProductPrice(): Promise<number>` - Get displayed product price
- `navigateToHome(): Promise<HomePage>` - Click Home link in navbar
- `navigateToCart(): Promise<CartPage>` - Click Cart link in navbar

**Locators (product-detail-locator.ts):**
```typescript
{
  productName: '[PLACEHOLDER]',
  productPrice: '[PLACEHOLDER]',
  addToCartButton: '[PLACEHOLDER]',
  productDescription: '[PLACEHOLDER]'
}
```

**Navigation Patterns:**
- After `addToCartAndAcceptAlert()` → Alert appears and is accepted, stays on `ProductDetailPage`
- After `navigateToHome()` → `HomePage`
- After `navigateToCart()` → `CartPage`

---

### 4.5 CartPage

**Purpose:** Manage shopping cart operations, item verification, and checkout initiation

**Locator File:** `cart-locator.ts` (extends `common-locator.ts`)

**Methods:**
- `getCartItems(): Promise<CartItem[]>` - Retrieve all items in cart with names and prices
- `getCartTotal(): Promise<number>` - Get total price displayed in cart
- `isProductInCart(productName: string): Promise<boolean>` - Check if specific product exists in cart
- `removeProductFromCart(productName: string)` - Click delete button for specific product
- `clickPlaceOrderButton()` - Open checkout modal
- `getProductPrice(productName: string): Promise<number>` - Get price of specific product
- `getProductCount(): Promise<number>` - Count number of items in cart
- `isCartEmpty(): Promise<boolean>` - Check if cart has no items

**Locators (cart-locator.ts):**
```typescript
{
  cartItems: '[PLACEHOLDER]',
  productRow: {
    byName: (name: string) => `[PLACEHOLDER]`
  },
  productName: '[PLACEHOLDER]',
  productPrice: '[PLACEHOLDER]',
  deleteButton: '[PLACEHOLDER]',
  totalAmount: '[PLACEHOLDER]',
  placeOrderButton: '[PLACEHOLDER]'
}
```

**Navigation Patterns:**
- After `clickPlaceOrderButton()` → `CheckoutModal` appears
- After `removeProductFromCart()` → Stays on `CartPage`, cart updates dynamically

---

### 4.6 CheckoutModal

**Purpose:** Handle order placement form submission

**Locator File:** `checkout-locator.ts` (extends `common-locator.ts`)

**Methods:**
- `fillName(name: string)` - Enter customer name
- `fillCountry(country: string)` - Enter country
- `fillCity(city: string)` - Enter city
- `fillCreditCard(cardNumber: string)` - Enter credit card number
- `fillMonth(month: string)` - Enter expiration month
- `fillYear(year: string)` - Enter expiration year
- `fillCheckoutForm(checkoutInfo: CheckoutInfo)` - Fill all fields at once
- `clickPurchaseButton()` - Submit order
- `clickCloseButton()` - Close modal without purchasing
- `isModalVisible(): Promise<boolean>` - Check if checkout modal is displayed

**Locators (checkout-locator.ts):**
```typescript
{
  modal: '[PLACEHOLDER]',
  nameInput: '[PLACEHOLDER]',
  countryInput: '[PLACEHOLDER]',
  cityInput: '[PLACEHOLDER]',
  creditCardInput: '[PLACEHOLDER]',
  monthInput: '[PLACEHOLDER]',
  yearInput: '[PLACEHOLDER]',
  purchaseButton: '[PLACEHOLDER]',
  closeButton: '[PLACEHOLDER]'
}
```

**Navigation Patterns:**
- After `clickPurchaseButton()` → Checkout modal closes, `ConfirmationModal` appears
- After `clickCloseButton()` → Modal closes, stays on `CartPage`

---

### 4.7 ConfirmationModal

**Purpose:** Handle purchase confirmation dialog and order details extraction

**Locator File:** `confirmation-locator.ts` (extends `common-locator.ts`)

**Methods:**
- `isModalVisible(): Promise<boolean>` - Check if confirmation modal is displayed
- `getConfirmationMessage(): Promise<string>` - Get "Thank you for your purchase!" text
- `getOrderId(): Promise<string>` - Extract order ID from confirmation
- `getOrderAmount(): Promise<number>` - Extract order amount from confirmation
- `clickOkButton(): Promise<HomePage>` - Close modal and return to homepage
- `getFullConfirmationText(): Promise<string>` - Get entire confirmation message

**Locators (confirmation-locator.ts):**
```typescript
{
  modal: '[PLACEHOLDER]',
  confirmationMessage: '[PLACEHOLDER]',
  orderDetails: '[PLACEHOLDER]',
  okButton: '[PLACEHOLDER]'
}
```

**Navigation Patterns:**
- After `clickOkButton()` → Modal closes, redirects to `HomePage`
- Cart is cleared after successful purchase

---

## 5. Test Script Mapping

### Detailed Test Case to Implementation Mapping

| Test Case ID | Test File | Test Function Name | Page Objects Required | Fixtures Needed | Special Handling |
|--------------|-----------|-------------------|----------------------|-----------------|------------------|
| TC-1 | `login.spec.ts` | `should login successfully with valid credentials` | HomePage, LoginModal | None | Modal wait, navbar state verification |
| TC-2 | `cart.spec.ts` | `should add multiple items from different categories to cart` | HomePage, ProductDetailPage, CartPage | authenticatedUser | Alert handling (2x), cross-category navigation |
| TC-3 | `checkout.spec.ts` | `should place order with valid customer information` | CartPage, CheckoutModal, ConfirmationModal, HomePage | authenticatedUser, cartWithItems | Dynamic order ID/amount extraction, cart cleanup verification |
| TC-4 | `cart.spec.ts` | `should remove item and update cart total correctly` | HomePage, ProductDetailPage, CartPage | authenticatedUser, cartWith2Items | Dynamic total recalculation, item removal verification |
| TC-5 | `full-flow.spec.ts` | `should complete full shopping flow from login to logout` | All page objects | None (login in test) | Longest test, multiple alerts, full state management, logout verification |

### Test File Structure Details

#### File: `tests/demoblaze/login.spec.ts`
```typescript
// Test Case: TC-1
test.describe('User Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Steps:
    // 1. Navigate to homepage
    // 2. Click Login button
    // 3. Fill username
    // 4. Fill password
    // 5. Click login button
    // Verifications:
    // - Modal closes
    // - Welcome message displays with username
    // - Logout button is visible
    // - Login button is hidden
  });
});
```

#### File: `tests/demoblaze/cart.spec.ts`
```typescript
// Test Cases: TC-2, TC-4
test.describe('Shopping Cart Management', () => {
  test('should add multiple items from different categories to cart', async ({ page }) => {
    // Precondition: User logged in
    // Steps involve multiple category selections and alert handling
  });

  test('should remove item and update cart total correctly', async ({ page }) => {
    // Precondition: User logged in, 2 items in cart
    // Verify dynamic total recalculation
  });
});
```

#### File: `tests/demoblaze/checkout.spec.ts`
```typescript
// Test Case: TC-3
test.describe('Checkout Process', () => {
  test('should place order with valid customer information', async ({ page }) => {
    // Precondition: User logged in, items in cart
    // Steps include form filling and confirmation handling
  });
});
```

#### File: `tests/demoblaze/full-flow.spec.ts`
```typescript
// Test Case: TC-5
test.describe('End-to-End Shopping Flow', () => {
  test('should complete full shopping flow from login to logout', async ({ page }) => {
    // No preconditions - handles login within test
    // Complete flow: login → browse → add items → checkout → logout
  });
});
```

### Fixture Requirements

**1. authenticatedUser Fixture**
```typescript
// Purpose: Provide a logged-in user session
// Used in: TC-2, TC-3, TC-4
// Implementation: tests/fixtures/demoblaze-fixtures.ts
```

**2. cartWithItems Fixture**
```typescript
// Purpose: Provide a cart with at least one item
// Used in: TC-3
// Extends: authenticatedUser
```

**3. cartWith2Items Fixture**
```typescript
// Purpose: Provide a cart with exactly 2 specific items
// Used in: TC-4
// Extends: authenticatedUser
// Items: "Sony xperia z5", "MacBook Air"
```

### Special Handling Requirements by Test Case

**TC-1 (Login):**
- Wait for modal to appear before interacting
- Wait for modal to close after submission
- Verify multiple navbar state changes simultaneously

**TC-2 (Add Multiple Items):**
- Handle alerts after each "Add to cart" action (2 total)
- Navigate back to Home between category selections
- Cross-category navigation requires page reloads

**TC-3 (Checkout):**
- Extract dynamic values (Order ID, Amount) from confirmation
- Verify cart is empty after returning to homepage
- Handle modal chaining (checkout → confirmation)

**TC-4 (Remove Item):**
- Verify cart state before and after removal
- Validate total recalculation matches expected price
- Ensure only one item is removed, not both

**TC-5 (Full Flow):**
- No fixtures - complete login within test
- Multiple alert handlings throughout test
- Verify logout returns to initial state (login button visible)
- Longest test requiring careful state management

---

## 6. Test Data Management

### Test Data Generation Strategy

#### Static Test Data
**Location:** `tests/data/` directory

**users.json**
```json
{
  "validUser": {
    "username": "autouser_20251005_1234",
    "password": "autouser_20251005_1234"
  }
}
```

**products.json**
```json
{
  "phones": [
    { "name": "Samsung galaxy s6", "expectedPrice": 360 },
    { "name": "Sony xperia z5", "expectedPrice": 320 }
  ],
  "laptops": [
    { "name": "MacBook Pro", "expectedPrice": 1100 },
    { "name": "Sony vaio i5", "expectedPrice": 790 },
    { "name": "MacBook Air", "expectedPrice": 700 }
  ],
  "monitors": [
    { "name": "Apple monitor 24", "expectedPrice": 400 }
  ]
}
```

**checkout-info.json**
```json
{
  "customer1": {
    "name": "John Doe",
    "country": "USA",
    "city": "New York",
    "creditCard": "4111111111111111",
    "month": "12",
    "year": "2025"
  },
  "customer2": {
    "name": "Anna",
    "country": "VN",
    "city": "HCM",
    "creditCard": "12345678",
    "month": "01",
    "year": "2026"
  }
}
```

#### Dynamic Test Data Generation

**Implementation:** `tests/utils/test-data-generator.ts`

**Methods:**
- `generateUsername(): string` - Creates username with timestamp pattern `autouser_YYYYMMDD_HHMM`
- `generateCustomerInfo(): CheckoutInfo` - Creates random customer data
- `generateCreditCardNumber(): string` - Creates valid test credit card number
- `getRandomProduct(category: string): Product` - Selects random product from category

**Usage Example:**
```typescript
const username = TestDataGenerator.generateUsername();
// Returns: "autouser_20251021_1430"

const customer = TestDataGenerator.generateCustomerInfo();
// Returns: { name: "Test User 1430", country: "USA", ... }
```

### Managing Test State Between Runs

**Approach 1: Independent Test Execution**
- Each test should be self-contained
- Use `test.beforeEach()` to set up required state
- Use `test.afterEach()` to clean up

**Approach 2: Fixtures for Preconditions**
- Custom fixtures handle authentication
- Fixtures handle cart setup when needed
- Automatic cleanup through fixture teardown

**Approach 3: Test Isolation**
- Avoid dependencies between tests
- Each test starts from known state
- No shared global state

**State Management Pattern:**
```typescript
test.beforeEach(async ({ page }) => {
  // Setup: Navigate to homepage
  await page.goto('https://www.demoblaze.com/');
});

test.afterEach(async ({ page }) => {
  // Cleanup: Clear any remaining state
  // Logout if logged in
  // Clear cart if needed
});
```

### Handling Environmental Dependencies

**Configuration Management:**
- Use environment variables for base URL
- Create `.env` file for local development
- Use `.env.ci` for CI/CD pipelines

**.env Structure:**
```
BASE_URL=https://www.demoblaze.com/
TEST_USER_USERNAME=autouser_20251005_1234
TEST_USER_PASSWORD=autouser_20251005_1234
TIMEOUT_DEFAULT=30000
RETRY_COUNT=2
```

**Accessing in Tests:**
```typescript
const baseURL = process.env.BASE_URL || 'https://www.demoblaze.com/';
const testUser = {
  username: process.env.TEST_USER_USERNAME,
  password: process.env.TEST_USER_PASSWORD
};
```

**Playwright Config Integration:**
```typescript
// playwright.config.ts
use: {
  baseURL: process.env.BASE_URL,
  // ... other config
}
```

### Cleanup Procedures

**Test-Level Cleanup:**
1. **After Login Tests:** Logout if logged in
2. **After Cart Tests:** Clear cart or verify cart is empty
3. **After Checkout Tests:** Verify order completion, cart cleared

**Fixture-Level Cleanup:**
```typescript
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup: login
    await use(page);
    // Teardown: logout
  }
});
```

**Session Cleanup:**
- Clear browser cookies after tests (if needed)
- Clear local storage (if needed)
- Reset to initial application state

**Cleanup Best Practices:**
- Always use try-finally blocks in cleanup code
- Log cleanup failures for debugging
- Don't let cleanup failures fail tests
- Verify cleanup was successful

---

## 7. Verification Approach

### 1. Navigation Events Verification

**Strategy:** Use `expect.soft` to verify URL changes and key element presence after navigation

**Implementation Examples:**

```typescript
// After login navigation
await expect.soft(page).toHaveURL('https://www.demoblaze.com/index.html');

// After clicking Cart
await expect.soft(page).toHaveURL(/cart.html/);

// Verify page loaded by checking key element
await expect.soft(page.locator('[PLACEHOLDER_CART_TITLE]')).toBeVisible();

// After checkout completion, verify redirect to home
await expect.soft(page).toHaveURL('https://www.demoblaze.com/index.html');
```

**What to Verify:**
- URL matches expected pattern
- Key page elements are visible (title, main container)
- Previous page elements are no longer visible

---

### 2. UI State Verification

**Strategy:** Use `expect.soft` to verify visibility, enabled/disabled state, and element presence

**Implementation Examples:**

```typescript
// Verify button visibility
await expect.soft(page.locator('[PLACEHOLDER_LOGOUT_BUTTON]')).toBeVisible();
await expect.soft(page.locator('[PLACEHOLDER_LOGIN_BUTTON]')).toBeHidden();

// Verify element state
await expect.soft(page.locator('[PLACEHOLDER_PURCHASE_BUTTON]')).toBeEnabled();

// Verify element count
const cartItems = page.locator('[PLACEHOLDER_CART_ITEM]');
await expect.soft(cartItems).toHaveCount(2);

// Verify element text content
await expect.soft(page.locator('[PLACEHOLDER_WELCOME_MESSAGE]'))
  .toContainText('Welcome autouser_20251005_1234');
```

**UI States to Verify:**
- Element visibility (visible/hidden)
- Element state (enabled/disabled/checked)
- Element count (number of items)
- Element text content
- Element attributes (classes, aria labels)

---

### 3. Error Message Validation

**Strategy:** Use `expect.soft` to validate expected error texts

**Implementation Examples:**

```typescript
// Verify error message appears
await expect.soft(page.locator('[PLACEHOLDER_ERROR_MESSAGE]')).toBeVisible();

// Verify specific error text
await expect.soft(page.locator('[PLACEHOLDER_ERROR_MESSAGE]'))
  .toHaveText('Invalid username or password');

// Verify error message contains expected text
await expect.soft(page.locator('[PLACEHOLDER_ERROR_MESSAGE]'))
  .toContainText('required');
```

**Note:** While the current test cases don't include error scenarios, this approach should be used when implementing negative test cases.

---

### 4. Email Verification (If Applicable)

**Strategy:** Use `expect.soft` to verify email content if email testing is implemented

**Implementation Examples:**

```typescript
// Note: Current test cases don't require email verification
// This section is for future implementation if needed

// Verify email received
const emails = await emailService.getEmails();
await expect.soft(emails).toHaveLength(1);

// Verify email subject
await expect.soft(emails[0].subject).toBe('Order Confirmation');

// Verify email body contains order details
await expect.soft(emails[0].body).toContain(orderId);

// Verify recipient
await expect.soft(emails[0].to).toBe('customer@example.com');
```

**Note:** Email verification is not required for current test cases but may be needed for future enhancements (e.g., order confirmation emails).

---

### 5. Popup/Modal Verification

**Strategy:** Use `expect.soft` to verify modal appearance, content, and behavior

**Implementation Examples:**

```typescript
// Verify modal appears
await expect.soft(page.locator('[PLACEHOLDER_LOGIN_MODAL]')).toBeVisible();

// Verify modal content
await expect.soft(page.locator('[PLACEHOLDER_MODAL_TITLE]')).toHaveText('Log in');

// Verify modal buttons
await expect.soft(page.locator('[PLACEHOLDER_MODAL_CLOSE_BUTTON]')).toBeVisible();
await expect.soft(page.locator('[PLACEHOLDER_MODAL_SUBMIT_BUTTON]')).toBeEnabled();

// Verify modal closes
await expect.soft(page.locator('[PLACEHOLDER_LOGIN_MODAL]')).toBeHidden();

// Verify confirmation modal content
await expect.soft(page.locator('[PLACEHOLDER_CONFIRMATION_MESSAGE]'))
  .toContainText('Thank you for your purchase!');
```

**Modal States to Verify:**
- Modal visibility (open/closed)
- Modal title and header
- Button presence and state
- Content accuracy
- Backdrop/overlay presence

---

### 6. Cart and Checkout Verifications

**Strategy:** Use `expect.soft` for all cart calculations and item verifications

**Implementation Examples:**

```typescript
// Verify product in cart
await expect.soft(page.locator('[PLACEHOLDER_PRODUCT_NAME]'))
  .toHaveText('Samsung galaxy s6');

// Verify product price
await expect.soft(page.locator('[PLACEHOLDER_PRODUCT_PRICE]'))
  .toHaveText('360');

// Verify cart total calculation
const total = await cartPage.getCartTotal();
await expect.soft(total).toBe(1460); // Sum of all items

// Verify cart item count
const itemCount = await cartPage.getProductCount();
await expect.soft(itemCount).toBe(2);

// Verify cart is empty after purchase
await expect.soft(page.locator('[PLACEHOLDER_CART_ITEMS]')).toHaveCount(0);
```

---

### 7. Alert Dialog Handling

**Strategy:** Handle browser alerts (not Playwright assertions, but verification of handling)

**Implementation Examples:**

```typescript
// Setup alert handler
page.on('dialog', async dialog => {
  // Verify alert type
  expect(dialog.type()).toBe('alert');
  // Accept alert
  await dialog.accept();
});

// Trigger action that causes alert
await productDetailPage.clickAddToCart();

// Verify alert was handled (implicit - no error thrown)
```

---

### 8. Soft Assertions Usage

**Why Use `expect.soft`:**
- Continues test execution even if assertion fails
- Collects all verification failures in one test run
- Provides comprehensive test report
- Identifies multiple issues in single test run

**When to Use `expect.soft`:**
- ✅ All UI state verifications
- ✅ All navigation verifications
- ✅ All text content verifications
- ✅ All element visibility checks
- ✅ All cart calculations

**When to Use Regular `expect`:**
- ❌ Critical preconditions (e.g., page load)
- ❌ Actions that depend on previous steps (rare cases)
- ❌ Fixture setup/teardown (not in tests)

**Example: Multiple Verifications with Soft Assertions**

```typescript
test('should verify cart state after adding items', async ({ page }) => {
  // Soft assertions - all will be evaluated
  await expect.soft(page).toHaveURL(/cart.html/);
  await expect.soft(cartPage.locators.productName.nth(0)).toHaveText('Samsung galaxy s6');
  await expect.soft(cartPage.locators.productPrice.nth(0)).toHaveText('360');
  await expect.soft(cartPage.locators.productName.nth(1)).toHaveText('MacBook Pro');
  await expect.soft(cartPage.locators.productPrice.nth(1)).toHaveText('1100');
  await expect.soft(cartPage.locators.totalAmount).toHaveText('1460');
  
  // If any assertion fails, test is marked as failed
  // But all verifications are executed and reported
});
```

---

### 9. Verification Pattern for Each Test Case

**TC-1 (Login):**
```typescript
// Modal closes
await expect.soft(loginModal.locators.modal).toBeHidden();
// Navbar shows welcome message
await expect.soft(homePage.locators.navbar.welcomeMessage)
  .toContainText('Welcome autouser_20251005_1234');
// Logout button visible
await expect.soft(homePage.locators.navbar.logout).toBeVisible();
// Login button hidden
await expect.soft(homePage.locators.navbar.login).toBeHidden();
```

**TC-2 (Add Multiple Items):**
```typescript
// Cart page displays
await expect.soft(page).toHaveURL(/cart.html/);
// Two products present
await expect.soft(cartPage.locators.cartItems).toHaveCount(2);
// Correct product names
await expect.soft(cartPage.locators.productName.nth(0)).toHaveText('Samsung galaxy s6');
await expect.soft(cartPage.locators.productName.nth(1)).toHaveText('MacBook Pro');
// Correct prices
await expect.soft(cartPage.locators.productPrice.nth(0)).toContainText('360');
await expect.soft(cartPage.locators.productPrice.nth(1)).toContainText('1100');
// Correct total
await expect.soft(cartPage.locators.totalAmount).toContainText('1460');
```

**TC-3 (Checkout):**
```typescript
// Confirmation popup displayed
await expect.soft(confirmationModal.locators.modal).toBeVisible();
// Success message
await expect.soft(confirmationModal.locators.confirmationMessage)
  .toContainText('Thank you for your purchase!');
// Order ID present (dynamic value)
const orderText = await confirmationModal.getFullConfirmationText();
await expect.soft(orderText).toMatch(/Id: \d+/);
// Amount present
await expect.soft(orderText).toMatch(/Amount: \d+/);
// After clicking OK, redirects to home
await expect.soft(page).toHaveURL(/index.html/);
// Cart is cleared
await expect.soft(cartPage.locators.cartItems).toHaveCount(0);
```

**TC-4 (Remove Item):**
```typescript
// Item removed from cart
await expect.soft(page.locator('[PLACEHOLDER_PRODUCT_ROW]:has-text("Sony xperia z5")')).toBeHidden();
// Only one item remains
await expect.soft(cartPage.locators.cartItems).toHaveCount(1);
// Remaining item is correct
await expect.soft(cartPage.locators.productName.first()).toHaveText('MacBook Air');
// Total updated correctly
const expectedTotal = 700; // MacBook Air price
await expect.soft(cartPage.locators.totalAmount).toContainText(String(expectedTotal));
```

**TC-5 (Full Flow):**
```typescript
// Multiple verifications throughout:
// - Login success (same as TC-1)
// - Products added (same as TC-2 pattern)
// - Checkout success (same as TC-3)
// - Logout verification:
await expect.soft(homePage.locators.navbar.login).toBeVisible();
await expect.soft(homePage.locators.navbar.logout).toBeHidden();
await expect.soft(homePage.locators.navbar.welcomeMessage).toBeHidden();
```

---

## 8. Special Considerations

### 1. Internationalization Aspects

**Challenge:** The application may contain mixed language content (English and potentially other languages)

**Considerations:**
- **Current Test Cases:** All content appears to be in English
- **Text Matching:** Use exact text matching for English content
- **Unicode Support:** Ensure test framework handles UTF-8 encoding
- **Locator Strategy:** Prefer test IDs or aria labels over text-based locators to avoid i18n issues

**Implementation Approach:**
```typescript
// Avoid text-based locators when possible
// ❌ Bad: page.locator('text=Log in')
// ✅ Good: page.locator('[data-testid="login-button"]')

// For assertions, use exact text or contains
await expect.soft(element).toHaveText('Welcome autouser_20251005_1234');
await expect.soft(element).toContainText('Thank you for your purchase!');
```

**Future Considerations:**
- If Japanese or other language content is added, create language-specific test data files
- Use i18n key-based assertions instead of hardcoded text
- Parameterize tests to run against multiple locales

---

### 2. Timing/Synchronization Considerations

**Critical Timing Points:**

**Modal Appearances/Disappearances:**
- Login modal open/close
- Checkout modal open/close
- Confirmation modal open/close

**Strategy:**
```typescript
// Wait for modal to appear before interacting
await expect(loginModal.locators.modal).toBeVisible();
await loginModal.fillUsername(username);

// Wait for modal to close after action
await expect(loginModal.locators.modal).toBeHidden();
```

**Alert Dialogs:**
- Alerts appear after "Add to cart" action
- Must be handled immediately

**Strategy:**
```typescript
// Setup handler before triggering action
page.on('dialog', async dialog => await dialog.accept());
await productDetailPage.clickAddToCart();
// Continue after alert is handled
```

**Page Navigation:**
- Category selection triggers page reload
- Cart navigation
- Home navigation

**Strategy:**
```typescript
// Use Playwright's built-in waiting
await page.waitForLoadState('domcontentloaded');
// Or wait for specific element
await expect(homePage.locators.categories.laptops).toBeVisible();
```

**Dynamic Content Updates:**
- Cart total recalculation after item removal
- Navbar state change after login/logout

**Strategy:**
```typescript
// Wait for specific state change
await expect(cartPage.locators.totalAmount).toHaveText(expectedTotal);
```

**Recommended Timeout Configuration:**
```typescript
// playwright.config.ts
use: {
  actionTimeout: 10000, // 10 seconds for actions
  navigationTimeout: 30000, // 30 seconds for navigation
}

// Per-test override if needed
await expect(element).toBeVisible({ timeout: 15000 });
```

---

### 3. Environment-Specific Configurations

**Base URL Management:**
```typescript
// playwright.config.ts
use: {
  baseURL: process.env.BASE_URL || 'https://www.demoblaze.com/',
}

// In tests
await page.goto('/'); // Uses baseURL from config
```

**Test User Management:**
- **Current Approach:** Hardcoded test user credentials
- **Recommendation:** Use environment variables for different environments

```typescript
// .env.local
TEST_USER_USERNAME=autouser_20251005_1234
TEST_USER_PASSWORD=autouser_20251005_1234

// .env.staging
TEST_USER_USERNAME=staging_user_001
TEST_USER_PASSWORD=staging_pass_001
```

**Browser Configuration:**
```typescript
// Different configurations for different environments
projects: [
  {
    name: 'chromium-local',
    use: { 
      ...devices['Desktop Chrome'],
      headless: false, // For local debugging
    },
  },
  {
    name: 'chromium-ci',
    use: { 
      ...devices['Desktop Chrome'],
      headless: true, // For CI/CD
    },
  },
]
```

**Test Data Environment Variables:**
```typescript
// Access environment-specific data
const checkoutInfo = {
  name: process.env.TEST_CUSTOMER_NAME || 'John Doe',
  country: process.env.TEST_CUSTOMER_COUNTRY || 'USA',
  // ... other fields
};
```

---

### 4. Error Handling Approach

**Page Object Error Handling:**
```typescript
// In page object methods
async clickElement(locator: string): Promise<void> {
  try {
    await this.page.locator(locator).click({ timeout: 10000 });
  } catch (error) {
    throw new Error(`Failed to click element ${locator}: ${error.message}`);
  }
}
```

**Test-Level Error Handling:**
```typescript
test('should handle unexpected popups', async ({ page }) => {
  try {
    // Test steps
  } catch (error) {
    // Capture screenshot on failure
    await page.screenshot({ path: 'error-screenshot.png' });
    throw error;
  }
});
```

**Alert Handling Errors:**
```typescript
// Setup error handling for unexpected dialogs
page.on('dialog', async dialog => {
  console.log(`Unexpected dialog: ${dialog.type()} - ${dialog.message()}`);
  await dialog.accept();
});
```

**Network Error Handling:**
```typescript
// Handle network failures gracefully
page.on('response', response => {
  if (!response.ok()) {
    console.warn(`Request failed: ${response.url()} - ${response.status()}`);
  }
});
```

**Retry Strategy:**
```typescript
// playwright.config.ts
retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
```

**Soft Assertion Error Handling:**
- Soft assertions collect all failures
- Test is marked as failed if any soft assertion fails
- All verifications are executed regardless of individual failures

---

### 5. State Management Between Test Steps

**Maintaining User Session:**
- Login state persists through page navigation
- Use fixtures to maintain authenticated state
- Avoid re-login unless testing logout functionality

**Cart State Persistence:**
- Cart contents persist across page navigation
- Verify cart state before and after operations
- Clear cart in cleanup if needed

**Test Data State:**
- Each test should start with known state
- Use `test.beforeEach` to reset state
- Avoid test interdependencies

---

### 6. Performance Considerations

**Optimize Test Execution:**
- Use parallel execution where possible
- Group related tests in describe blocks
- Reuse authenticated sessions via fixtures

**Minimize Wait Times:**
- Use specific element waits instead of arbitrary delays
- Leverage Playwright's auto-waiting
- Set appropriate timeout values

**Resource Management:**
- Close unnecessary browser contexts
- Clean up after each test
- Avoid memory leaks in page object instances

---

## 9. Quality Assurance

### Peer Review Process

**Review Checklist for Implemented Tests:**

#### 1. Code Quality
- [ ] Test file follows naming convention: `<feature>.spec.ts`
- [ ] Test descriptions are clear and descriptive
- [ ] No hardcoded values - use test data files or constants
- [ ] No commented-out code or unused imports
- [ ] Proper TypeScript typing for all variables and functions
- [ ] Code is DRY (Don't Repeat Yourself) - common logic in utilities

#### 2. Page Object Model Adherence
- [ ] Page objects used for all UI interactions
- [ ] No direct `page.locator()` calls in test files
- [ ] Locators defined in separate locator files, not in page objects
- [ ] All locator files extend from `CommonLocator`
- [ ] Page object methods return appropriate types (e.g., `Promise<CartPage>`)
- [ ] Business logic encapsulated in page object methods
- [ ] Common utilities reused from `CommonPage`

#### 3. Test Structure
- [ ] Clear test setup in `beforeEach` hooks
- [ ] Proper cleanup in `afterEach` hooks
- [ ] Tests are independent and can run in any order
- [ ] Fixtures used appropriately for preconditions
- [ ] Test follows AAA pattern: Arrange, Act, Assert

#### 4. Assertions
- [ ] All verifications use `expect.soft` (unless critical precondition)
- [ ] Assertions verify actual expected results from test case
- [ ] Each `</br>` line in test case has corresponding assertion
- [ ] Assertion messages are clear and helpful
- [ ] No redundant assertions

#### 5. Error Handling
- [ ] Alert handlers set up before triggering actions
- [ ] Modal waits implemented before interactions
- [ ] Navigation waits properly handled
- [ ] Timeouts configured appropriately
- [ ] Error messages are descriptive

#### 6. Test Data Management
- [ ] Test data loaded from appropriate sources (JSON, generator)
- [ ] No sensitive data hardcoded in tests
- [ ] Dynamic data generated where appropriate
- [ ] Test data interfaces used correctly

---

### Validation Criteria for Completed Scripts

**Test Implementation Completion Criteria:**

#### Functional Completeness
- [ ] All steps from test case are implemented
- [ ] All expected results have corresponding assertions
- [ ] Each `</br>` separated step is treated as individual action/verification
- [ ] Test preconditions properly set up
- [ ] Test cleanup properly implemented

#### Technical Completeness
- [ ] Test runs successfully in isolation
- [ ] Test runs successfully in test suite
- [ ] Test passes consistently (no flaky behavior)
- [ ] Test execution time is reasonable (< 60 seconds per test)
- [ ] Test works across all configured browsers

#### Code Quality Metrics
- [ ] No linting errors
- [ ] No TypeScript compilation errors
- [ ] Code coverage meets standards (if applicable)
- [ ] No console errors or warnings during execution
- [ ] Screenshots/traces captured on failure

#### Documentation
- [ ] Test description clearly states what is being tested
- [ ] Complex logic has inline comments
- [ ] Test data sources are documented
- [ ] Page object methods have JSDoc comments

---

### Documentation Requirements

**1. Test File Documentation:**
```typescript
/**
 * Test Suite: User Authentication
 * 
 * Description: Validates login functionality with valid credentials
 * 
 * Test Cases Covered:
 * - TC-1: Valid Login
 * 
 * Dependencies:
 * - Valid test user account must exist
 * 
 * Author: [Developer Name]
 * Last Updated: [Date]
 */
test.describe('User Authentication', () => {
  // Test implementations
});
```

**2. Page Object Documentation:**
```typescript
/**
 * LoginModal Page Object
 * 
 * Handles interactions with the login modal dialog
 * 
 * Locator File: login-locator.ts
 * 
 * Key Methods:
 * - loginWithCredentials(user): Complete login flow
 * - fillUsername(username): Enter username
 * - fillPassword(password): Enter password
 */
export class LoginModal extends CommonPage {
  // Implementation
}
```

**3. Locator File Documentation:**
```typescript
/**
 * Login Modal Locators
 * 
 * Extends: CommonLocator
 * 
 * Selectors for login modal dialog elements
 * 
 * Note: Update these selectors if UI structure changes
 */
export class LoginLocator extends CommonLocator {
  // Locator definitions
}
```

**4. Test Data Documentation:**
```typescript
/**
 * Test Users Data
 * 
 * Contains credentials for test user accounts
 * 
 * Environment: Development/Staging
 * 
 * Note: Update if test accounts are refreshed
 */
export const testUsers = {
  // User data
};
```

**5. README Documentation:**

Create `tests/demoblaze/README.md`:
```markdown
# Demoblaze E-commerce Test Suite

## Overview
Automated test suite for Demoblaze e-commerce application using Playwright.

## Test Coverage
- User Authentication (Login/Logout)
- Shopping Cart Management
- Checkout Process
- End-to-End Shopping Flow

## Setup
1. Install dependencies: `npm install`
2. Set up environment variables (see `.env.example`)
3. Ensure test user accounts exist

## Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/demoblaze/login.spec.ts

# Run with UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

## Test Data
- User credentials: `tests/data/users.json`
- Product data: `tests/data/products.json`
- Checkout info: `tests/data/checkout-info.json`

## Page Objects
Located in `tests/pages/`:
- CommonPage: Base class with shared utilities
- HomePage: Main landing page
- LoginModal: Authentication modal
- CartPage: Shopping cart
- ProductDetailPage: Product details
- CheckoutModal: Order placement
- ConfirmationModal: Purchase confirmation

## Maintenance
- Update locators in `tests/locators/` if UI changes
- Update test data files if product names change
- Review and update timeouts if needed
```

---

### Maintenance Considerations

**1. Locator Maintenance Strategy**

**When UI Changes:**
- Update only the affected locator file
- Page objects automatically use updated locators
- Run affected tests to verify changes

**Locator Versioning:**
- Document locator changes in commit messages
- Tag releases when major UI changes occur
- Maintain locator changelog

**Locator Review Schedule:**
- Monthly review of flaky tests
- Investigate if locator changes needed
- Update to more stable selectors if available

**2. Test Data Maintenance**

**Product Data Updates:**
- Review product data monthly
- Verify product names still exist on site
- Update prices if needed (or make assertions dynamic)

**User Account Management:**
- Rotate test user credentials periodically
- Document active test accounts
- Monitor for account expiration/lockout

**Checkout Data:**
- Update credit card expiration dates annually
- Verify country/city names still valid
- Update form field data if required fields change

**3. Code Maintenance**

**Regular Refactoring:**
- Consolidate duplicate code into utilities
- Extract common patterns into fixtures
- Update TypeScript types as needed

**Dependency Updates:**
- Update Playwright regularly for bug fixes
- Review release notes for breaking changes
- Test suite verification after updates

**Performance Optimization:**
- Review test execution times
- Optimize slow tests
- Parallelize where possible

**4. Documentation Maintenance**

**Keep Updated:**
- README with current setup instructions
- Inline comments for complex logic
- Test case mapping table
- Locator documentation

**Review Triggers:**
- After major UI changes
- After adding new tests
- After significant refactoring
- Quarterly documentation review

**5. Monitoring and Alerts**

**Test Failure Analysis:**
- Review failed test trends
- Identify flaky tests
- Root cause analysis for failures

**Metrics to Track:**
- Test pass rate
- Average execution time
- Flaky test frequency
- Code coverage (if applicable)

**Continuous Improvement:**
- Regularly review test plan effectiveness
- Gather feedback from team
- Update conventions based on lessons learned
- Iterate on page object design

---

## Summary

This comprehensive test plan provides a complete roadmap for implementing Playwright test scripts for the Demoblaze e-commerce application. The plan covers:

✅ **5 test cases** spanning login, cart management, checkout, and end-to-end flows  
✅ **7 page objects** with clear responsibilities and locator separation  
✅ **Structured project organization** with pages, locators, fixtures, and utilities  
✅ **Test data management** strategy with static and dynamic data generation  
✅ **Comprehensive verification approach** using soft assertions throughout  
✅ **Special considerations** for timing, state management, and error handling  
✅ **Quality assurance processes** for peer review and maintenance  

The implementation should follow this plan to ensure consistency, maintainability, and alignment with project conventions.

---

**Document Version:** 1.0  
**Created:** October 21, 2025  
**Status:** Ready for Implementation
