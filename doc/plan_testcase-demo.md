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
This test plan provides a comprehensive blueprint for implementing Playwright test scripts based on existing test cases for the DemoBlaze e-commerce website (https://www.demoblaze.com/). The plan ensures consistent implementation adhering to project structure, conventions, and best practices.

### Features Being Tested
The test suite covers critical e-commerce functionalities:
- **Authentication**: User login with valid credentials
- **Shopping Cart Management**: Adding multiple items from different categories, removing items
- **Checkout Process**: Placing orders with valid payment information
- **End-to-End Navigation**: Complete shopping flow from login through checkout to logout

### Architecture Connection
This plan integrates with the existing project structure:
- **Pages**: Reusable page object classes for UI interactions
- **Locators**: Centralized selector definitions extending from common base
- **Utilities**: Shared helper functions for common operations
- **Interfaces**: Type definitions for test data structures
- **Data**: Test data management and fixtures
- **Constants**: Configuration values and reusable strings

### Key Dependencies and Assumptions
- **Project is already initialized** with Playwright, TypeScript, and necessary dependencies
- **Target application**: https://www.demoblaze.com/ is accessible
- **Test user account exists**: Username/Password = "autouser_20251005_1234"
- **Browser context**: Tests assume clean state (can use fixtures for logged-in state)
- **No API mocking required**: Tests interact with live application
- **Line breaks (`</br>`)** in test steps represent separate actions/verifications

---

## 2. Test Cases Analysis

### Summary Statistics
- **Total Test Cases**: 5
- **Test Categories**:
  - Login: 1 test case
  - Cart Management: 2 test cases (Add Multiple, Remove Item)
  - Checkout: 1 test case
  - End-to-End Flow: 1 test case

### Common Patterns Across Test Cases

#### Pattern 1: User Authentication
- **Occurrences**: TC1, TC5
- **Flow**: Navigate → Open Login Modal → Enter Credentials → Submit → Verify Welcome Message
- **Reusable Component**: `login()` method in LoginPage

#### Pattern 2: Product Selection and Cart Addition
- **Occurrences**: TC2, TC4, TC5
- **Flow**: Select Category → Click Product → Add to Cart → Accept Alert → Navigate
- **Reusable Component**: `addProductToCart(category, productName)` method

#### Pattern 3: Cart Verification
- **Occurrences**: TC2, TC3, TC4, TC5
- **Flow**: Navigate to Cart → Verify Products Present → Verify Prices → Verify Total
- **Reusable Component**: `verifyCartContents(expectedProducts[])` method

#### Pattern 4: Checkout Process
- **Occurrences**: TC3, TC5
- **Flow**: Place Order → Fill Form → Purchase → Verify Confirmation → Close Modal
- **Reusable Component**: `completeCheckout(customerInfo)` method

### Unique Challenges

| Challenge | Test Case | Description | Solution Approach |
|-----------|-----------|-------------|-------------------|
| Alert Handling | TC2, TC3, TC5 | Browser alerts after adding to cart | Implement alert listener in page object |
| Dynamic Total Calculation | TC2, TC4 | Total must match sum of product prices | Create verification utility for numerical assertions |
| Cart State Management | TC3, TC4 | Cart must persist/clear appropriately | Use fixtures for pre-cart state, verify cleanup |
| Multi-step Navigation | TC5 | Complex flow across multiple pages | Implement chaining pattern in page objects |
| Modal State Detection | TC1, TC3 | Verify modal opens/closes correctly | Add waitForModal utility methods |

### Required Test Data

```typescript
// Login Credentials
{
  username: "autouser_20251005_1234",
  password: "autouser_20251005_1234"
}

// Product Information
Products = [
  { name: "Samsung galaxy s6", category: "Phones", price: 360 },
  { name: "MacBook Pro", category: "Laptops", price: 1100 },
  { name: "Sony xperia z5", category: "Phones", price: 320 },
  { name: "MacBook Air", category: "Laptops", price: 700 },
  { name: "Sony vaio i5", category: "Laptops", price: 790 },
  { name: "Apple monitor 24", category: "Monitors", price: 400 }
]

// Checkout Information
CustomerInfo = [
  { name: "John Doe", country: "USA", city: "New York", card: "4111111111111111", month: "12", year: "2025" },
  { name: "Anna", country: "VN", city: "HCM", card: "12345678", month: "01", year: "2026" }
]
```

### Required Page Objects
1. **HomePage** - Navigation, category selection, product browsing
2. **LoginPage** - Authentication modal interactions
3. **ProductDetailPage** - Product viewing, add to cart actions
4. **CartPage** - Cart management, item removal, checkout initiation
5. **CheckoutPage** - Order form completion, purchase confirmation

---

## 3. Implementation Strategy

### File Organization

```
d:\QC_training\W6\
├── tests/
│   ├── login.spec.ts              # TC1: Login tests
│   ├── cart.spec.ts               # TC2, TC4: Cart management tests
│   ├── checkout.spec.ts           # TC3: Checkout tests
│   └── navigation.spec.ts         # TC5: End-to-end flow tests
├── pages/
│   ├── common-page.ts             # Base page with common utilities
│   ├── home-page.ts               # HomePage class
│   ├── login-page.ts              # LoginPage class
│   ├── product-detail-page.ts    # ProductDetailPage class
│   ├── cart-page.ts               # CartPage class
│   └── checkout-page.ts           # CheckoutPage class
├── locators/
│   ├── common-locators.ts         # Base locator class
│   ├── home-locators.ts           # Home page selectors
│   ├── login-locators.ts          # Login modal selectors
│   ├── product-detail-locators.ts # Product page selectors
│   ├── cart-locators.ts           # Cart page selectors
│   └── checkout-locators.ts       # Checkout modal selectors
├── interfaces/
│   ├── login-credentials.ts       # Login data interface
│   ├── product-info.ts            # Product data interface
│   ├── checkout-info.ts           # Checkout form data interface
│   └── order-confirmation.ts      # Order result interface
├── data/
│   ├── users.ts                   # User credentials
│   ├── products.ts                # Product catalog
│   └── checkout-data.ts           # Checkout form data
├── utils/
│   ├── alert-handler.ts           # Alert/dialog utilities
│   ├── wait-helpers.ts            # Synchronization utilities
│   └── assertion-helpers.ts       # Soft assertion wrappers
└── constants/
    ├── urls.ts                    # Application URLs
    └── messages.ts                # Expected text messages
```

### Naming Conventions

#### Test Files
- **Format**: `[feature].spec.ts`
- **Examples**: `login.spec.ts`, `cart.spec.ts`, `checkout.spec.ts`
- **Location**: `tests/` directory

#### Test Functions
- **Format**: `test('should [action/expected behavior]', async ({ page }) => { })`
- **Examples**:
  ```typescript
  test('should login successfully with valid credentials', ...)
  test('should add multiple products from different categories to cart', ...)
  test('should complete checkout with valid customer information', ...)
  ```

#### Page Object Classes
- **Format**: `[Feature]Page` (PascalCase)
- **Examples**: `HomePage`, `LoginPage`, `CartPage`
- **Location**: `pages/` directory

#### Page Object Methods
- **Format**: `[verb][Object][Details]` (camelCase)
- **Business-level methods** (high-level flows):
  ```typescript
  loginWithValidAccount(username, password)
  addProductToCart(category, productName)
  completeCheckout(customerInfo)
  verifyWelcomeMessage(username)
  ```
- **Avoid low-level methods** like `clickLoginButton()`, `fillUsername()` - use common utilities instead

#### Locator Files
- **Format**: `[feature]-locators.ts` (kebab-case)
- **Examples**: `login-locators.ts`, `cart-locators.ts`
- **Location**: `locators/` directory

#### Locator Classes
- **Format**: `[Feature]Locators extends CommonLocators`
- **Examples**: `LoginLocators`, `HomeLocators`

### Page Object Organization

**Base Class: CommonPage**
```typescript
// pages/common-page.ts
export class CommonPage {
  constructor(protected page: Page, protected locators: CommonLocators) {}
  
  // Generic reusable methods
  async clickElement(selector: string): Promise<void>
  async fillInput(selector: string, value: string): Promise<void>
  async waitForElement(selector: string): Promise<void>
  async getText(selector: string): Promise<string>
  async isVisible(selector: string): Promise<boolean>
  async acceptAlert(): Promise<void>
  async navigateTo(url: string): Promise<void>
}
```

**Feature Pages extend CommonPage**
```typescript
// pages/login-page.ts
export class LoginPage extends CommonPage {
  constructor(page: Page) {
    super(page, new LoginLocators(page));
  }
  
  // Business-level methods only
  async loginWithValidAccount(credentials: LoginCredentials): Promise<void>
  async openLoginModal(): Promise<void>
  async verifyLoginSuccess(username: string): Promise<void>
}
```

### Locator Organization

**Base Class: CommonLocators**
```typescript
// locators/common-locators.ts
export class CommonLocators {
  constructor(protected page: Page) {
    this.initializeLocators();
  }
  
  protected initializeLocators(): void {
    // Common selectors used across multiple pages
  }
  
  // Common locators
  navbarHome: string = 'PLACEHOLDER_NAVBAR_HOME';
  navbarCart: string = 'PLACEHOLDER_NAVBAR_CART';
  navbarLogin: string = 'PLACEHOLDER_NAVBAR_LOGIN';
  navbarLogout: string = 'PLACEHOLDER_NAVBAR_LOGOUT';
  welcomeMessage: string = 'PLACEHOLDER_WELCOME_MESSAGE';
}
```

**Feature Locators extend CommonLocators**
```typescript
// locators/login-locators.ts
export class LoginLocators extends CommonLocators {
  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }
  
  protected initializeLocators(): void {
    super.initializeLocators();
    // Initialize login-specific locators
  }
  
  // Login-specific locators
  loginModal: string = 'PLACEHOLDER_LOGIN_MODAL';
  usernameInput: string = 'PLACEHOLDER_USERNAME_INPUT';
  passwordInput: string = 'PLACEHOLDER_PASSWORD_INPUT';
  loginButton: string = 'PLACEHOLDER_LOGIN_BUTTON';
  closeModalButton: string = 'PLACEHOLDER_CLOSE_MODAL';
}
```

### Common Utilities Needed

#### Alert Handler (`utils/alert-handler.ts`)
```typescript
export class AlertHandler {
  static async acceptAlert(page: Page): Promise<void>
  static async dismissAlert(page: Page): Promise<void>
  static async getAlertText(page: Page): Promise<string>
  static async setupAlertListener(page: Page): Promise<void>
}
```

#### Wait Helpers (`utils/wait-helpers.ts`)
```typescript
export class WaitHelpers {
  static async waitForNavigation(page: Page, url?: string): Promise<void>
  static async waitForModalToOpen(page: Page, modalSelector: string): Promise<void>
  static async waitForModalToClose(page: Page, modalSelector: string): Promise<void>
  static async waitForElementToDisappear(page: Page, selector: string): Promise<void>
}
```

#### Assertion Helpers (`utils/assertion-helpers.ts`)
```typescript
export class AssertionHelpers {
  static async softAssertVisible(page: Page, selector: string, message?: string): Promise<void>
  static async softAssertText(page: Page, selector: string, expectedText: string): Promise<void>
  static async softAssertHidden(page: Page, selector: string, message?: string): Promise<void>
  static async softAssertURL(page: Page, expectedURL: string): Promise<void>
  static async softAssertSum(actual: number, expected: number, message?: string): Promise<void>
}
```

### Interface Definitions

```typescript
// interfaces/login-credentials.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

// interfaces/product-info.ts
export interface ProductInfo {
  name: string;
  category: 'Phones' | 'Laptops' | 'Monitors';
  price: number;
}

// interfaces/checkout-info.ts
export interface CheckoutInfo {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

// interfaces/order-confirmation.ts
export interface OrderConfirmation {
  orderId: string;
  amount: number;
  message: string;
}
```

### Preconditions Handling

**Fixtures for Common Preconditions**
```typescript
// tests/fixtures/authenticated-user.ts
export const authenticatedUser = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(BASE_URL);
    await loginPage.loginWithValidAccount({ username: USER_1.username, password: USER_1.password });
    await use(page);
  }
});
```

**Fixtures for Cart State**
```typescript
// tests/fixtures/cart-with-items.ts
export const cartWithItems = authenticatedUser.extend({
  cartWithProducts: async ({ authenticatedPage }, use) => {
    const homePage = new HomePage(authenticatedPage);
    await homePage.addProductToCart('Phones', 'Sony xperia z5');
    await homePage.addProductToCart('Laptops', 'MacBook Air');
    await use(authenticatedPage);
  }
});
```

---

## 4. Page Objects Definition

### 4.1 LoginPage

**Purpose**: Handle user authentication through login modal

**Locator File**: `login-locators.ts`

**Class Definition**:
```typescript
export class LoginPage extends CommonPage {
  constructor(page: Page) {
    super(page, new LoginLocators(page));
  }
}
```

**Essential Methods**:

| Method | Parameters | Purpose | Returns/Navigation |
|--------|-----------|---------|-------------------|
| `openLoginModal()` | - | Opens the login modal dialog | Modal visible |
| `loginWithValidAccount()` | `credentials: LoginCredentials` | Complete login flow: open modal → fill form → submit | HomePage (on success) |
| `verifyLoginSuccess()` | `username: string` | Verify welcome message and UI state after login | Current page |
| `verifyLogoutButtonVisible()` | - | Verify logout button is displayed | Current page |
| `verifyLoginButtonHidden()` | - | Verify login button is hidden after login | Current page |

**Locators Required** (from `LoginLocators`):
```typescript
loginModal: string = 'PLACEHOLDER_LOGIN_MODAL';
usernameInput: string = 'PLACEHOLDER_USERNAME_INPUT';
passwordInput: string = 'PLACEHOLDER_PASSWORD_INPUT';
loginButton: string = 'PLACEHOLDER_LOGIN_BUTTON';
closeModalButton: string = 'PLACEHOLDER_CLOSE_MODAL';
welcomeMessage: string = 'PLACEHOLDER_WELCOME_MESSAGE'; // extends from CommonLocators
navbarLogout: string = 'PLACEHOLDER_NAVBAR_LOGOUT'; // extends from CommonLocators
navbarLogin: string = 'PLACEHOLDER_NAVBAR_LOGIN'; // extends from CommonLocators
```

**Navigation Patterns**:
- **After `loginWithValidAccount()`**: User remains on HomePage, modal closes
- **Expected URL**: Same as before login (typically `/` or `/index.html`)
- **Assertions**: Welcome message visible, Logout button visible, Login button hidden

---

### 4.2 HomePage

**Purpose**: Handle navigation, category selection, product browsing, and navbar interactions

**Locator File**: `home-locators.ts`

**Class Definition**:
```typescript
export class HomePage extends CommonPage {
  constructor(page: Page) {
    super(page, new HomeLocators(page));
  }
}
```

**Essential Methods**:

| Method | Parameters | Purpose | Returns/Navigation |
|--------|-----------|---------|-------------------|
| `selectCategory()` | `categoryName: string` | Click on a product category (Phones/Laptops/Monitors) | Filtered product list |
| `selectProduct()` | `productName: string` | Click on a specific product card | ProductDetailPage |
| `navigateToCart()` | - | Click Cart link in navbar | CartPage |
| `navigateToHome()` | - | Click Home link in navbar | HomePage (refresh) |
| `clickLogout()` | - | Click Logout button in navbar | HomePage (logged out state) |
| `verifyWelcomeMessage()` | `username: string` | Verify welcome message displays correct username | Current page |

**Locators Required** (from `HomeLocators`):
```typescript
// Categories
categoryPhones: string = 'PLACEHOLDER_CATEGORY_PHONES';
categoryLaptops: string = 'PLACEHOLDER_CATEGORY_LAPTOPS';
categoryMonitors: string = 'PLACEHOLDER_CATEGORY_MONITORS';

// Products (dynamic selector with product name)
productCard: (productName: string) => string = (name) => `PLACEHOLDER_PRODUCT_CARD_${name}`;

// Navbar (extends from CommonLocators)
navbarHome: string = 'PLACEHOLDER_NAVBAR_HOME';
navbarCart: string = 'PLACEHOLDER_NAVBAR_CART';
navbarLogout: string = 'PLACEHOLDER_NAVBAR_LOGOUT';
welcomeMessage: string = 'PLACEHOLDER_WELCOME_MESSAGE';
```

**Navigation Patterns**:
- **After `selectCategory()`**: User remains on HomePage, product list updates
- **After `selectProduct()`**: Navigate to ProductDetailPage (URL: `/prod.html?idp_={productId}`)
- **After `navigateToCart()`**: Navigate to CartPage (URL: `/cart.html`)
- **After `clickLogout()`**: User remains on HomePage, navbar updates to logged-out state

---

### 4.3 ProductDetailPage

**Purpose**: Display product details and handle adding products to cart

**Locator File**: `product-detail-locators.ts`

**Class Definition**:
```typescript
export class ProductDetailPage extends CommonPage {
  constructor(page: Page) {
    super(page, new ProductDetailLocators(page));
  }
}
```

**Essential Methods**:

| Method | Parameters | Purpose | Returns/Navigation |
|--------|-----------|---------|-------------------|
| `addToCart()` | - | Click "Add to cart" button and accept alert | Current page |
| `verifyProductName()` | `expectedName: string` | Verify product name is displayed correctly | Current page |
| `verifyProductPrice()` | `expectedPrice: number` | Verify product price is displayed correctly | Current page |
| `navigateBack()` | - | Navigate back to previous page (typically HomePage) | Previous page |

**Locators Required** (from `ProductDetailLocators`):
```typescript
productName: string = 'PLACEHOLDER_PRODUCT_NAME';
productPrice: string = 'PLACEHOLDER_PRODUCT_PRICE';
productDescription: string = 'PLACEHOLDER_PRODUCT_DESCRIPTION';
addToCartButton: string = 'PLACEHOLDER_ADD_TO_CART_BUTTON';
```

**Navigation Patterns**:
- **After `addToCart()`**: User remains on ProductDetailPage, alert appears with "Product added"
- **Alert handling**: Must accept alert after adding to cart
- **Expected URL**: No change (`/prod.html?idp_={productId}`)

---

### 4.4 CartPage

**Purpose**: Display cart contents, handle item removal, calculate totals, and initiate checkout

**Locator File**: `cart-locators.ts`

**Class Definition**:
```typescript
export class CartPage extends CommonPage {
  constructor(page: Page) {
    super(page, new CartLocators(page));
  }
}
```

**Essential Methods**:

| Method | Parameters | Purpose | Returns/Navigation |
|--------|-----------|---------|-------------------|
| `getCartItems()` | - | Retrieve list of all products in cart | Array of product names |
| `verifyProductInCart()` | `productName: string` | Verify specific product is present in cart | Current page |
| `verifyProductPrice()` | `productName: string, expectedPrice: number` | Verify product price is correct | Current page |
| `removeProduct()` | `productName: string` | Click Delete button for specific product | Current page (cart updates) |
| `getTotalPrice()` | - | Get the total price displayed | Number |
| `verifyTotalPrice()` | `expectedTotal: number` | Verify total matches sum of products | Current page |
| `clickPlaceOrder()` | - | Click "Place Order" button to open checkout modal | CheckoutPage modal opens |
| `verifyCartEmpty()` | - | Verify cart contains no items | Current page |

**Locators Required** (from `CartLocators`):
```typescript
cartTable: string = 'PLACEHOLDER_CART_TABLE';
cartRow: string = 'PLACEHOLDER_CART_ROW';
productNameInCart: (productName: string) => string = (name) => `PLACEHOLDER_PRODUCT_IN_CART_${name}`;
productPriceInCart: (productName: string) => string = (name) => `PLACEHOLDER_PRICE_IN_CART_${name}`;
deleteButton: (productName: string) => string = (name) => `PLACEHOLDER_DELETE_BUTTON_${name}`;
totalPrice: string = 'PLACEHOLDER_TOTAL_PRICE';
placeOrderButton: string = 'PLACEHOLDER_PLACE_ORDER_BUTTON';
```

**Navigation Patterns**:
- **After `removeProduct()`**: User remains on CartPage, item removed from table, total updates
- **After `clickPlaceOrder()`**: User remains on CartPage, checkout modal appears
- **Expected URL**: `/cart.html`

---

### 4.5 CheckoutPage

**Purpose**: Handle order form completion, purchase confirmation, and order verification

**Locator File**: `checkout-locators.ts`

**Class Definition**:
```typescript
export class CheckoutPage extends CommonPage {
  constructor(page: Page) {
    super(page, new CheckoutLocators(page));
  }
}
```

**Essential Methods**:

| Method | Parameters | Purpose | Returns/Navigation |
|--------|-----------|---------|-------------------|
| `fillCheckoutForm()` | `info: CheckoutInfo` | Fill all checkout form fields | Current page |
| `clickPurchase()` | - | Click Purchase button to submit order | Confirmation modal appears |
| `verifyConfirmationMessage()` | `expectedMessage: string` | Verify success message in confirmation popup | Current page |
| `getOrderId()` | - | Extract order ID from confirmation | String |
| `getOrderAmount()` | - | Extract order amount from confirmation | Number |
| `closeConfirmation()` | - | Click OK button to close confirmation modal | HomePage |
| `completeCheckout()` | `info: CheckoutInfo` | Complete full checkout flow: fill form → purchase → verify | HomePage (after confirmation) |

**Locators Required** (from `CheckoutLocators`):
```typescript
// Checkout form
checkoutModal: string = 'PLACEHOLDER_CHECKOUT_MODAL';
nameInput: string = 'PLACEHOLDER_NAME_INPUT';
countryInput: string = 'PLACEHOLDER_COUNTRY_INPUT';
cityInput: string = 'PLACEHOLDER_CITY_INPUT';
creditCardInput: string = 'PLACEHOLDER_CARD_INPUT';
monthInput: string = 'PLACEHOLDER_MONTH_INPUT';
yearInput: string = 'PLACEHOLDER_YEAR_INPUT';
purchaseButton: string = 'PLACEHOLDER_PURCHASE_BUTTON';
closeCheckoutButton: string = 'PLACEHOLDER_CLOSE_CHECKOUT';

// Confirmation modal
confirmationModal: string = 'PLACEHOLDER_CONFIRMATION_MODAL';
confirmationMessage: string = 'PLACEHOLDER_CONFIRMATION_MESSAGE';
orderIdText: string = 'PLACEHOLDER_ORDER_ID';
amountText: string = 'PLACEHOLDER_AMOUNT';
confirmOkButton: string = 'PLACEHOLDER_CONFIRM_OK';
```

**Navigation Patterns**:
- **After `fillCheckoutForm()`**: User remains on CartPage, form is filled
- **After `clickPurchase()`**: User remains on CartPage, confirmation modal appears
- **After `closeConfirmation()`**: User redirected to HomePage, cart is cleared
- **Expected URL after completion**: `/` or `/index.html`

---

### Locator Inheritance Structure

```
CommonLocators (base class)
├── initializeLocators()
├── navbarHome
├── navbarCart
├── navbarLogin
├── navbarLogout
└── welcomeMessage

↓ extends

HomeLocators
├── inherits all CommonLocators
├── categoryPhones
├── categoryLaptops
├── categoryMonitors
└── productCard(name)

LoginLocators
├── inherits all CommonLocators
├── loginModal
├── usernameInput
├── passwordInput
└── loginButton

ProductDetailLocators
├── inherits all CommonLocators
├── productName
├── productPrice
└── addToCartButton

CartLocators
├── inherits all CommonLocators
├── cartTable
├── productNameInCart(name)
├── deleteButton(name)
├── totalPrice
└── placeOrderButton

CheckoutLocators
├── inherits all CommonLocators
├── checkoutModal
├── nameInput, countryInput, cityInput
├── creditCardInput, monthInput, yearInput
├── purchaseButton
├── confirmationModal
└── confirmOkButton
```

---

## 5. Test Script Mapping

### Mapping Table

| Test Case ID | Item Main | Item Sub | Test File | Test Function Name | Page Objects Required | Fixtures Needed | Special Handling |
|--------------|-----------|----------|-----------|-------------------|----------------------|-----------------|------------------|
| TC1 | Login | Valid Login | `login.spec.ts` | `should login successfully with valid credentials` | LoginPage, HomePage | None | None |
| TC2 | Cart | Add Multiple Items | `cart.spec.ts` | `should add multiple products from different categories to cart` | HomePage, ProductDetailPage, CartPage | `authenticatedUser` | Alert handling after each add to cart |
| TC3 | Checkout | Place Order with Valid Info | `checkout.spec.ts` | `should complete checkout with valid customer information` | CartPage, CheckoutPage, HomePage | `authenticatedUser`, `cartWithItems` | Modal handling, order confirmation verification |
| TC4 | Cart | Remove Item | `cart.spec.ts` | `should remove single item and update cart total` | HomePage, ProductDetailPage, CartPage | `authenticatedUser` | Dynamic total calculation verification |
| TC5 | Navigation | Full Shopping Flow | `navigation.spec.ts` | `should complete full shopping flow from login to logout` | LoginPage, HomePage, ProductDetailPage, CartPage, CheckoutPage | None | Multi-page navigation, complete flow testing |

---

### Detailed Test Function Signatures

#### TC1: Login Test
```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { VALID_USER } from '../data/users';

test.describe('Login Functionality', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Test implementation here
    // Page objects: LoginPage, HomePage
    // Verifications: Modal closes, welcome message, logout visible, login hidden
  });
});
```

#### TC2 & TC4: Cart Tests
```typescript
// tests/cart.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ProductDetailPage } from '../pages/product-detail-page';
import { CartPage } from '../pages/cart-page';
import { authenticatedUser } from './fixtures/authenticated-user';

test.describe('Shopping Cart Management', () => {
  test('should add multiple products from different categories to cart', async ({ page }) => {
    // Uses authenticatedUser fixture
    // Page objects: HomePage, ProductDetailPage, CartPage
    // Special: Alert handling
  });

  test('should remove single item and update cart total', async ({ page }) => {
    // Uses authenticatedUser fixture
    // Page objects: HomePage, ProductDetailPage, CartPage
    // Special: Pre-add 2 products before removal
  });
});
```

#### TC3: Checkout Test
```typescript
// tests/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { HomePage } from '../pages/home-page';
import { cartWithItems } from './fixtures/cart-with-items';
import { CHECKOUT_DATA } from '../data/checkout-data';

test.describe('Checkout Process', () => {
  test('should complete checkout with valid customer information', async ({ page }) => {
    // Uses cartWithItems fixture (includes authenticatedUser)
    // Page objects: CartPage, CheckoutPage, HomePage
    // Verifications: Confirmation modal, order ID, amount, redirect, cart cleared
  });
});
```

#### TC5: Navigation Test
```typescript
// tests/navigation.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';
import { ProductDetailPage } from '../pages/product-detail-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { VALID_USER } from '../data/users';
import { CHECKOUT_DATA } from '../data/checkout-data';

test.describe('End-to-End Shopping Flow', () => {
  test('should complete full shopping flow from login to logout', async ({ page }) => {
    // No fixtures - tests complete flow from scratch
    // Page objects: All 5 page objects
    // Verifications: Each step of the flow
  });
});
```

---

## 6. Test Data Management

### Data Organization Strategy

#### 6.1 Interface Definitions

**Location**: `interfaces/` directory

```typescript
// interfaces/login-credentials.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

// interfaces/product-info.ts
export interface ProductInfo {
  name: string;
  category: 'Phones' | 'Laptops' | 'Monitors';
  price: number;
  description?: string;
}

// interfaces/checkout-info.ts
export interface CheckoutInfo {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

// interfaces/order-confirmation.ts
export interface OrderConfirmation {
  orderId: string;
  amount: number;
  message: string;
  success: boolean;
}
```

#### 6.2 Test Data Files

**Location**: `data/` directory

```typescript
// data/users.ts
import { LoginCredentials } from '../interfaces/login-credentials';

export const VALID_USER: LoginCredentials = {
  username: 'autouser_20251005_1234',
  password: 'autouser_20251005_1234'
};

export const USERS = {
  VALID_USER,
  // Add more users as needed
};
```

```typescript
// data/products.ts
import { ProductInfo } from '../interfaces/product-info';

export const PRODUCTS: { [key: string]: ProductInfo } = {
  SAMSUNG_GALAXY_S6: {
    name: 'Samsung galaxy s6',
    category: 'Phones',
    price: 360
  },
  MACBOOK_PRO: {
    name: 'MacBook Pro',
    category: 'Laptops',
    price: 1100
  },
  SONY_XPERIA_Z5: {
    name: 'Sony xperia z5',
    category: 'Phones',
    price: 320
  },
  MACBOOK_AIR: {
    name: 'MacBook Air',
    category: 'Laptops',
    price: 700
  },
  SONY_VAIO_I5: {
    name: 'Sony vaio i5',
    category: 'Laptops',
    price: 790
  },
  APPLE_MONITOR_24: {
    name: 'Apple monitor 24',
    category: 'Monitors',
    price: 400
  }
};
```

```typescript
// data/checkout-data.ts
import { CheckoutInfo } from '../interfaces/checkout-info';

export const CHECKOUT_DATA: { [key: string]: CheckoutInfo } = {
  JOHN_DOE: {
    name: 'John Doe',
    country: 'USA',
    city: 'New York',
    creditCard: '4111111111111111',
    month: '12',
    year: '2025'
  },
  ANNA_VN: {
    name: 'Anna',
    country: 'VN',
    city: 'HCM',
    creditCard: '12345678',
    month: '01',
    year: '2026'
  }
};
```

#### 6.3 Constants

**Location**: `constants/` directory

```typescript
// constants/urls.ts
export const BASE_URL = 'https://www.demoblaze.com/';
export const URLS = {
  HOME: BASE_URL,
  CART: `${BASE_URL}cart.html`,
  PRODUCT_DETAIL: `${BASE_URL}prod.html`
};
```

```typescript
// constants/messages.ts
export const MESSAGES = {
  PRODUCT_ADDED: 'Product added',
  CHECKOUT_SUCCESS: 'Thank you for your purchase!',
  LOGIN_SUCCESS: 'Welcome',
  LOGOUT_SUCCESS: 'Log out'
};
```

### Test Data Generation

For dynamic data that needs to be generated per test run:

```typescript
// utils/data-generator.ts
export class DataGenerator {
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `testuser_${timestamp}@example.com`;
  }

  static generateOrderId(): string {
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateTimestamp(): string {
    return new Date().toISOString();
  }
}
```

### Test State Management

#### Between Test Runs
- **Isolated Browser Context**: Each test gets fresh browser context by default
- **Storage State**: Can save/load authentication state to avoid repeated logins
- **Fixtures**: Use Playwright fixtures for setup/teardown

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Start with clean state
    storageState: undefined,
    // Optional: save storage state after auth
    // storageState: 'auth.json'
  }
});
```

#### Handling Environment Dependencies
```typescript
// constants/environment.ts
export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://www.demoblaze.com/',
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000'),
  HEADLESS: process.env.HEADLESS !== 'false'
};
```

### Cleanup Procedures

#### After Each Test
```typescript
test.afterEach(async ({ page }) => {
  // Clear cart if logged in
  // Optional: Take screenshot on failure
  // Optional: Clear browser storage
});
```

#### After Test Suite
```typescript
test.afterAll(async () => {
  // Cleanup any test data
  // Close database connections if applicable
});
```

---

## 7. Verification Approach

### Overview
**All verifications must use `expect.soft()` to ensure complete test execution even when assertions fail.** This approach provides comprehensive reporting and allows detection of multiple issues in a single test run.

### 7.1 Navigation Events Verification

**Purpose**: Verify correct page navigation and URL changes

**Implementation Pattern**:
```typescript
// Verify URL after navigation
await expect.soft(page).toHaveURL(URLS.CART);

