import { test, expect } from '@playwright/test';

test('browse as guest', async ({ page }) => {

  // landing page
  await page.goto('http://localhost:3000/');
  await page.locator('summary').filter({ hasText: 'What\'s Novel November?' }).click();
  await page.getByRole('heading', { name: 'What\'s Novel November?' }).click();
  await page.getByRole('heading', { name: 'What\'s the 80 Hour Edit?' }).click();

  // forum
  await page.getByRole('link', { name: 'Browse forums as guest' }).click();
  await page.getByRole('link', { name: 'Some Topic' }).click();
  await page.getByRole('link', { name: 'Some Category' }).click();

  // analytics page
  await page.getByRole('button', {name: 'open navigation menu'}).click()
  await page.getByRole('menuitem', { name: 'Analytics' }).click();
  await expect(page.getByRole('heading', { name: 'Pyramid of Progress' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Trophies Awarded' })).toBeVisible()

  // code of conduct
  await page.getByRole('button', {name: 'open navigation menu'}).click()
  await page.getByRole('menuitem', { name: 'Code of Conduct' }).click();
  await expect(page.getByRole('heading', { name: 'Code of Conduct' })).toBeVisible()

  // about
  await page.getByRole('button', {name: 'open navigation menu'}).click()
  await page.getByRole('menuitem', { name: 'About' }).click();
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Technology' })).toBeVisible()

  // toolbox
  await page.getByRole('button', {name: 'open navigation menu'}).click()
  await page.getByRole('menuitem', { name: 'Tools' }).click();
  await expect(page.getByRole('heading', { name: 'Toolbox' })).toBeVisible()
  await page.getByRole('button', {name: 'open navigation menu'}).click()
  await expect(page.getByRole('link', { name: 'Sprint timer Set a timer,' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Focus clock Just start' })).toBeVisible()
});
