import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('https://coffee-cart.app/')
})

test('Buying one coffee and verifying the purchase - MP001', async ({ page }) => {
  await page.getByText('Espresso Macchiato $12.00espressomilk foam').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $12.00');
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('maryna');
  await page.getByRole('textbox', { name: 'Email' }).fill('maryna@test.test');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Thanks for your purchase.' }).isVisible();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});

test('Buying three caps of coffee with a discount coffee - MP002', async ({ page }) => {
  await page.locator('[data-test="Mocha"]').dblclick();
  await page.locator('[data-test="Mocha"]').click();
  await expect(page.locator('#app')).toContainText("It's your lucky day! Get an extra cup of Mocha for $4.");
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
  await page.locator('data-test=checkout').hover();
  await expect(page.locator('#app')).toContainText('(Discounted) Mocha x 1+-Mocha x 3+-');
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('maryna');
  await page.getByRole('textbox', { name: 'Email' }).fill('maryna@test.test');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Thanks for your purchase.' }).isVisible();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});

test('Declining coffee with a discount - MP003', async ({ page }) => {
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('[data-test="Americano"]').click();
  await page.getByRole('button', { name: 'Nah, I\'ll skip.' }).click();
  await page.locator('data-test=checkout').hover();
  await expect(page.locator('#app')).toContainText('Americano x 1+-Cappuccino x 1+-Espresso Macchiato x 1+-');
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $38.00');
})

test('Adding and removing coffee from the cart - MP004', async ({ page }) => {
  await page.locator('[data-test="Cappuccino"]').dblclick();
  await page.getByRole('listitem').filter({ hasText: 'cart' }).click();
  await page.getByRole('button', { name: 'Remove one Cappuccino' }).click();
  await page.locator('div').filter({ hasText: /^Cappuccino$/ })
  await page.getByRole('button', { name: 'Remove all Cappuccino' }).click();
  await page.getByText('No coffee, go add some.').click();
});

test('Adding and removing coffee from cart preview - MP005', async ({ page }) => {
  await page.locator('[data-test="Cappuccino"]').dblclick();
  await expect(page.locator('#app')).toContainText('Cappuccino x 2');
  await page.locator('[data-test="checkout"]').hover()
  await page.getByRole('button', { name: 'Remove one Cappuccino' }).click();
  await expect(page.locator('#app')).toContainText('Cappuccino x 1');
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $19.00');
  await page.getByRole('button', { name: 'Remove one Cappuccino' }).click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});


