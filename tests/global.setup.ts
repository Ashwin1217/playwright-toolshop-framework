import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
const env = process.env['ENV'] || 'dev';
dotenv.config({ path: path.resolve(__dirname, `../config/environments/${env}.env`) });

// Ensure auth storage directory exists
const authDir = path.join(__dirname, '../.auth');
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Path where authenticated state will be saved
export const USER_AUTH_FILE = path.join(authDir, 'user.json');
export const ADMIN_AUTH_FILE = path.join(authDir, 'admin.json');

//Base URL Validation in CI environment
const baseUrl = process.env.BASE_URL;
if (!baseUrl) throw new Error('BASE_URL is missing in CI');

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
  await expect(page).toHaveURL('/account');

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

  // Wait for successful admin logins
  await expect(page).toHaveURL('/admin/dashboard');

  // Save admin authenticated browser state to file
  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});
