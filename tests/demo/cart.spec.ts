import { test, expect } from './base-test';
import { BASE_URL, URLS } from '../../constants/urls';
import { PRODUCTS } from '../../data/products';

/**
 * TC2 & TC4: Cart Management Test Suite
 */
test.describe('Shopping Cart Management', () => {

  /**
   * TC2: Add Multiple Items
   * Test Case ID: TC2
   * Item Main: Cart
   * Item Sub: Add Multiple Items
   * Description: Verify adding multiple products from different categories to cart
   */
  test('TC002 - Add multiple products to cart - when selecting items from different categories - all selected products appear in cart', async ({ 
    page,
    authenticatedPage 
  }) => {
    const { homePage, productDetailPage, cartPage } = authenticatedPage;

    await page.goto(BASE_URL);

    // Step 1: From Home page, click category [Phones]
    await homePage.selectCategory('Phones');

    // Step 2: Click product "Samsung galaxy s6"
    await homePage.selectProduct(PRODUCTS.SAMSUNG_GALAXY_S6.name);

    // Step 3: Click [Add to cart], accept alert
    await productDetailPage.addToCart();

    // Step 4: Click [Home] from navbar
    await homePage.navigateToHome();
    await page.waitForTimeout(500);

    // Step 5: Click category [Laptops]
    await homePage.selectCategory('Laptops');

    // Step 6: Click product "MacBook Pro"
    await homePage.selectProduct(PRODUCTS.MACBOOK_PRO.name);

    // Step 7: Click [Add to cart], accept alert
    await productDetailPage.addToCart();

    // Step 8: Click [Cart]
    await homePage.navigateToCart();

    // Expected Result 1: Cart page displays 2 products: "Samsung galaxy s6", "MacBook Pro"
    await cartPage.verifyProductInCart(PRODUCTS.SAMSUNG_GALAXY_S6.name);
    await cartPage.verifyProductInCart(PRODUCTS.MACBOOK_PRO.name);

    // Expected Result 2: Display correct prices for each item
    await cartPage.verifyProductPrice(PRODUCTS.SAMSUNG_GALAXY_S6.name, PRODUCTS.SAMSUNG_GALAXY_S6.price);
    await cartPage.verifyProductPrice(PRODUCTS.MACBOOK_PRO.name, PRODUCTS.MACBOOK_PRO.price);

    // Expected Result 3: Total = sum of product prices
    const expectedTotal = PRODUCTS.SAMSUNG_GALAXY_S6.price + PRODUCTS.MACBOOK_PRO.price;
    await cartPage.verifyTotalPrice(expectedTotal);
  });

  /**
   * TC4: Remove Item
   * Test Case ID: TC4
   * Item Main: Cart
   * Item Sub: Remove Item
   * Description: Verify removing single item updates cart and total
   */
  test('TC004 - Remove single item - when deleting item from cart - cart updates and total recalculates', async ({ 
    page,
    authenticatedPage 
  }) => {
    const { homePage, productDetailPage, cartPage } = authenticatedPage;

    await page.goto(BASE_URL);

    // Precondition: Add 2 products into cart
    // Add Sony xperia z5
    await homePage.selectCategory('Phones');
    await homePage.selectProduct(PRODUCTS.SONY_XPERIA_Z5.name);
    await productDetailPage.addToCart();
    await homePage.navigateToHome();
    await page.waitForTimeout(500);

    // Add MacBook Air
    await homePage.selectCategory('Laptops');
    await homePage.selectProduct(PRODUCTS.MACBOOK_AIR.name);
    await productDetailPage.addToCart();

    // Step 1: Go to [Cart]
    await homePage.navigateToCart();

    // Step 2: Verify both items are displayed
    await cartPage.verifyProductInCart(PRODUCTS.SONY_XPERIA_Z5.name);
    await cartPage.verifyProductInCart(PRODUCTS.MACBOOK_AIR.name);

    // Step 3: Click [Delete] on "Sony xperia z5"
    await cartPage.removeProduct(PRODUCTS.SONY_XPERIA_Z5.name);

    // Step 4: Observe cart
    // Expected Result 1: "Sony xperia z5" removed from cart
    const items = await cartPage.getCartItems();
    expect.soft(items).not.toContain(PRODUCTS.SONY_XPERIA_Z5.name);

    // Expected Result 2: Only "MacBook Air" remains
    await cartPage.verifyProductInCart(PRODUCTS.MACBOOK_AIR.name);

    // Expected Result 3: Total updated = price of "MacBook Air" only
    await cartPage.verifyTotalPrice(PRODUCTS.MACBOOK_AIR.price);
  });
});
