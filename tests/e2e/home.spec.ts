import { test, expect } from '../../src/fixtures/index';
import * as allure from 'allure-js-commons';

test.describe('Home Page', () => {
  test.describe('Page Load', () => {
    test('should load home page successfully @smoke', async ({ homePage }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Home Page Load');
      await allure.story('Successfully Load Home Page');
      await allure.severity('critical');

      // Act
      await homePage.navigate();

      // Assert
      await homePage.assertHomePageLoaded();
    });

    test('should display products on home page @smoke', async ({ homePage }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Home Page Load');
      await allure.story('Display Products on Home Page');
      await allure.severity('critical');

      // Act
      await homePage.navigate();

      // Assert
      await homePage.assertProductsVisible();
      await homePage.assertProductCountGreaterThan(0);
    });
  });

  test.describe('Search', () => {
    test('should search for a product and return results @smoke', async ({ homePage }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Search');
      await allure.story('Search for Products and Return Results');
      await allure.severity('critical');

      // Arrange
      const searchTerm = 'hammer';

      // Act
      await homePage.navigate();
      await homePage.searchForProduct(searchTerm);

      // Assert
      await homePage.assertProductsVisible();
      await homePage.assertSearchResultsContain(searchTerm);
    });

    test('should show no results for invalid search term @regression', async ({ homePage }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Search');
      await allure.story('Show No Results for Invalid Search Term');
      await allure.severity('normal');

      // Arrange
      const invalidSearchTerm = 'xyzinvalidproduct123';

      // Act
      await homePage.navigate();
      await homePage.searchForProduct(invalidSearchTerm);

      // Assert
      const count = await homePage.getProductCount();
      expect(count).toBe(0);
    });

    test('should clear search and show all products @regression', async ({ homePage }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Search');
      await allure.story('Clear Search and Show All Products');
      await allure.severity('minor');

      // Arrange
      await homePage.navigate();
      await homePage.searchForProduct('hammer');

      // Act
      await homePage.clearSearch();

      // Assert
      await homePage.assertProductCountGreaterThan(0);
    });
  });

  test.describe('Sorting', () => {
    test('should sort products by name ascending @regression', async ({ homePage }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Sorting');
      await allure.story('Sort Products by Name Ascending');
      await allure.severity('normal');

      // Act
      await homePage.navigate();
      await homePage.sortBy('name,asc');

      // Assert
      const firstName = await homePage.getProductNameByIndex(0);
      const secondName = await homePage.getProductNameByIndex(1);
      expect(firstName.localeCompare(secondName)).toBeLessThanOrEqual(0);
    });

    test('should sort products by price ascending @regression', async ({ homePage }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Sorting');
      await allure.story('Sort Products by Price Ascending');
      await allure.severity('normal');

      // Act
      await homePage.navigate();
      await homePage.sortBy('price,asc');

      // Assert
      const firstPrice = await homePage.getProductPriceByIndex(0);
      const secondPrice = await homePage.getProductPriceByIndex(1);
      const first = parseFloat(firstPrice.replace('$', ''));
      const second = parseFloat(secondPrice.replace('$', ''));
      expect(first).toBeLessThanOrEqual(second);
    });
  });

  test.describe('Product Navigation', () => {
    test('should navigate to product page when clicking a product @smoke', async ({
      homePage,
      productPage,
    }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Product Navigation');
      await allure.story('Navigate to Product Page When Clicking a Product');
      await allure.severity('critical');

      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);

      // Assert
      await productPage.assertProductPageLoaded();
    });

    test('should navigate to correct product when clicking by name @regression', async ({
      homePage,
      productPage,
    }) => {
      // Allure
      await allure.epic('Home Page');
      await allure.feature('Product Navigation');
      await allure.story('Navigate to Correct Product When Clicking by Name');
      await allure.severity('critical');

      // Arrange
      const productName = 'Bolt Cutters';

      // Act
      await homePage.navigate();
      await homePage.clickProductByName(productName);

      // Assert
      await productPage.assertProductPageLoaded();
      await productPage.assertProductName(productName);
    });
  });
});
