import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class NavigationComponent {
  private readonly page: Page;

  // ─── Locators ──────────────────────────────────────────────────
  private readonly homeLink: Locator;
  private readonly signInLink: Locator;
  private readonly cartIcon: Locator;
  private readonly accountMenu: Locator;
  private readonly categoriesMenu: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByTestId('nav-home');
    this.signInLink = page.getByTestId('nav-sign-in');
    this.cartIcon = page.getByTestId('nav-cart');
    this.accountMenu = page.getByTestId('nav-menu');
    this.categoriesMenu = page.getByTestId('nav-categories');
    this.pageTitle = page.getByTestId('page-title');
  }

  // ─── Navigation Actions ────────────────────────────────────────

  async clickHome(): Promise<void> {
    await this.homeLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickCart(): Promise<void> {
    await this.cartIcon.waitFor({ state: 'visible' });
    await this.cartIcon.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickAccountMenu(): Promise<void> {
    await this.accountMenu.waitFor({ state: 'visible' });
    await this.accountMenu.click();
  }

  async clickCategories(): Promise<void> {
    await this.categoriesMenu.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ─── State Checks ──────────────────────────────────────────────

  async isUserLoggedIn(): Promise<boolean> {
    return this.accountMenu.isVisible();
  }

  async isCartVisible(): Promise<boolean> {
    return this.cartIcon.isVisible();
  }

  async isSignInVisible(): Promise<boolean> {
    return this.signInLink.isVisible();
  }

  // ─── Assertions ────────────────────────────────────────────────

  async assertUserIsLoggedIn(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.signInLink).toBeHidden();
  }

  async assertUserIsLoggedOut(): Promise<void> {
    await expect(this.signInLink).toBeVisible();
    await expect(this.accountMenu).toBeHidden();
  }

  async assertCartIsVisible(): Promise<void> {
    await expect(this.cartIcon).toBeVisible();
  }

  async assertCartIsHidden(): Promise<void> {
    await expect(this.cartIcon).toBeHidden();
  }

  async assertOnHomePage(): Promise<void> {
    await expect(this.page).toHaveURL('/');
  }
}
