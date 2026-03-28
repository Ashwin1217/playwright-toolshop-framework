import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ─── Locators ──────────────────────────────────────────────────
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.errorMessage = page.getByTestId('login-error');
    this.forgotPasswordLink = page.getByTestId('forgot-password-link');
    this.registerLink = page.getByTestId('register-link');
  }

  // ─── Actions ───────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.navigateTo('/auth/login');
    await this.waitForPageLoad();
  }

  async enterEmail(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  async clickRegisterLink(): Promise<void> {
    await this.clickElement(this.registerLink);
  }

  // ─── Getters ───────────────────────────────────────────────────

  async getErrorMessage(): Promise<string> {
    return this.getElementText(this.errorMessage);
  }

  // ─── Assertions ────────────────────────────────────────────────

  async assertLoginPageLoaded(): Promise<void> {
    await this.assertUrl('/auth/login');
    await this.assertElementVisible(this.emailInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.loginButton);
  }

  async assertErrorMessageVisible(): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
  }

  async assertErrorMessageText(expectedText: string): Promise<void> {
    await this.assertElementText(this.errorMessage, expectedText);
  }

  async assertLoginButtonEnabled(): Promise<void> {
    await this.assertElementVisible(this.loginButton);
  }
}
