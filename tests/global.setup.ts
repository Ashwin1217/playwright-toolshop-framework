import { test as setup, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
const env = process.env['ENV'] || 'dev';
dotenv.config({ path: path.resolve(__dirname, `../config/environments/${env}.env`) });

// Path where authenticated state will be saved
export const USER_AUTH_FILE = path.join(__dirname, '../.auth/user.json');
export const ADMIN_AUTH_FILE = path.join(__dirname, '../.auth/admin.json');

// Regular user authentication setup
setup('authenticate as regular user', async ({ page }) => {
  // Navigate to login page
  await page.goto('/auth/login');

  // Fill in credentials from environment variables
  await page.getByTestId('email').fill(process.env['TEST_USER_EMAIL'] ?? '');
  await page.getByTestId('password').fill(process.env['TEST_USER_PASSWORD'] ?? '');

  // Submit login form
  await page.getByTestId('login-submit').click();

  // Wait for successful login - verify we're on the home page
  await expect(page).toHaveURL('/');

  // Save authenticated browser state to file
  await page.context().storageState({ path: USER_AUTH_FILE });
});

// Admin user authentication setup
setup('authenticate as admin user', async ({ page }) => {
  // Navigate to login page
  await page.goto('/auth/login');

  // Fill in admin credentials from environment variables
  await page.getByTestId('email').fill(process.env['ADMIN_USER_EMAIL'] ?? '');
  await page.getByTestId('password').fill(process.env['ADMIN_USER_PASSWORD'] ?? '');

  // Submit login form
  await page.getByTestId('login-submit').click();

  // Wait for successful admin login
  await expect(page).toHaveURL('/');

  // Save admin authenticated browser state to file
  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});
