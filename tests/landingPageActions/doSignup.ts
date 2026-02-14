import { faker } from "@faker-js/faker";
import { Page } from "@playwright/test";

export const doSignup = async (page: Page) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('navigation').getByRole('button', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(faker.internet.email());

  await page.getByRole('textbox', { name: 'Password' }).fill('Test1234!');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Accept' }).click();
}