import { test, expect } from '../../src/fixtures/index';
import * as allure from 'allure-js-commons';

test.describe('Cart Page', () => {
  test.describe('Cart Items', () => {
    test('should display added product in cart @smoke', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Cart Page');
      await allure.feature('Cart Items');
      await allure.story('Display Added Products in Cart');
      await allure.severity('critical');

      // Arrange — add a product via UI
      const productName = 'Bolt Cutters';
      await homePage.navigate();
      await homePage.clickProductByName(productName);
      await productPage.assertProductPageLoaded();
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();

      // Act
      await cartPage.navigate();

      // Assert
      await cartPage.assertCartPageLoaded();
      await cartPage.assertItemInCart(productName);

      // Cleanup
      await cartPage.removeItemByName(productName);
      await cartPage.toast.assertProductDeleted();
    });

    test('should display correct cart item count @regression', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Cart Page');
      await allure.feature('Cart Items');
      await allure.story('Display Correct Cart Item Count');
      await allure.severity('normal');

      // Arrange — add two DIFFERENT named products
      await homePage.navigate();
      await homePage.clickProductByName('Bolt Cutters');
      await productPage.assertProductPageLoaded();
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();

      await homePage.navigate();
      await homePage.clickProductByName('Hammer');
      await productPage.assertProductPageLoaded();
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();

      // Act
      await cartPage.navigate();

      // Assert
      await cartPage.assertCartPageLoaded();
      await cartPage.assertCartItemCount(2);

      // Cleanup
      await cartPage.removeAllItems();
    });

    test('should display cart total @smoke', async ({ homePage, productPage, cartPage }) => {
      // Allure
      await allure.epic('Cart Page');
      await allure.feature('Cart Items');
      await allure.story('Display Correct Cart Total');
      await allure.severity('normal');

      // Arrange
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();

      // Act
      await cartPage.navigate();

      // Assert
      const total = await cartPage.getCartTotal();
      expect(parseFloat(total.replace('$', ''))).toBeGreaterThan(0);
    });
  });

  test.describe('Cart Management', () => {
    test('should remove item from cart by name @smoke', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Cart Page');
      await allure.feature('Cart Items');
      await allure.story('Remove Item from Cart by Name');
      await allure.severity('normal');

      // Arrange
      const productName = 'Bolt Cutters';
      await homePage.navigate();
      await homePage.clickProductByName(productName);
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();
      await cartPage.navigate();
      await cartPage.assertItemInCart(productName);

      // Act
      await cartPage.removeItemByName(productName);

      // Assert
      await cartPage.toast.assertProductDeleted();
      await cartPage.assertItemNotInCart(productName);
    });

    test('should show empty cart message after removing all items @regression', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Cart Page');
      await allure.feature('Cart Items');
      await allure.story('Show Empty Cart Message After Removing All Items');
      await allure.severity('normal');

      // Arrange
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();
      await cartPage.navigate();

      // Act
      await cartPage.removeItemByIndex(0);
      await cartPage.toast.assertProductDeleted();

      // Assert
      await cartPage.assertCartIsEmpty();
    });

    test('should update item quantity in cart @regression', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Cart Page');
      await allure.feature('Cart Items');
      await allure.story('Update Item Quantity in Cart');
      await allure.severity('normal');

      // Arrange
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();
      await cartPage.navigate();

      // Act
      await cartPage.updateItemQuantity(0, 3);

      // Assert
      await cartPage.toast.assertQuantityUpdated();
      const quantity = await cartPage.getItemQuantityByIndex(0);
      expect(quantity).toBe('3');

      // Cleanup
      await cartPage.removeItemByIndex(0);
      await cartPage.toast.assertProductDeleted();
    });
  });

  test.describe('Checkout', () => {
    test('should proceed to checkout when logged in @smoke', async ({
      homePage,
      productPage,
      cartPage,
    }) => {
      // Allure
      await allure.epic('Cart Page');
      await allure.feature('Cart Items');
      await allure.story('Proceed to Checkout When Logged In');
      await allure.severity('normal');

      // Arrange
      await homePage.navigate();
      await homePage.clickProductByIndex(0);
      await productPage.addToCart();
      await productPage.toast.assertProductAddedToCart();
      await cartPage.navigate();

      // Act
      await cartPage.proceedToCheckout();

      // Assert — URL changes to next checkout step
      await cartPage.assertUrl(/\/checkout/);
    });
  });
});
