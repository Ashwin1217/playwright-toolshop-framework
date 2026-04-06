import { test } from '../../src/fixtures/index';
import * as allure from 'allure-js-commons';

test.describe('Authentication', () => {
  // Override storageState — auth tests must start logged out
  test.use({ storageState: { cookies: [], origins: [] } });

  test.describe('Login', () => {
    test('should login successfully with valid credentials @smoke', async ({ loginPage, nav }) => {
      // Allure
      await allure.epic('Authentication');
      await allure.feature('Login');
      await allure.story('Valid Login');
      await allure.severity('critical');

      // Arrange
      const email = process.env['TEST_USER_EMAIL'] ?? '';
      const password = process.env['TEST_USER_PASSWORD'] ?? '';

      // Act
      await loginPage.navigate();
      await loginPage.login(email, password);

      // Assert
      await nav.assertUserIsLoggedIn();
    });

    test('should show error message with invalid credentials @regression', async ({
      loginPage,
    }) => {
      // Allure
      await allure.epic('Authentication');
      await allure.feature('Login');
      await allure.story('Invalid Login');
      await allure.severity('normal');
      // Arrange
      const invalidEmail = 'invalid@test.com';
      const invalidPassword = 'wrongpassword';

      // Act
      await loginPage.navigate();
      await loginPage.login(invalidEmail, invalidPassword);

      // Assert
      await loginPage.assertErrorMessageVisible();
    });

    test('should show error with valid email but wrong password @regression', async ({
      loginPage,
    }) => {
      // Allure
      await allure.epic('Authentication');
      await allure.feature('Login');
      await allure.story('Wrong Password');
      await allure.severity('normal');

      // Arrange
      const email = process.env['TEST_USER_EMAIL'] ?? '';
      const wrongPassword = 'wrongpassword123';

      // Act
      await loginPage.navigate();
      await loginPage.login(email, wrongPassword);

      // Assert
      await loginPage.assertErrorMessageVisible();
    });

    test('should display login form elements correctly @smoke', async ({ loginPage }) => {
      // Allure
      await allure.epic('Authentication');
      await allure.feature('Login');
      await allure.story('Login Form');
      await allure.severity('minor');

      // Act
      await loginPage.navigate();

      // Assert
      await loginPage.assertLoginPageLoaded();
    });
  });
});