// Verify key element presence indicating correct page
await expect.soft(page.locator(cartPage.locators.cartTable)).toBeVisible();
```

**Examples from Test Cases**:
- **TC1**: After login, verify user stays on Home page
- **TC3**: After checkout confirmation, verify redirect to Home page
- **TC5**: Verify navigation through multiple pages

### 7.2 UI State Verification

**Purpose**: Verify element visibility, enabled/disabled state, and presence

**Implementation Pattern**:
```typescript
// Verify element is visible
await expect.soft(page.locator(selector)).toBeVisible();

// Verify element is hidden
await expect.soft(page.locator(selector)).toBeHidden();

// Verify element is enabled/disabled
await expect.soft(page.locator(selector)).toBeEnabled();
await expect.soft(page.locator(selector)).toBeDisabled();

// Verify element count
await expect.soft(page.locator(selector)).toHaveCount(expectedCount);
```

**Examples from Test Cases**:
- **TC1**: 
  - Verify modal closes (modal hidden)
  - Verify logout button visible
  - Verify login button hidden
- **TC2**: 
  - Verify 2 products displayed in cart
  - Verify product names visible
- **TC4**: 
  - Verify deleted item not visible
  - Verify remaining item still visible

### 7.3 Text Content Verification

**Purpose**: Verify displayed text matches expected values

**Implementation Pattern**:
```typescript
// Exact text match
await expect.soft(page.locator(selector)).toHaveText(expectedText);

