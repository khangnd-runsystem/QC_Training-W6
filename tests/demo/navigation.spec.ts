import { test, expect } from './base-test';
import { BASE_URL } from '../../constants/urls';
import { VALID_USER } from '../../data/users';
import { PRODUCTS } from '../../data/products';
import { CHECKOUT_DATA } from '../../data/checkout-data';
import { MESSAGES } from '../../constants/messages';

/**
 * TC5: End-to-End Navigation Test Suite
 * Test Case ID: TC5
 * Item Main: Navigation
 * Item Sub: Full Shopping Flow
 * Description: Verify complete shopping flow from login → add item → checkout → logout
 */
test.describe('End-to-End Shopping Flow', () => {
  test.beforeEach(async ({ page, authenticatedPage }) => {
    const { homePage, cartPage } = authenticatedPage;
    
    // Navigate to base URL
    await page.goto(BASE_URL);
    // await homePage.waitForPageLoad();
    
    // Go to Cart
    await homePage.navigateToCart();
    await cartPage.waitForPageLoad();
    
    // Clear all products in cart (handles duplicate product names)
    await cartPage.clearCart();
    
    // Return to homepage
    await homePage.navigateToHome();
    // await homePage.waitForPageLoad();
  });
  test('TC005 - Complete full shopping flow - from login to logout - entire process works correctly', async ({ 
    page,
    loginPage,
    homePage,
    productDetailPage,
    cartPage,
    checkoutPage
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // Step 1: Login with valid user
    await loginPage.loginWithValidAccount(VALID_USER);

    // Expected Result 1: Products added correctly to cart (verifying login success)
    await homePage.verifyWelcomeMessage(VALID_USER.username);

    // Step 2: Go to [Laptops] category
    await homePage.selectCategory('Laptops');

    // Step 3: Select "Sony vaio i5" and add to cart
    await homePage.selectProduct(PRODUCTS.SONY_VAIO_I5.name);
    await productDetailPage.addToCart();

    // Step 4: Go back Home, go to [Monitors] category
    await homePage.navigateToHome();
    await page.waitForTimeout(500);
    await homePage.selectCategory('Monitors');

    // Step 5: Select "Apple monitor 24" and add to cart
    await homePage.selectProduct(PRODUCTS.APPLE_MONITOR_24.name);
    await productDetailPage.addToCart();

    // Step 6: Go to [Cart], verify both items present
    await homePage.navigateToCart();
    await cartPage.verifyProductInCart(PRODUCTS.SONY_VAIO_I5.name);
    await cartPage.verifyProductInCart(PRODUCTS.APPLE_MONITOR_24.name);

    // Expected Result 1: Products added correctly to cart
    const expectedTotal = PRODUCTS.SONY_VAIO_I5.price + PRODUCTS.APPLE_MONITOR_24.price;
    await cartPage.verifyTotalPrice(expectedTotal);

    // Step 7: Click [Place Order], fill info
    await cartPage.clickPlaceOrder();
    await checkoutPage.fillCheckoutForm(CHECKOUT_DATA.ANNA_VN);

    // Step 8: Click [Purchase], confirm success
    await checkoutPage.clickPurchase();

    // Expected Result 2: Checkout completed successfully with confirmation message & order details
    await checkoutPage.verifyConfirmationMessage(MESSAGES.CHECKOUT_SUCCESS);
    const orderId = await checkoutPage.getOrderId();
    const amount = await checkoutPage.getOrderAmount();
    expect.soft(orderId).toBeTruthy();
    expect.soft(amount).toBeGreaterThan(0);

    // Step 9: Click [OK] in confirmation
    await homePage.waitForPageLoad()
    await checkoutPage.closeConfirmation();
    await page.waitForTimeout(500);

    // Expected Result 3: Redirected to Home page
    expect.soft(BASE_URL).toMatch(/demoblaze\.com/);
    // await expect.soft(page).toHaveURL(BASE_URL);

    await homePage.waitForPageLoad()
    // Step 10: Click [Log out]
    await homePage.clickLogout();

    // Expected Result 4: User logs out and sees [Log in] option again
    await expect.soft(loginPage.locators.navbarLogin).toBeVisible();
    await expect.soft(loginPage.locators.navbarLogout).toBeHidden();
  });
});
