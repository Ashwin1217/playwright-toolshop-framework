import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { NavigationComponent } from '../components/NavigationComponent';
import { ToastComponent } from '../components/ToastComponent';
import { AuthApiClient } from '../api/AuthApiClient';
import { ProductsApiClient } from '../api/ProductsApiClient';

// ─── Define fixture types ──────────────────────────────────────────

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  nav: NavigationComponent;
  toast: ToastComponent;
};

type ApiFixtures = {
  authApiClient: AuthApiClient;
  productsApiClient: ProductsApiClient;
};

// ─── Extend base test with custom fixtures ─────────────────────────

export const test = base.extend<PageFixtures & ApiFixtures>({
  // Page Object fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  nav: async ({ page }, use) => {
    await use(new NavigationComponent(page));
  },

  toast: async ({ page }, use) => {
    await use(new ToastComponent(page));
  },

  // API Client fixtures
  authApiClient: async ({ request }, use) => {
    await use(new AuthApiClient(request));
  },

  productsApiClient: async ({ request }, use) => {
    await use(new ProductsApiClient(request));
  },
});

// Re-export expect so tests only need one import
export { expect };
