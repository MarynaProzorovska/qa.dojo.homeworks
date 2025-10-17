import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('https://demo.learnwebdriverio.com/login')
})

test("Sign in with wrong email - MP010", async({page}) => {
    await page.getByRole('textbox', { name: 'Email' }).fill("teststst@tetet.com")
    await page.getByRole('textbox', { name: 'Password' }).fill("Test123")
    await page.getByRole('button', { name: 'Sign in' }).click()
    const errorMessage = await page.getByText('email or password is invalid');
    await expect(errorMessage).toBeVisible();
})

test("Sign in with wrong password - MP011", async({page}) => {
    await page.getByRole('textbox', { name: 'Email' }).fill("maryna123@test.com")
    await page.getByRole('textbox', { name: 'Password' }).fill("teeeest")
    await page.getByRole('button', { name: 'Sign in' }).click()
   const errorMessage = await page.getByText('email or password is invalid');
    await expect(errorMessage).toBeVisible();
})

test("Successful sign in - MP012", async({page}) => {
    await page.getByRole('textbox', { name: 'Email' }).fill("maryna12345@test.com")
    await page.getByRole('textbox', { name: 'Password' }).fill("Test123")
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.locator('.home-page')).toBeVisible() 
})
