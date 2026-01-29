import { test, expect } from '@playwright/test';

test('browse forum as guest', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('summary').filter({ hasText: 'What\'s Novel November?' }).click();
  await page.locator('summary').filter({ hasText: 'What\'s the 80 Hour Edit?' }).click();
  await page.getByRole('link', { name: 'Browse forums as guest' }).click();
  await page.getByRole('link', { name: 'General Discussion' }).click();
  await page.getByRole('link', { name: 'Never do sprints while' }).click();
});