// Contains text
await expect.soft(page.locator(selector)).toContainText(expectedText);

// Regex match
await expect.soft(page.locator(selector)).toHaveText(/pattern/);
```

**Examples from Test Cases**:
- **TC1**: Verify welcome message shows "Welcome autouser_20251005_1234"
- **TC2**: Verify product names "Samsung galaxy s6", "MacBook Pro"
- **TC3**: Verify confirmation message "Thank you for your purchase!"

### 7.4 Numeric Verification

**Purpose**: Verify prices, totals, and numeric calculations

**Implementation Pattern**:
```typescript
// Get numeric values
const price1 = await page.locator(priceSelector1).textContent();
const price2 = await page.locator(priceSelector2).textContent();
const total = await page.locator(totalSelector).textContent();

// Parse and calculate
const price1Num = parseFloat(price1.replace(/[^0-9.]/g, ''));
const price2Num = parseFloat(price2.replace(/[^0-9.]/g, ''));
const totalNum = parseFloat(total.replace(/[^0-9.]/g, ''));
const expectedTotal = price1Num + price2Num;

// Verify calculation
await expect.soft(totalNum).toBe(expectedTotal);
```

**Examples from Test Cases**:
- **TC2**: Verify total = sum of Samsung galaxy s6 ($360) + MacBook Pro ($1100) = $1460
- **TC4**: Verify total updates after removal to only MacBook Air price
- **TC3**: Verify order amount matches expected total

### 7.5 Error Message Validation

**Purpose**: Verify expected error texts (not applicable in current test cases but included for completeness)

**Implementation Pattern**:
```typescript
// Verify error message visibility
await expect.soft(page.locator(errorSelector)).toBeVisible();

