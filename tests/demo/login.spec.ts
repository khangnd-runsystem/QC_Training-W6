import { test, expect } from './base-test';
import { BASE_URL } from '../../constants/urls';
import { VALID_USER } from '../../data/users';

/**
 * TC1: Login Test Suite
 * Test Case ID: TC1
 * Item Main: Login
 * Item Sub: Valid Login
 * Description: Verify successful login with valid credentials
 */
test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC001 - Login successfully - when using valid credentials - user is authenticated and UI updates correctly', async ({ 
    page,
    loginPage,
    homePage 
  }) => {
    // Step 1-4: Perform login with valid credentials
    await loginPage.loginWithValidAccount(VALID_USER);

    // Expected Result 1: Modal closes, user stays on Home page
    await expect.soft(loginPage.locators.loginModal).toBeHidden();
    await expect.soft(page).toHaveURL(BASE_URL);

    // Expected Result 2: Navbar shows text "Welcome autouser_20251005_1234"
    await loginPage.verifyLoginSuccess(VALID_USER.username);

    // Expected Result 3: Display [Log out] button
    await loginPage.verifyLogoutButtonVisible();

    // Expected Result 4: Hide [Log in] button
    await loginPage.verifyLoginButtonHidden();
  });
});
