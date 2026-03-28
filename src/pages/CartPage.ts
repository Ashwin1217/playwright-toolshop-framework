import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from '../components/NavigationComponent';

export class CartPage extends BasePage {
  // ─── Components ────────────────────────────────────────────────
  public readonly nav: NavigationComponent;

  // ─── Page Level Locators ───────────────────────────────────────
  private readonly cartRows: Locator;
  private readonly cartTotal: Locator;
  private readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.cartRows = page.locator('tbody tr');
    this.cartTotal = page.getByTestId('cart-total');
    this.proceedToCheckoutButton = page.getByTestId('proceed-1');
  }

  // ─── Child Locators (scoped to a cart row) ─────────────────────

  private productTitle(row: Locator): Locator {
    return row.locator('[data-test="product-title"]');
  }

  private productPrice(row: Locator): Locator {
    return row.locator('[data-test="product-price"]');
  }

  private productQuantity(row: Locator): Locator {
    return row.locator('[data-test="product-quantity"]');
  }

  private removeButton(row: Locator): Locator {
    return row.locator('.btn-danger');
  }

  // ─── Navigation ────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.navigateTo('/checkout');
    await this.waitForPageLoad();
  }

  // ─── Getters ───────────────────────────────────────────────────

  async getCartItemCount(): Promise<number> {
    return this.cartRows.count();
  }

  async getCartTotal(): Promise<string> {
    return this.cartTotal.innerText();
  }

  async getItemNameByIndex(index: number): Promise<string> {
    const row = this.cartRows.nth(index);
    return this.productTitle(row).innerText();
  }

  async getItemPriceByIndex(index: number): Promise<string> {
    const row = this.cartRows.nth(index);
    return this.productPrice(row).innerText();
  }

  async getItemQuantityByIndex(index: number): Promise<string> {
    const row = this.cartRows.nth(index);
    return this.productQuantity(row).inputValue();
  }

  // ─── Actions ───────────────────────────────────────────────────

  async updateItemQuantity(index: number, quantity: number): Promise<void> {
    const row = this.cartRows.nth(index);
    await this.fillInput(this.productQuantity(row), quantity.toString());
  }

  async removeItemByIndex(index: number): Promise<void> {
    const row = this.cartRows.nth(index);
    await this.clickElement(this.removeButton(row));
    await this.waitForPageLoad();
  }

  async removeItemByName(productName: string): Promise<void> {
    const row = this.cartRows.filter({
      has: this.page.locator('[data-test="product-title"]', {
        hasText: productName,
      }),
    });
    await this.clickElement(this.removeButton(row));
    await this.waitForPageLoad();
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.proceedToCheckoutButton);
    await this.waitForPageLoad();
  }

  // ─── Assertions ────────────────────────────────────────────────

  async assertCartPageLoaded(): Promise<void> {
    await this.assertUrl('/checkout');
    await this.assertElementVisible(this.proceedToCheckoutButton);
  }

  async assertCartItemCount(expectedCount: number): Promise<void> {
    const actual = await this.getCartItemCount();
    if (actual !== expectedCount) {
      throw new Error(`Expected ${expectedCount} items in cart but found ${actual}`);
    }
  }

  async assertItemInCart(productName: string): Promise<void> {
    const matchingRow = this.cartRows.filter({
      has: this.page.locator('[data-test="product-title"]', {
        hasText: productName,
      }),
    });
    await this.assertElementVisible(matchingRow);
  }

  async assertItemNotInCart(productName: string): Promise<void> {
    const matchingRow = this.cartRows.filter({
      has: this.page.locator('[data-test="product-title"]', {
        hasText: productName,
      }),
    });
    await this.waitForHidden(matchingRow);
  }

  async assertCartTotal(expectedTotal: string): Promise<void> {
    await this.assertElementText(this.cartTotal, expectedTotal);
  }

  async assertCartIsEmpty(): Promise<void> {
    const count = await this.getCartItemCount();
    if (count !== 0) {
      throw new Error(`Expected cart to be empty but found ${count} items`);
    }
  }
}
