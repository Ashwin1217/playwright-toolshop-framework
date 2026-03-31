import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from '../components/NavigationComponent';
import { ToastComponent } from '../components/ToastComponent';

export class CartPage extends BasePage {
  // ─── Components ────────────────────────────────────────────────
  public readonly nav: NavigationComponent;
  public readonly toast: ToastComponent;

  // ─── Page Level Locators ───────────────────────────────────────
  private readonly cartRows: Locator;
  private readonly cartTotal: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly currentStageIsCart: Locator;
  private readonly cartQuantity: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.toast = new ToastComponent(page);
    this.cartTotal = page.getByTestId('cart-total');
    this.cartQuantity = page.getByTestId('cart-quantity');
    this.proceedToCheckoutButton = page.getByTestId('proceed-1');
    this.cartRows = page.locator('tbody tr');
    this.currentStageIsCart = page.locator('li.current', {
      hasText: 'Cart',
    });
    this.emptyCartMessage = page.locator('p.ng-star-inserted', {
      hasText: 'The cart is empty',
    });
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
    return parseInt(await this.cartQuantity.innerText());
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
    const input = this.productQuantity(row);
    await input.waitFor({ state: 'visible' });
    await input.click({ clickCount: 3 }); // select all text
    await input.fill(quantity.toString());
    await input.blur(); // trigger update event
    await this.waitForPageLoad();
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

  async removeAllItems(): Promise<void> {
    const count = await this.getCartItemCount();
    for (let i = count - 1; i >= 0; i--) {
      await this.removeItemByIndex(0);
      await this.toast.assertProductDeleted();
    }
  }

  // ─── Assertions ────────────────────────────────────────────────

  async assertCartPageLoaded(): Promise<void> {
    await this.assertUrl('/checkout');
    await this.assertElementVisible(this.currentStageIsCart);
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
    await this.assertElementVisible(this.emptyCartMessage);
  }
}