// Verify error message text
await expect.soft(page.locator(errorSelector)).toHaveText(expectedErrorMessage);

// Verify error styling
await expect.soft(page.locator(errorSelector)).toHaveCSS('color', 'rgb(255, 0, 0)');
```

### 7.6 Modal/Popup Verification

**Purpose**: Verify modal appearance, content, and behavior

**Implementation Pattern**:
```typescript
// Verify modal appears
await expect.soft(page.locator(modalSelector)).toBeVisible();

// Verify modal content
await expect.soft(page.locator(modalTitleSelector)).toHaveText(expectedTitle);
await expect.soft(page.locator(modalBodySelector)).toContainText(expectedContent);

// Verify modal buttons
await expect.soft(page.locator(modalOkButton)).toBeVisible();
await expect.soft(page.locator(modalCancelButton)).toBeVisible();

// Verify modal closes after action
await page.locator(modalOkButton).click();
await expect.soft(page.locator(modalSelector)).toBeHidden();
```

**Examples from Test Cases**:
- **TC1**: Verify login modal opens and closes
- **TC3**: 
  - Verify checkout modal opens
  - Verify confirmation popup with order details
  - Verify OK button closes confirmation

### 7.7 Alert Verification

**Purpose**: Verify browser alerts and handle them appropriately

**Implementation Pattern**:
```typescript
// Setup alert listener before action
page.once('dialog', async dialog => {
  await expect.soft(dialog.message()).toBe('Product added');
  await dialog.accept();
});

