import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from '../components/NavigationComponent';
import { ToastComponent } from '../components/ToastComponent';

export class ProductPage extends BasePage {
  // ─── Components ────────────────────────────────────────────────
  public readonly nav: NavigationComponent;
  public readonly toast: ToastComponent;

  // ─── Locators ──────────────────────────────────────────────────
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productDescription: Locator;
  private readonly productImage: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.toast = new ToastComponent(page);
    this.productName = page.getByTestId('product-name');
    this.productPrice = page.getByTestId('unit-price');
    this.productDescription = page.getByTestId('product-description');
    this.productImage = page.locator('figure img[src*="assets/img/products/"]');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
  }

  // ─── Navigation ────────────────────────────────────────────────

  async navigateToProduct(productId: string): Promise<void> {
    await this.navigateTo(`/product/${productId}`);
    await this.waitForPageLoad();
  }

  // ─── Getters ───────────────────────────────────────────────────

  async getProductName(): Promise<string> {
    return this.productName.innerText();
  }

  async getProductPrice(): Promise<string> {
    return this.productPrice.innerText();
  }

  async getProductDescription(): Promise<string> {
    return this.productDescription.innerText();
  }

  async getQuantityValue(): Promise<string> {
    return this.quantityInput.inputValue();
  }

  // ─── Actions ───────────────────────────────────────────────────

  async setQuantity(quantity: number): Promise<void> {
    await this.fillInput(this.quantityInput, quantity.toString());
  }

  async addToCart(): Promise<void> {
    await this.clickElement(this.addToCartButton);
  }

  async addToCartWithQuantity(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  // ─── Assertions ────────────────────────────────────────────────

  async assertProductPageLoaded(): Promise<void> {
    await this.assertUrl(/\/product\/.+/);
    await this.assertElementVisible(this.productName);
    await this.assertElementVisible(this.productPrice);
    await this.assertElementVisible(this.addToCartButton);
    await this.waitForVisible(this.addToCartButton);
  }

  async assertProductName(expectedName: string): Promise<void> {
    await this.assertElementText(this.productName, expectedName);
  }

  async assertProductPrice(expectedPrice: string): Promise<void> {
    await this.assertElementText(this.productPrice, expectedPrice);
  }

  async assertProductImageVisible(): Promise<void> {
    await this.assertElementVisible(this.productImage);
  }

  async assertAddToCartEnabled(): Promise<void> {
    await this.assertElementVisible(this.addToCartButton);
  }

  async assertQuantityValue(expectedQuantity: string): Promise<void> {
    const actual = await this.getQuantityValue();
    if (actual !== expectedQuantity) {
      throw new Error(`Expected quantity "${expectedQuantity}" but found "${actual}"`);
    }
  }
}
