import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { HomePage } from '../../pages/home-page';
import { ProductDetailPage } from '../../pages/product-detail-page';
import { CartPage } from '../../pages/cart-page';
import { CheckoutPage } from '../../pages/checkout-page';
import { VALID_USER } from '../../data/users';
import { BASE_URL } from '../../constants/urls';

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: {
    loginPage: LoginPage;
    homePage: HomePage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
  };
};

export const test = base.extend<PageFixtures>({
  // LoginPage fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // HomePage fixture
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // ProductDetailPage fixture
  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new ProductDetailPage(page);
    await use(productDetailPage);
  },

  // CartPage fixture
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  // CheckoutPage fixture
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  // Authenticated user fixture - provides pre-authenticated page objects
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Navigate to home page and login
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded'); // Wait for page to fully load
    await loginPage.loginWithValidAccount(VALID_USER);
    
    // Provide all page objects to the test
    await use({
      loginPage,
      homePage,
      productDetailPage,
      cartPage,
      checkoutPage
    });
  }
});

export { expect } from '@playwright/test';