// Perform action that triggers alert
await page.locator(addToCartButton).click();
```

**Examples from Test Cases**:
- **TC2**: Accept alert after each "Add to cart" action
- **TC5**: Accept alerts during shopping flow

### 7.8 Complete Verification Example

**From TC1: Login Test**
```typescript
test('should login successfully with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  
  await page.goto(BASE_URL);
  await loginPage.openLoginModal();
  await loginPage.loginWithValidAccount(VALID_USER);
  
  // Verification 1: Modal closes
  await expect.soft(page.locator(loginPage.locators.loginModal)).toBeHidden();
  
  // Verification 2: Navbar shows welcome message
  await expect.soft(page.locator(homePage.locators.welcomeMessage))
    .toContainText(`Welcome ${VALID_USER.username}`);
  
  // Verification 3: Display logout button
  await expect.soft(page.locator(homePage.locators.navbarLogout)).toBeVisible();
  
  // Verification 4: Hide login button
  await expect.soft(page.locator(homePage.locators.navbarLogin)).toBeHidden();
});
```

### 7.9 Soft Assertions Best Practices

**Why use `expect.soft()`:**
1. **Complete reporting**: All assertions are executed, not just until first failure
2. **Comprehensive feedback**: Developers see all issues in one test run
3. **Better debugging**: Multiple failure points provide more context
4. **Efficient testing**: No need to fix and re-run repeatedly

**When to use hard assertions:**
- When subsequent steps depend on assertion passing (e.g., element must exist before clicking)
- For critical preconditions that make test invalid if failed

**Implementation Guideline:**
- **Default to `expect.soft()`** for all verifications
- Use hard `expect()` only when absolutely necessary
- Group related soft assertions together
- Add descriptive messages for clarity

```typescript
await expect.soft(selector, 'Welcome message should be visible after login').toBeVisible();
```

---

## 8. Special Considerations

### 8.1 Alert Handling

**Challenge**: Browser alerts after adding products to cart require acceptance

**Solution Strategy**:
```typescript
// Implement in ProductDetailPage or as utility
async addToCart(): Promise<void> {
  // Setup alert listener before clicking
  this.page.once('dialog', async dialog => {
    expect.soft(dialog.message()).toBe(MESSAGES.PRODUCT_ADDED);
    await dialog.accept();
  });
  
  await this.clickElement(this.locators.addToCartButton);
  
  // Wait for alert to be handled
  await this.page.waitForTimeout(500);
}
```

**Affected Test Cases**: TC2, TC4, TC5

### 8.2 Timing and Synchronization

**Challenges**:
1. Modal animations (open/close)
2. Page navigation delays
3. Cart updates after item removal
4. Product list filtering after category selection

**Solution Strategy**:

**Use Playwright's built-in waiting mechanisms:**
```typescript
// Wait for element to be visible
await page.locator(selector).waitFor({ state: 'visible' });

