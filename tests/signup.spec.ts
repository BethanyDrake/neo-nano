import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('sign up and post a comment', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('navigation').getByRole('button', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(faker.internet.email());

  await page.getByRole('textbox', { name: 'Password' }).fill('Test1234!');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Accept' }).click();
  await page.getByRole('main').getByRole('button', { name: 'Browse Forum' }).click();
  await page.getByRole('link', { name: 'General Discussion' }).click();
  await page.getByRole('button', { name: 'Create Thread' }).click();
  const threadTitle = faker.book.title()
  const firstCommentBody = faker.lorem.paragraph()
  await page.getByRole('textbox', { name: 'Title:' }).fill(threadTitle);
  await page.locator('.ql-editor').fill(firstCommentBody);
  await page.getByRole('button', { name: 'Post!' }).click();

  await page.getByRole('link', { name: `${threadTitle}` }).click();
  await page.getByRole('button', { name: 'Add Comment' }).click();
  await page.locator('.ql-editor').fill(faker.lorem.paragraph());
  await page.getByRole('button', { name: 'Post!' }).click();
});