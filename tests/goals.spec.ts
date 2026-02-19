import { test } from '@playwright/test';
import { doSignup } from './landingPageActions/doSignup';
import { addAGoal } from './profilePageActions/addAGoal';

test('sign up, create a goal, earn an award', async ({ page }) => {
  await doSignup(page)

  await page.getByRole('button', { name: 'My Profile' }).click();
  await addAGoal(page)

  // Update wordcount
  await page.getByRole('button', { name: 'Novel November' }).click();
  await page.getByRole('button', { name: 'November 1,' }).click();
  await page.getByRole('spinbutton', { name: 'wordcount for 11/1/' }).fill('2000');
  await page.getByRole('button', { name: 'Save' }).press('Enter');
  await page.getByRole('button', { name: 'Accept Trophy' }).click();
});