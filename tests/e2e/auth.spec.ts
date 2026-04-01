import { test } from '../../src/fixtures/index';

test.describe('Authentication', () => {
  // Override storageState — auth tests must start logged out
  test.use({ storageState: { cookies: [], origins: [] } });

  test.describe('Login', () => {
    test('should login successfully with valid credentials @smoke', async ({ loginPage, nav }) => {
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
      // Act
      await loginPage.navigate();

      // Assert
      await loginPage.assertLoginPageLoaded();
    });
  });
});
