import { test, expect } from '../../src/fixtures/index';
import * as allure from 'allure-js-commons';

test.describe('Product Page', () => {
  test.describe('Product Details', () => {
    test('should display product details correctly @smoke', async ({ homePage, productPage }) => {
      // Allure
      await allure.epic('Product Page');
      await allure.feature('Product Details');
      await allure.story('Display Product Details Correctly');
      await allure.severity('critical');

      // Arrange
      const productName = 'Bolt Cutters';

      // Act
      await homePage.navigate();
      await homePage.clickProductByName(productName);

      // Assert
      await productPage.assertProductPageLoaded();
      await productPage.assertProductName(productName);
      await productPage.assertProductImageVisible();
      await productPage.assertAddToCartEnabled();
    });

    test('should display product price @smoke', async ({ homePage, productPage }) => {
      // Allure
      await allure.epic('Product Page');
      await allure.feature('Product Details');
      await allure.story('Display Product Price Correctly');
      await allure.severity('critical');

      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);

      // Assert
      await productPage.assertProductPageLoaded();
      const price = await productPage.getProductPrice();
      expect(parseFloat(price)).toBeGreaterThan(0);
    });

    test('should display product description @regression', async ({ homePage, productPage }) => {
      // Allure
      await allure.epic('Product Page');
      await allure.feature('Product Details');
      await allure.story('Display Product Description Correctly');
      await allure.severity('normal');

      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);

      // Assert
      await productPage.assertProductPageLoaded();
      const description = await productPage.getProductDescription();
      expect(description.length).toBeGreaterThan(0);
    });
  });

  test.describe('Add to Cart', () => {
    test('should show success toast after adding product to cart @smoke', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Product Page');
      await allure.feature('Add to Cart');
      await allure.story('Show Success Toast After Adding Product to Cart');
      await allure.severity('critical');

      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.assertProductPageLoaded();
      await productPage.addToCart();

      // Assert
      await productPage.toast.assertProductAddedToCart();
      await cartPage.assertCartItemCount(1);
    });

    test('should add product to cart with default quantity @regression', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Product Page');
      await allure.feature('Add to Cart');
      await allure.story('Add Product to Cart with Default Quantity');
      await allure.severity('minor');

      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.assertProductPageLoaded();

      // Assert default quantity is 1
      await productPage.assertQuantityValue('1');

      // Act
      await productPage.addToCart();

      // Assert
      await productPage.toast.assertProductAddedToCart();
      await cartPage.assertCartItemCount(1);
    });

    test('should add product to cart with custom quantity @regression', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Product Page');
      await allure.feature('Add to Cart');
      await allure.story('Add Product to Cart with Custom Quantity');
      await allure.severity('normal');

      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.assertProductPageLoaded();
      await productPage.addToCartWithQuantity(3);

      // Assert
      await productPage.toast.assertProductAddedToCart();
      await cartPage.assertCartItemCount(3);
    });
  });

  test.describe('Product Navigation', () => {
    test('should navigate back to home when clicking home nav @regression', async ({
      homePage,
      productPage,
    }) => {
      // Allure
      await allure.epic('Product Page');
      await allure.feature('Navigation Bar');
      await allure.story('Navigate Back to Home');
      await allure.severity('minor');

      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.assertProductPageLoaded();
      await productPage.nav.clickHome();

      // Assert
      await homePage.assertHomePageLoaded();
    });
  });
});
