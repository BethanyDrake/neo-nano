import { Page } from '@playwright/test'

export const addAGoal = async (page: Page, details: { title?: string, visibility?: string} = {}) => {
  await page.getByRole('button', { name: 'add goal' }).click()
  await page.getByRole('textbox', { name: 'Title:' }).fill(details.title ?? 'Novel November')
  await page.getByRole('spinbutton', { name: 'Duration:' }).fill('30')
  await page.getByLabel('progress unit').selectOption('words')
  await page.getByRole('spinbutton', { name: 'Target:' }).fill('50000')
  await page.getByRole('textbox', { name: 'Start Date:' }).fill('2025-11-01')
await page.getByLabel('Visibility:').selectOption(details.visibility ?? 'private');
  await page.getByRole('button', { name: 'Save' }).click()
}