// Wait for element to be hidden
await page.locator(selector).waitFor({ state: 'hidden' });

// Wait for navigation
await page.waitForURL(expectedURL);

// Wait for network idle (use sparingly)
await page.waitForLoadState('networkidle');
```

**Implement custom wait helpers:**
```typescript
// utils/wait-helpers.ts
export class WaitHelpers {
  static async waitForModalToOpen(page: Page, modalSelector: string): Promise<void> {
    await page.locator(modalSelector).waitFor({ state: 'visible', timeout: 5000 });
  }

  static async waitForModalToClose(page: Page, modalSelector: string): Promise<void> {
    await page.locator(modalSelector).waitFor({ state: 'hidden', timeout: 5000 });
  }

  static async waitForCartUpdate(page: Page): Promise<void> {
    // Wait for cart table to be stable
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // Allow time for cart recalculation
  }
}
```

**Configuration in `playwright.config.ts`:**
```typescript
export default defineConfig({
  use: {
    actionTimeout: 10000, // 10 seconds for actions
    navigationTimeout: 30000, // 30 seconds for navigation
  },
  expect: {
    timeout: 5000 // 5 seconds for assertions
  }
});
```

### 8.3 Internationalization (Japanese Text)

**Note**: Current test cases don't include Japanese text, but prompt mentions it as consideration

**Handling Strategy**:
```typescript
// If Japanese text is present in buttons/errors:

