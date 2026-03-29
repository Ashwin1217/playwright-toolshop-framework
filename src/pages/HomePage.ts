import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // ─── Locators ──────────────────────────────────────────────────
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly sortDropdown: Locator;
  private readonly productCards: Locator;
  private readonly searchCompletedProductCards: Locator;
  private readonly sortingCompletedProductCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.sortDropdown = page.getByTestId('sort');
    this.searchCompletedProductCards = page.getByTestId('search_completed');
    this.sortingCompletedProductCards = page.getByTestId('sorting_completed');
    this.productCards = page.locator('a[data-test^="product-"]');
  }

  // ─── Navigation ────────────────────────────────────────────────

  async navigate(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  // ─── Search ────────────────────────────────────────────────────

  async searchForProduct(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchInput, searchTerm);
    await this.clickElement(this.searchButton);
    await this.waitForVisible(this.searchCompletedProductCards);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  async getSearchInputValue(): Promise<string> {
    return this.searchInput.inputValue();
  }

  // ─── Sorting ───────────────────────────────────────────────────

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
    await this.waitForVisible(this.sortingCompletedProductCards);
  }

  // ─── Product Cards ─────────────────────────────────────────────

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getProductCardByIndex(index: number): Promise<Locator> {
    return this.productCards.nth(index);
  }

  async getProductNameByIndex(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    return card.locator('[data-test="product-name"]').innerText();
  }

  async getProductPriceByIndex(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    return card.locator('[data-test="product-price"]').innerText();
  }

  async clickProductByIndex(index: number): Promise<void> {
    await this.productCards.nth(index).click();
    await this.waitForPageLoad();
  }

  async clickProductByName(name: string): Promise<void> {
    await this.page.locator('[data-test="product-name"]').filter({ hasText: name }).first().click();
    await this.waitForPageLoad();
  }

  // ─── Assertions ────────────────────────────────────────────────

  async assertHomePageLoaded(): Promise<void> {
    await this.assertUrl('/');
    await this.assertElementVisible(this.searchInput);
    await this.assertElementVisible(this.searchButton);
  }

  async assertProductsVisible(): Promise<void> {
    await this.assertElementVisible(this.productCards.first());
  }

  async assertProductCountGreaterThan(count: number): Promise<void> {
    const actual = await this.getProductCount();
    if (actual <= count) {
      throw new Error(`Expected more than ${count} products but found ${actual}`);
    }
  }

  async assertSearchResultsContain(searchTerm: string): Promise<void> {
    const count = await this.getProductCount();
    for (let i = 0; i < count; i++) {
      const name = await this.getProductNameByIndex(i);
      if (!name.toLowerCase().includes(searchTerm.toLowerCase())) {
        throw new Error(`Product "${name}" does not contain search term "${searchTerm}"`);
      }
    }
  }
}
