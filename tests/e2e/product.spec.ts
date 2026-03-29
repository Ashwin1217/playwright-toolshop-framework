import { test, expect } from '../../src/fixtures/index';

test.describe('Product Page', () => {
  test.describe('Product Details', () => {
    test('should display product details correctly @smoke', async ({ homePage, productPage }) => {
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
      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);

      // Assert
      await productPage.assertProductPageLoaded();
      const price = await productPage.getProductPrice();
      expect(parseFloat(price)).toBeGreaterThan(0);
    });

    test('should display product description @regression', async ({ homePage, productPage }) => {
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
    }) => {
      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.assertProductPageLoaded();
      await productPage.addToCart();

      // Assert
      await productPage.toast.assertSuccessMessage('Product added to shopping cart');
    });

    test('should add product to cart with default quantity @regression', async ({
      homePage,
      productPage,
    }) => {
      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.assertProductPageLoaded();

      // Assert default quantity is 1
      await productPage.assertQuantityValue('1');

      // Act
      await productPage.addToCart();

      // Assert
      await productPage.toast.assertSuccessMessage('Product added to shopping cart');
      //await productPage.nav.assertCartIsVisible();
    });

    test('should add product to cart with custom quantity @regression', async ({
      homePage,
      productPage,
    }) => {
      // Act
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.assertProductPageLoaded();
      await productPage.addToCartWithQuantity(3);

      // Assert
      await productPage.toast.assertSuccessMessage('Product added to shopping cart');
    });
  });

  test.describe('Product Navigation', () => {
    test('should navigate back to home when clicking home nav @regression', async ({
      homePage,
      productPage,
    }) => {
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
