import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('sign up, create a goal, earn an award', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Sign up
  await page.getByRole('navigation').getByRole('button', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(faker.internet.email());

  await page.getByRole('textbox', { name: 'Password' }).fill('Test1234!');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Accept' }).click();

  // Add a goal
  await page.getByRole('button', { name: 'My Profile' }).click();
  await page.getByRole('button', { name: 'add goal' }).click();
  await page.getByRole('textbox', { name: 'Title:' }).fill('Novel November');
  await page.getByRole('spinbutton', { name: 'Duration:' }).fill('30');
  await page.getByLabel('progress unit').selectOption('words');
  await page.getByRole('spinbutton', { name: 'Target:' }).fill('50000');
  await page.getByRole('textbox', { name: 'Start Date:' }).fill('2025-11-01');
  await page.getByRole('button', { name: 'Save' }).click();

  // Update wordcount
  await page.getByRole('button', { name: 'Novel November' }).click();
  await page.getByRole('button', { name: 'November 1,' }).click();
  await page.getByRole('spinbutton', { name: 'wordcount for 11/1/' }).fill('2000');
  await page.getByRole('button', { name: 'Save' }).press('Enter');
  await page.getByRole('button', { name: 'Accept Trophy' }).click();
});