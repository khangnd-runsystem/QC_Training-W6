import { test, expect } from './base-test';
import { BASE_URL, URLS } from '../../constants/urls';
import { PRODUCTS } from '../../data/products';
import { CHECKOUT_DATA } from '../../data/checkout-data';
import { MESSAGES } from '../../constants/messages';

/**
 * TC3: Checkout Test Suite
 * Test Case ID: TC3
 * Item Main: Checkout
 * Item Sub: Place Order with Valid Info
 * Description: Verify checkout flow works with valid customer info
 */
test.describe('Checkout Process', () => {
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
  test('TC003 - Complete checkout process - when entering valid customer information - order is placed successfully and confirmation is shown', async ({ 
    page,
    authenticatedPage 
  }) => {
    const { homePage, productDetailPage, cartPage, checkoutPage } = authenticatedPage;

    await page.goto(BASE_URL);
    // await homePage.waitForPageLoad();

    // Precondition: Add at least 1 product to cart
    await homePage.selectCategory('Phones');
    await homePage.selectProduct(PRODUCTS.SAMSUNG_GALAXY_S6.name);
    await productDetailPage.addToCart();

    // Step 1: Navigate to [Cart]
    await homePage.navigateToCart();

    // Step 2: Verify item(s) displayed with correct name & price
    await cartPage.verifyProductInCart(PRODUCTS.SAMSUNG_GALAXY_S6.name);
    await cartPage.verifyProductPrice(PRODUCTS.SAMSUNG_GALAXY_S6.name, PRODUCTS.SAMSUNG_GALAXY_S6.price);

    // Step 3: Click [Place Order]
    await cartPage.clickPlaceOrder();

    // Step 4: Fill info
    await checkoutPage.fillCheckoutForm(CHECKOUT_DATA.JOHN_DOE);

    // Step 5: Click [Purchase]
    await checkoutPage.clickPurchase();
    // await page.pause();

    // Expected Result 1: Confirmation popup displayed with "Thank you for your purchase!"
    await checkoutPage.verifyConfirmationMessage(MESSAGES.CHECKOUT_SUCCESS);

    // Expected Result 2: Display Order ID and Amount
    const orderId = await checkoutPage.getOrderId();
    const amount = await checkoutPage.getOrderAmount();
    expect.soft(orderId).toBeTruthy();
    expect.soft(amount).toBeGreaterThan(0);

    // Expected Result 3: Click [OK] closes popup and redirects to Home page
    await homePage.waitForPageLoad()
    await checkoutPage.closeConfirmation();
    // await homePage.waitForPageLoad()
    expect.soft(BASE_URL).toMatch(/demoblaze\.com/);

    // Expected Result 4: Cart is cleared
    await homePage.navigateToCart();
    await page.waitForTimeout(500);
    await cartPage.verifyCartEmpty();
  });
});