// 1. Use Unicode in locators
const loginButtonJapanese = 'text=ログイン';

// 2. Store in constants
export const JAPANESE_MESSAGES = {
  LOGIN: 'ログイン',
  LOGOUT: 'ログアウト',
  ADD_TO_CART: 'カートに追加'
};

// 3. Use in assertions
await expect.soft(page.locator(selector)).toHaveText(JAPANESE_MESSAGES.LOGIN);
```

### 8.4 Environment-Specific Configuration

**Configuration Management**:
```typescript
// constants/environment.ts
export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://www.demoblaze.com/',
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000'),
  HEADLESS: process.env.HEADLESS !== 'false',
  BROWSER: process.env.BROWSER || 'chromium',
  SLOWMO: parseInt(process.env.SLOWMO || '0')
};

// Usage in tests
await page.goto(ENV.BASE_URL);
```

**Environment Files**:
```bash
# .env.development
BASE_URL=https://www.demoblaze.com/
TIMEOUT=30000
HEADLESS=false

# .env.staging
BASE_URL=https://staging.demoblaze.com/
TIMEOUT=60000
HEADLESS=true

# .env.production
BASE_URL=https://www.demoblaze.com/
TIMEOUT=60000
HEADLESS=true
```

### 8.5 Error Handling Approach

**Page Object Level**:
```typescript
export class CommonPage {
  async clickElement(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).click();
    } catch (error) {
      console.error(`Failed to click element: ${selector}`, error);
      throw error; // Re-throw to fail test
    }
  }

  async safeClick(selector: string): Promise<boolean> {
    try {
      await this.page.locator(selector).click({ timeout: 5000 });
      return true;
    } catch (error) {
      console.warn(`Element not clickable: ${selector}`);
      return false;
    }
  }
}
```

**Test Level**:
```typescript
test('should handle errors gracefully', async ({ page }) => {
  try {
    // Test actions
    await homePage.selectProduct('Non-existent Product');
  } catch (error) {
    // Log error for debugging
    console.error('Test failed:', error);
    
    // Take screenshot for investigation
    await page.screenshot({ path: `error-${Date.now()}.png` });
    
    // Re-throw to mark test as failed
    throw error;
  }
});
```

**Global Error Handler** (in `playwright.config.ts`):
```typescript
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  }
});
```

### 8.6 Dynamic Content Handling

**Challenge**: Product prices may change, cart IDs are dynamic

**Solution**:
```typescript
// Instead of hardcoding prices, fetch and verify relative values
const product1Price = await cartPage.getProductPrice('Samsung galaxy s6');
const product2Price = await cartPage.getProductPrice('MacBook Pro');
const displayedTotal = await cartPage.getTotalPrice();
const calculatedTotal = product1Price + product2Price;

await expect.soft(displayedTotal).toBe(calculatedTotal);
```

### 8.7 Test Data Isolation

**Strategy**: Each test should be independent and not rely on other tests

**Implementation**:
```typescript
// Use beforeEach for setup
test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  // Each test starts from home page with clean state
});

