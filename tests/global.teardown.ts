import { test as teardown } from '@playwright/test';

teardown('close browser after all tests', async ({ page }) => {
  await page.close();
});
