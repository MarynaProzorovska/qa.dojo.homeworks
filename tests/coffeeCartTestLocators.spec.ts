import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('https://coffee-cart.app/')
})

test('Buying one coffee and verifying the purchase - MP013', async ({ page }) => {
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $12.00');
  await page.locator('[data-test="checkout"]').click();
  await page.locator('id=name').fill('maryna');
  await page.locator('id=email').fill('maryna@test.test');
  await page.locator('id=submit-payment').click();
  await page.locator('.snackbar success').isVisible();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});

test('Buying three caps of coffee with a discount coffee - MP014', async ({ page }) => {
  await page.locator('[data-test="Mocha"]').dblclick();
  await page.locator('[data-test="Mocha"]').click();
  await expect(page.locator('.promo')).toContainText("It's your lucky day! Get an extra cup of Mocha for $4.");
  await page.locator('.yes').click();
  await page.locator('data-test=checkout').hover();
  await expect(page.locator('.list-item', {hasText: '(Discounted) Mocha x 1'})).toBeVisible()
  await expect(page.locator('.list-item', {hasText: 'Mocha x 3'})).toBeVisible()
  await page.locator('[data-test="checkout"]').click();
  await page.locator('id=name').fill('maryna');
  await page.locator('id=email').fill('maryna@test.test');
  await page.locator('id=submit-payment').click();
  await page.locator('.snackbar success').isVisible();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});

test('Declining coffee with a discount - MP015', async ({ page }) => {
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('[data-test="Americano"]').click();
  await page.getByRole('button', { name: 'Nah, I\'ll skip.' }).click(); // нема по чому знайти
  await page.locator('data-test=checkout').hover();
  await expect(page.locator('li', {hasText: 'Americano x 1'})).toBeVisible();
  await expect(page.locator('li', {hasText: 'Cappuccino x 1'})).toBeVisible();
  await expect(page.locator('li', {hasText: 'Espresso Macchiato x 1'})).toBeVisible() ;
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $38.00');
})

test('Adding and removing coffee from the cart - MP016', async ({ page }) => {
  await page.locator('[data-test="Cappuccino"]').dblclick();
  await page.locator('[aria-label="Cart page"]').click();
  await page.getByRole('button', {name: "Remove one Cappuccino"}).click(); // по лейблу не можна, бо знаходить два елементи
  await expect(page.locator('.unit-desc', {hasText: '$19.00 x 1'})).toBeVisible()
  await page.locator('[aria-label="Remove all Cappuccino"]').click();
  await page.locator('.list', {hasText: 'No coffee, go add some.'} ).click();
});

test('Adding and removing coffee from cart preview - MP017', async ({ page }) => {
  await page.locator('[data-test="Cappuccino"]').dblclick();
  await page.locator('data-test=checkout').hover();
  await expect(page.locator('li', {hasText: 'Cappuccino x 2'})).toBeVisible();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $38.00');
  await page.locator('[aria-label="Remove one Cappuccino"]').click();
  await expect(page.locator('li', {hasText: 'Cappuccino x 1'})).toBeVisible();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $19.00');
  await page.locator('[aria-label="Remove one Cappuccino"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
});