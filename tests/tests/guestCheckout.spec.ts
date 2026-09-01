import { test, expect } from '@playwright/test';

test.describe('Shopware 6 Storefront — Guest Checkout E2E', () => {
  test('Complete guest checkout using Cash on Delivery', async ({ page }) => {
    // 1. Open Storefront
    await page.goto('https://www.shopware6-demo.development-s25.com/');
    await expect(page).toHaveTitle(/Shopware/i);

    // 2. Search & Select Product
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('Aerodynamic');
    await searchInput.press('Enter');
    
    const productItem = page.locator('.product-box a').first();
    await productItem.click();

    // 3. Add to Cart
    const addToCartBtn = page.locator('button.btn-buy').first();
    await addToCartBtn.click();

    // 4. Proceed to Checkout
    const checkoutBtn = page.locator('a:has-text("Proceed to checkout")').first();
    await checkoutBtn.click();

    // 5. Fill Guest Registration Details
    const uniqueEmail = `test.guest.${Date.now()}@example.com`;
    
    await page.locator('input[name="firstName"]').first().fill('Automation');
    await page.locator('input[name="lastName"]').first().fill('Tester');
    await page.locator('input[name="email"]').first().fill(uniqueEmail);
    await page.locator('input[name="billingAddress[street]"]').first().fill('Teststrasse 12');
    await page.locator('input[name="billingAddress[zipcode]"]').first().fill('10115');
    await page.locator('input[name="billingAddress[city]"]').first().fill('Berlin');

    const submitRegister = page.locator('button[type="submit"]:has-text("Continue")').first();
    await submitRegister.click();

    // 6. Select Cash on Delivery
    const codOption = page.locator('label:has-text("Cash on delivery")').first();
    if (await codOption.isVisible()) {
      await codOption.click();
    }

    // 7. Confirm Order
    const submitOrder = page.locator('#confirmFormSubmit, button:has-text("Submit order")').first();
    await expect(submitOrder).toBeEnabled();
    await submitOrder.click();

    // 8. Assert Success
    await expect(page).toHaveURL(/.*\/checkout\/finish/);
    await expect(page.locator('body')).toContainText(/Thank you for your order/i);
  });
});
