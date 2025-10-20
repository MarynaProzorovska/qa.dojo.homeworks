import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('https://demo.learnwebdriverio.com/register')
})


test("Sign up with wrong email - MP006", async ({page}) => {
    await page.getByRole('textbox', { name: 'Username' }).fill("Maryna3");
    await page.getByRole('textbox', { name: 'Email' }).fill("Maryna");
    await page.getByRole('textbox', { name: 'Password' }).fill("Test123");
    await page.getByRole('button', { name: 'Sign up' }).click();
    const errorMessage = await page.getByText('email is invalid');
    await expect(errorMessage).toBeVisible();
})

test("Sign up with empty password - MP007", async ({page}) => { //found BUG
    await page.getByRole('textbox', { name: 'Username' }).fill("Maryna10");
    await page.getByRole('textbox', { name: 'Email' }).fill("Maryna10@test.com");
    await page.getByRole('textbox', { name: 'Password' }).fill("");
    await page.getByRole('button', { name: 'Sign up' }).click();
    const errorMessage = await page.getByText('password is invalid');
    await expect(errorMessage).toBeVisible();
})

test("Sign up successfully - MP008", async ({page}) => {
    await page.getByRole('textbox', { name: 'Username' }).fill("Maryna5");
    await page.getByRole('textbox', { name: 'Email' }).fill("Maryna2@test.com");
    await page.getByRole('textbox', { name: 'Password' }).fill("Test123");
    await page.getByRole('button', { name: 'Sign up' }).click();
    expect(page).toHaveURL('https://demo.learnwebdriverio.com/')
    // const successMessage = await page.getByText('conduitA place to share your');
    // expect(successMessage).toBeVisible();
})
test("Sign up with the same username - MP009", async ({page}) => {
    await page.getByRole('textbox', { name: 'Username' }).fill("Maryna4");
    await page.getByRole('textbox', { name: 'Email' }).fill("Maryna2@test.com");
    await page.getByRole('textbox', { name: 'Password' }).fill("Test123");
    await page.getByRole('button', { name: 'Sign up' }).click();
    const errorMessage1 = await page.getByText('username is already taken.');
    await expect(errorMessage1).toBeVisible();
    const errorMessage2 = await page.getByText('email is already taken.');
    await expect(errorMessage2).toBeVisible();
})