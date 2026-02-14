import { test, expect } from '@playwright/test';
import { doSignup } from './landingPageActions/doSignup';
import { addAGoal } from './profilePageActions/addAGoal';

test('myProfile', async ({ page }) => {
  await doSignup(page)
  await page.getByRole('button', { name: 'My Profile' }).click();
  
  // fill out profile
  await page.getByRole('button', { name: 'edit profile' }).click();
  await page.getByRole('textbox', { name: 'Display Name:' }).fill('New Name');
  await page.getByRole('textbox', { name: 'About me:' }).fill('I am a description.');
  await page.getByRole('button', { name: 'Save' }).click();

  await addAGoal(page, {title: "Goal Title", visibility: 'public'})

  //view public profile
  await page.getByRole('button', { name: 'view' }).click();
  expect(page.getByRole('heading', { name: 'New Name\'s Profile' })).toBeVisible();
  expect(page.getByText('I am a description.')).toBeVisible()
  expect(page.getByText('Trophy Case')).toBeVisible()
  expect(page.getByText('Goal Title')).toBeVisible()
});