// Use afterEach for cleanup
test.afterEach(async ({ page }) => {
  // Clear cart if needed
  // Logout if needed
  // Clean up test data
});
```

**Fixtures for Shared State**:
```typescript
// Use fixtures instead of global state
export const authenticatedUser = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup
    await loginPage.loginWithValidAccount(VALID_USER);
    // Provide page to test
    await use(page);
    // Teardown happens automatically
  }
});
```

### 8.8 Parallel Execution Considerations

**Configuration**:
```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4, // Adjust based on environment
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0
});
```

**Test Isolation**:
- Each test uses separate browser context (automatic)
- Avoid shared global state
- Use unique test data per test
- Don't depend on test execution order

---

## 9. Quality Assurance

### 9.1 Peer Review Process

**Code Review Checklist**:

- [ ] **Test Coverage**
  - All test cases from `testcase-demo.md` are implemented
  - Each test step has corresponding code
  - All expected results have assertions

- [ ] **Code Quality**
  - Follows naming conventions (camelCase for methods, PascalCase for classes)
  - No code duplication (reusable methods used)
  - Proper error handling implemented
  - Comments added for complex logic

- [ ] **Page Objects**
  - Each page object extends `CommonPage`
  - Methods are business-level (not low-level clicks)
  - Locators defined in separate locator files
  - Locator classes extend `CommonLocators`

- [ ] **Assertions**
  - All verifications use `expect.soft()` by default
  - Hard assertions only where necessary
  - Descriptive assertion messages included
  - All expected results from test cases verified

- [ ] **Test Data**
  - Uses data from `data/` directory
  - Interfaces properly defined
  - No hardcoded values in test code
  - Test data is maintainable

- [ ] **Special Handling**
  - Alert handling implemented correctly
  - Wait strategies appropriate
  - Navigation verified
  - Modals handled properly

**Review Process**:
1. Developer creates pull request with test implementation
2. Reviewer checks against this test plan
3. Reviewer runs tests locally to verify execution
4. Reviewer provides feedback on checklist items
5. Developer addresses feedback
6. Final approval and merge

### 9.2 Validation Criteria

**Test Implementation Completion**:

| Criterion | Description | Validation Method |
|-----------|-------------|------------------|
| **Completeness** | All 5 test cases implemented | Count test functions match test cases |
| **Correctness** | Tests follow test case steps exactly | Manual review of test steps vs implementation |
| **Assertions** | All expected results verified | Count assertions match expected results |
| **Execution** | All tests pass on first run | Run test suite with `npm test` |
| **Consistency** | Follows project structure | Verify file organization matches plan |
| **Reusability** | Common patterns extracted | Check for duplicate code |

**Acceptance Criteria for Each Test**:
- Test name clearly describes what is being tested
- Test follows arrange-act-assert pattern
- All preconditions are met before test actions
- Each test step from test case has corresponding code
- Each expected result has soft assertion
- Test cleans up after itself (if needed)
- Test is independent (can run in isolation)

**Test Suite Validation**:
```bash
# All tests should pass
npm test

# Generate test report
npm run test:report

# Check code coverage (if applicable)
npm run test:coverage
```

### 9.3 Documentation Requirements

**Code Documentation**:

```typescript
/**
 * Verifies successful login with valid user credentials
 * Test Case ID: TC1
 * 
 * Preconditions:
 * - User account exists: autouser_20251005_1234
 * 
 * Steps:
 * 1. Click Log in button
 * 2. Input username
 * 3. Input password
 * 4. Click Log in
 * 
 * Expected Results:
 * 1. Modal closes, user stays on Home page
 * 2. Navbar shows welcome message
 * 3. Display logout button
 * 4. Hide login button
 */
test('should login successfully with valid credentials', async ({ page }) => {
  // Test implementation
});
```

**Page Object Documentation**:
```typescript
/**
 * LoginPage handles all authentication-related interactions
 * 
 * Locator File: login-locators.ts
 * 
 * Key Methods:
 * - openLoginModal(): Opens the login dialog
 * - loginWithValidAccount(): Performs complete login flow
 * - verifyLoginSuccess(): Verifies successful login state
 */
export class LoginPage extends CommonPage {
  // Implementation
}
```

**Required Documentation Files**:
1. **README.md** in `tests/` directory
   - Overview of test suite
   - How to run tests
   - Test organization structure
   - Common issues and solutions

2. **Page Object README.md** in `pages/` directory
   - List of all page objects
   - Purpose of each page object
   - Common methods available

3. **Test Data README.md** in `data/` directory
   - Available test data
   - How to add new test data
   - Data maintenance guidelines

### 9.4 Maintenance Considerations

**Regular Maintenance Tasks**:

| Task | Frequency | Owner | Description |
|------|-----------|-------|-------------|
| **Update Locators** | As needed | QA Team | Update selectors when UI changes |
| **Review Test Data** | Monthly | QA Team | Ensure test data is valid and relevant |
| **Check Dependencies** | Weekly | DevOps | Update Playwright and dependencies |
| **Analyze Failures** | Daily | QA Team | Investigate and fix flaky tests |
| **Refactor Code** | Quarterly | QA Team | Improve test code quality |

**Handling UI Changes**:
- **Locator updates**: Only need to update locator files, not test code
- **Page flow changes**: Update page object methods
- **New features**: Add new page objects following same pattern
- **Removed features**: Archive or remove corresponding tests

**Version Control**:
- Use meaningful commit messages
- Tag stable versions
- Branch strategy: `feature/test-[feature-name]`
- Keep test plan updated with implementation changes

**Flaky Test Management**:
```typescript
// Mark flaky tests for investigation
test.fixme('should handle intermittent issue', async ({ page }) => {
  // Test code
});

// Skip temporarily if blocking
test.skip('should work after bug fix', async ({ page }) => {
  // Test code
});

// Retry flaky tests
test.describe.configure({ retries: 2 });
```

**Performance Monitoring**:
- Track test execution time
- Identify slow tests for optimization
- Use parallel execution where possible
- Monitor CI/CD pipeline performance

**Knowledge Transfer**:
- Document lessons learned
- Share common patterns
- Conduct code reviews
- Maintain test plan documentation
- Create troubleshooting guides

---

## Summary

This comprehensive test plan provides a complete blueprint for implementing Playwright test scripts for the DemoBlaze e-commerce application. The plan covers:

✅ **5 test cases** spanning login, cart management, checkout, and end-to-end flows  
✅ **5 page objects** with clear responsibilities and reusable methods  
✅ **Locator inheritance structure** extending from common base  
✅ **Test data management** with interfaces and centralized data  
✅ **Soft assertion strategy** for comprehensive reporting  
✅ **Special handling** for alerts, timing, and navigation  
✅ **Quality assurance** processes for peer review and maintenance  

By following this plan, developers can implement consistent, maintainable, and robust test automation that accurately reflects the test cases and adheres to project conventions.

---

**Document Version**: 1.0  
**Last Updated**: October 21, 2025  
**Status**: Ready for Implementation
