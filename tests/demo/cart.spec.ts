import { test, expect } from './base-test';
import { BASE_URL, URLS } from '../../constants/urls';
import { PRODUCTS } from '../../data/products';

/**
 * TC2 & TC4: Cart Management Test Suite
 */
test.describe('Shopping Cart Management', () => {

  /**
   * Setup: Clear cart before each test
   */
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
    // await homePage.waitForPageLoad();

    // Step 1: From Home page, click category [Phones]
    await homePage.selectCategory('Phones');
    // Wait for the product list to load and the specific product to be visible
    await page.waitForSelector(`//h4[@class="card-title"]//a[contains(text(), "${PRODUCTS.SAMSUNG_GALAXY_S6.name}")]`, { 
      state: 'visible',
      timeout: 10000 
    });

    // Step 2: Click product "Samsung galaxy s6"
    await homePage.selectProduct(PRODUCTS.SAMSUNG_GALAXY_S6.name);

    // Step 3: Click [Add to cart], accept alert
    // await productDetailPage.waitForPageLoad()
    await productDetailPage.addToCart();

    // Step 4: Click [Home] from navbar
    await homePage.navigateToHome();
    // await homePage.waitForPageLoad();

    // Step 5: Click category [Laptops]
    await homePage.selectCategory('Laptops');
    await page.waitForSelector(`//h4[@class="card-title"]//a[contains(text(), "${PRODUCTS.MACBOOK_PRO.name}")]`, { 
      state: 'visible',
      timeout: 10000 
    });
    // Step 6: Click product "MacBook Pro"
    await homePage.selectProduct(PRODUCTS.MACBOOK_PRO.name);

    // Step 7: Click [Add to cart], accept alert
    // await productDetailPage.waitForPageLoad()
    await productDetailPage.addToCart();
    await homePage.navigateToHome();

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
    // await homePage.waitForPageLoad();
    
    // Precondition: Add 2 products into cart
    // Add Sony xperia z5
    await homePage.selectCategory('Phones');
    // Wait for the product list to load and the specific product to be visible
    await page.waitForSelector(`//h4[@class="card-title"]//a[contains(text(), "${PRODUCTS.SONY_XPERIA_Z5.name}")]`, { 
      state: 'visible',
      timeout: 10000 
    });
    await homePage.selectProduct(PRODUCTS.SONY_XPERIA_Z5.name);
    await productDetailPage.addToCart();
    await homePage.navigateToHome();
    // await homePage.waitForPageLoad();

    // Add MacBook Air
    await homePage.selectCategory('Laptops');
    await page.waitForSelector(`//h4[@class="card-title"]//a[contains(text(), "${PRODUCTS.MACBOOK_AIR.name}")]`, { 
      state: 'visible',
      timeout: 10000 
    });
    await homePage.selectProduct(PRODUCTS.MACBOOK_AIR.name);
    await productDetailPage.addToCart();

    await homePage.navigateToHome();
    // await homePage.waitForPageLoad();
    
    // Step 1: Go to [Cart]
    await homePage.navigateToCart();
    // await cartPage.waitForPageLoad();


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
