import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ToastComponent {
  private readonly page: Page;
  private readonly successToast: Locator;
  private readonly errorToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successToast = page.locator('.toast-success');
    this.errorToast = page.locator('.toast-error');
  }

  // ─── Getters ───────────────────────────────────────────────────

  async getSuccessMessage(): Promise<string> {
    await this.successToast.waitFor({ state: 'visible' });
    return this.successToast.locator('.toast-message').innerText();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorToast.waitFor({ state: 'visible' });
    return this.errorToast.locator('.toast-message').innerText();
  }

  // ─── Assertions ────────────────────────────────────────────────

  async assertSuccessToastVisible(): Promise<void> {
    await expect(this.successToast).toBeVisible();
  }

  async assertErrorToastVisible(): Promise<void> {
    await expect(this.errorToast).toBeVisible();
  }

  async assertSuccessMessage(expectedText: string): Promise<void> {
    const specificToast = this.page.locator('.toast-success', {
      hasText: expectedText,
    });
    await specificToast.waitFor({ state: 'visible' });
    await expect(specificToast).toBeVisible();
  }

  async assertErrorMessage(expectedText: string): Promise<void> {
    await this.errorToast.waitFor({ state: 'visible' });
    await expect(this.errorToast).toContainText(expectedText);
  }

  async assertToastHidden(): Promise<void> {
    await expect(this.successToast).toBeHidden();
  }

  async assertProductDeleted(): Promise<void> {
    await this.assertSuccessMessage('toasts.product-deleted');
  }

  async assertQuantityUpdated(): Promise<void> {
    await this.assertSuccessMessage('toasts.product-quantity-updated');
  }

  async assertProductAddedToCart(): Promise<void> {
    await this.assertSuccessMessage('toasts.product-added-to-cart');
  }
}
