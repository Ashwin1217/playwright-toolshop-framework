import { test, expect } from '../../src/fixtures/index';
import * as allure from 'allure-js-commons';

test.describe('Products API', () => {
  test.describe('GET /products', () => {
    test('should return paginated products list @smoke', async ({ productsApiClient }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Products');
      await allure.story('Pagination');
      await allure.severity('critical');

      // Act
      const response = await productsApiClient.getProducts();

      // Assert — pagination structure
      expect(response.current_page).toBe(1);
      expect(response.per_page).toBe(9);
      expect(response.total).toBe(50);
      expect(response.data).toHaveLength(9);
      expect(response.last_page).toBe(6);
    });

    test('should return products with correct data structure @smoke', async ({
      productsApiClient,
    }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Products');
      await allure.story('Products API Response Structure');
      await allure.severity('critical');

      // Act
      const response = await productsApiClient.getProducts();
      const product = response.data[0];

      // Assert — product structure
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(typeof product.price).toBe('number');
      expect(typeof product.is_location_offer).toBe('boolean');
      expect(typeof product.is_rental).toBe('boolean');
      expect(typeof product.in_stock).toBe('boolean');

      // Assert — nested objects exist
      expect(product.category).toBeDefined();
      expect(product.brand).toBeDefined();
      expect(product.product_image).toBeDefined();
    });

    test('should return correct page when page parameter is provided @regression', async ({
      productsApiClient,
    }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Products');
      await allure.story('Correct Pagination with Page Parameter');
      await allure.severity('normal');

      // Act
      const response = await productsApiClient.getProducts({ page: 2 });

      // Assert
      expect(response.current_page).toBe(2);
      expect(response.data).toHaveLength(9);
      expect(response.from).toBe(10);
      expect(response.to).toBe(18);
    });

    test('should return last page correctly @regression', async ({ productsApiClient }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Products');
      await allure.story('Last Page Pagination');
      await allure.severity('normal');

      // Act
      const response = await productsApiClient.getProducts({ page: 6 });

      // Assert
      expect(response.current_page).toBe(6);
      expect(response.last_page).toBe(6);
      // Last page has remaining products: 50 - (5 * 9) = 5
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data.length).toBeLessThanOrEqual(9);
    });
  });

  test.describe('GET /products/{id}', () => {
    test('should return correct product by id @smoke', async ({ productsApiClient }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Product by ID');
      await allure.story('Return Correct Product by ID');
      await allure.severity('critical');

      // Arrange — get first product id from list
      const list = await productsApiClient.getProducts();
      const firstProduct = list.data[0];

      // Act
      const product = await productsApiClient.getProductById(firstProduct.id);

      // Assert
      expect(product.id).toBe(firstProduct.id);
      expect(product.name).toBe(firstProduct.name);
      expect(product.price).toBe(firstProduct.price);
    });

    test('should return product with all required fields @regression', async ({
      productsApiClient,
    }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Product by ID');
      await allure.story('Return Product with All Required Fields');
      await allure.severity('normal');

      // Arrange
      const list = await productsApiClient.getProducts();
      const productId = list.data[0].id;

      // Act
      const product = await productsApiClient.getProductById(productId);

      // Assert — all fields present
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.category.id).toBeTruthy();
      expect(product.category.name).toBeTruthy();
      expect(product.brand.id).toBeTruthy();
      expect(product.brand.name).toBeTruthy();
      expect(product.product_image.file_name).toBeTruthy();
    });
  });

  test.describe('Search /products', () => {
    test('should return results for valid search term @smoke', async ({ productsApiClient }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Product by Search');
      await allure.story('Return Search Results for Valid Search Term');
      await allure.severity('normal');

      // Act
      const response = await productsApiClient.searchProducts('hammer');

      // Assert
      expect(response.total).toBeGreaterThan(0);
      expect(response.data.length).toBeGreaterThan(0);

      // Assert all results contain search term
      response.data.forEach((product) => {
        expect(product.name.toLowerCase()).toContain('hammer');
      });
    });

    test('should return empty results for invalid search term @regression', async ({
      productsApiClient,
    }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Product by Search');
      await allure.story('Return Empty Results for Invalid Search Term');
      await allure.severity('normal');

      // Act
      const response = await productsApiClient.searchProducts('xyzinvalidproduct123');

      // Assert
      expect(response.total).toBe(0);
      expect(response.data).toHaveLength(0);
    });

    test('should return case insensitive search results @regression', async ({
      productsApiClient,
    }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Get Product by Search');
      await allure.story('Return Case Insensitive Search Results');
      await allure.severity('minor');

      // Act
      const lowerCase = await productsApiClient.searchProducts('hammer');
      const upperCase = await productsApiClient.searchProducts('HAMMER');

      // Assert — same results regardless of case
      expect(lowerCase.total).toBe(upperCase.total);
    });
  });

  test.describe('Authentication API', () => {
    test('should return access token for valid credentials @smoke', async ({ authApiClient }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Authentication');
      await allure.story('Return Access Token for Valid Credentials');
      await allure.severity('critical');

      // Act
      const response = await authApiClient.login({
        email: process.env['TEST_USER_EMAIL'] ?? '',
        password: process.env['TEST_USER_PASSWORD'] ?? '',
      });

      // Assert
      expect(response.access_token).toBeTruthy();
      expect(response.token_type).toBe('bearer');
      expect(response.expires_in).toBeGreaterThan(0);
    });

    test('should return token string for getToken helper @regression', async ({
      authApiClient,
    }) => {
      // Allure
      await allure.epic('Products API');
      await allure.feature('Authentication');
      await allure.story('Return Token for Valid Credentials with getToken Helper');
      await allure.severity('minor');

      // Act
      const token = await authApiClient.getToken(
        process.env['TEST_USER_EMAIL'] ?? '',
        process.env['TEST_USER_PASSWORD'] ?? '',
      );

      // Assert
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });
});
